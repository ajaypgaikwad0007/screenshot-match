create type public.app_role as enum ('admin','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  age int check (age between 10 and 100),
  gender text check (gender in ('male','female','other','prefer_not')),
  calc_basis text check (calc_basis in ('male','female','average')),
  height_cm numeric(5,1) check (height_cm between 100 and 250),
  weight_kg numeric(5,1) check (weight_kg between 25 and 300),
  activity_level text default 'sedentary' check (activity_level in ('sedentary','light','moderate','very','extra')),
  dietary_preference text default 'vegetarian' check (dietary_preference in ('vegetarian','vegan','eggetarian','non_vegetarian')),
  fitness_goal text default 'maintain' check (fitness_goal in ('lose','maintain','gain')),
  allergies text[] not null default '{}',
  exclusions text[] not null default '{}',
  meals_per_day int not null default 5 check (meals_per_day between 3 and 5),
  water_goal_l numeric(3,1),
  medical_flag boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- prevent non-admins toggling is_active
create or replace function public.guard_profile_active() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_active is distinct from old.is_active and not public.has_role(auth.uid(),'admin') then
    new.is_active := old.is_active;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_guard before update on public.profiles for each row execute function public.guard_profile_active();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email) values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.foods (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (category in ('grain','protein','dairy','fruit','vegetable','snack','nuts')),
  description text,
  dietary_type text not null check (dietary_type in ('vegan','vegetarian','eggetarian','non_vegetarian')),
  meal_slots text[] not null default '{}',
  serving_size numeric(6,1) not null,
  serving_unit text not null default 'g',
  calories numeric(6,1) not null check (calories >= 0),
  protein numeric(5,1) not null default 0,
  carbohydrates numeric(5,1) not null default 0,
  fat numeric(5,1) not null default 0,
  fiber numeric(5,1),
  allergens text[] not null default '{}',
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index foods_active_idx on public.foods(is_active, category);
grant select on public.foods to authenticated;
grant insert, update, delete on public.foods to authenticated;
grant all on public.foods to service_role;
alter table public.foods enable row level security;
create policy "foods read" on public.foods for select to authenticated using (is_active or public.has_role(auth.uid(),'admin'));
create policy "foods admin insert" on public.foods for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "foods admin update" on public.foods for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "foods admin delete" on public.foods for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.diet_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  daily_calorie_target int not null,
  status text not null default 'active' check (status in ('active','archived','inactive')),
  created_at timestamptz not null default now()
);
create index diet_plans_user_idx on public.diet_plans(user_id, created_at desc);
grant select, insert, update, delete on public.diet_plans to authenticated;
grant all on public.diet_plans to service_role;
alter table public.diet_plans enable row level security;
create policy "plans own" on public.diet_plans for all to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin')) with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.diet_plan_items (
  id uuid primary key default gen_random_uuid(),
  diet_plan_id uuid not null references public.diet_plans(id) on delete cascade,
  meal_date date not null,
  meal_type text not null check (meal_type in ('breakfast','mid_morning','lunch','evening','dinner')),
  food_id uuid not null references public.foods(id),
  serving_quantity numeric(4,2) not null check (serving_quantity > 0)
);
create index dpi_plan_idx on public.diet_plan_items(diet_plan_id);
grant select, insert, update, delete on public.diet_plan_items to authenticated;
grant all on public.diet_plan_items to service_role;
alter table public.diet_plan_items enable row level security;
create policy "plan items own" on public.diet_plan_items for all to authenticated
  using (exists (select 1 from public.diet_plans p where p.id = diet_plan_id and (p.user_id = auth.uid() or public.has_role(auth.uid(),'admin'))))
  with check (exists (select 1 from public.diet_plans p where p.id = diet_plan_id and p.user_id = auth.uid()));

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  food_id uuid not null references public.foods(id),
  meal_type text not null check (meal_type in ('breakfast','mid_morning','lunch','evening','dinner')),
  quantity numeric(4,2) not null check (quantity > 0 and quantity <= 20),
  logged_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index meal_logs_user_date_idx on public.meal_logs(user_id, logged_date);
grant select, insert, update, delete on public.meal_logs to authenticated;
grant all on public.meal_logs to service_role;
alter table public.meal_logs enable row level security;
create policy "meals own" on public.meal_logs for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  weight_kg numeric(5,1) not null check (weight_kg between 25 and 300),
  recorded_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, recorded_date)
);
grant select, insert, update, delete on public.weight_logs to authenticated;
grant all on public.weight_logs to service_role;
alter table public.weight_logs enable row level security;
create policy "weights own" on public.weight_logs for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into public.foods (name, category, description, dietary_type, meal_slots, serving_size, serving_unit, calories, protein, carbohydrates, fat, fiber, allergens) values
('Whole wheat roti','grain','One medium chapati','vegan','{lunch,dinner}',40,'g',120,3.5,20,3,2.5,'{gluten}'),
('Cooked white rice','grain','Steamed rice, one bowl','vegan','{lunch,dinner}',150,'g',195,4,43,0.4,0.6,'{}'),
('Brown rice','grain','Cooked brown rice, one bowl','vegan','{lunch,dinner}',150,'g',165,3.8,34,1.3,2.7,'{}'),
('Vegetable poha','grain','Flattened rice with peas and onion','vegan','{breakfast}',150,'g',250,5,45,6,2,'{peanut}'),
('Idli with sambar','grain','2 idlis with a bowl of sambar','vegan','{breakfast}',250,'g',230,8,42,3,4,'{}'),
('Plain dosa with chutney','grain','One dosa with coconut chutney','vegan','{breakfast}',180,'g',260,6,38,9,2,'{}'),
('Oats porridge with milk','grain','Rolled oats cooked in milk','vegetarian','{breakfast}',250,'ml',280,11,40,8,4,'{milk,gluten}'),
('Masala oats','grain','Oats cooked with vegetables','vegan','{breakfast}',200,'g',210,7,35,5,5,'{gluten}'),
('Upma','grain','Semolina with vegetables','vegan','{breakfast}',180,'g',240,6,38,7,3,'{gluten}'),
('Vegetable daliya','grain','Broken wheat khichdi','vegan','{breakfast,dinner}',200,'g',220,7,40,4,6,'{gluten}'),
('Moong dal khichdi','grain','Rice and moong dal','vegan','{dinner}',250,'g',300,11,52,5,5,'{}'),
('Toor dal','protein','Cooked dal, one bowl','vegan','{lunch,dinner}',150,'g',165,9,25,3,5,'{}'),
('Rajma curry','protein','Kidney bean curry, one bowl','vegan','{lunch,dinner}',150,'g',190,10,28,4,7,'{}'),
('Chana masala','protein','Chickpea curry, one bowl','vegan','{lunch,dinner}',150,'g',210,10,30,6,8,'{}'),
('Tofu bhurji','protein','Scrambled tofu with spices','vegan','{breakfast,dinner}',150,'g',190,16,6,11,2,'{soy}'),
('Soya chunks curry','protein','Soya chunk curry','vegan','{lunch,dinner}',150,'g',200,20,14,7,5,'{soy}'),
('Paneer bhurji','protein','Scrambled cottage cheese','vegetarian','{breakfast,dinner}',120,'g',290,17,6,22,1,'{milk}'),
('Palak paneer','protein','Spinach with cottage cheese','vegetarian','{lunch,dinner}',150,'g',240,12,9,17,3,'{milk}'),
('Boiled eggs (2)','protein','Two large boiled eggs','eggetarian','{breakfast,evening}',100,'g',155,13,1,11,0,'{egg}'),
('Vegetable omelette','protein','Two-egg omelette with vegetables','eggetarian','{breakfast}',140,'g',200,14,4,14,1,'{egg}'),
('Egg curry','protein','Two eggs in tomato gravy','eggetarian','{lunch,dinner}',200,'g',260,14,9,18,2,'{egg}'),
('Grilled chicken breast','protein','Skinless chicken, grilled','non_vegetarian','{lunch,dinner}',120,'g',200,37,0,5,0,'{}'),
('Chicken curry','protein','Home-style chicken curry','non_vegetarian','{lunch,dinner}',150,'g',260,25,6,15,1,'{}'),
('Fish curry','protein','Rohu/basa in light gravy','non_vegetarian','{lunch,dinner}',150,'g',220,24,5,11,1,'{fish}'),
('Toned milk','dairy','One glass','vegetarian','{breakfast,evening}',200,'ml',120,6.4,9.6,6,0,'{milk}'),
('Plain curd','dairy','One bowl dahi','vegetarian','{lunch,dinner,mid_morning}',150,'g',90,5,7,4.5,0,'{milk}'),
('Buttermilk','dairy','Spiced chaas','vegetarian','{mid_morning,evening}',250,'ml',60,3,7,2,0,'{milk}'),
('Soy milk','dairy','Unsweetened soy milk','vegan','{breakfast,evening}',200,'ml',80,7,4,4,1,'{soy}'),
('Banana','fruit','One medium banana','vegan','{mid_morning,evening,breakfast}',120,'g',105,1.3,27,0.4,3.1,'{}'),
('Apple','fruit','One medium apple','vegan','{mid_morning,evening}',180,'g',95,0.5,25,0.3,4.4,'{}'),
('Papaya','fruit','One bowl cubed','vegan','{mid_morning}',150,'g',65,0.7,16,0.4,2.5,'{}'),
('Guava','fruit','One medium guava','vegan','{mid_morning,evening}',100,'g',68,2.6,14,1,5.4,'{}'),
('Orange','fruit','One medium orange','vegan','{mid_morning}',150,'g',70,1.4,18,0.2,3.6,'{}'),
('Mixed vegetable sabzi','vegetable','Seasonal vegetables, dry','vegan','{lunch,dinner}',150,'g',120,3,14,6,4,'{}'),
('Green salad','vegetable','Cucumber, tomato, carrot, onion','vegan','{lunch,dinner}',150,'g',35,1.5,7,0.2,2.5,'{}'),
('Bhindi masala','vegetable','Okra stir fry','vegan','{lunch,dinner}',150,'g',130,3,12,8,5,'{}'),
('Roasted chana','snack','Roasted Bengal gram','vegan','{evening,mid_morning}',30,'g',110,6,18,2,5,'{}'),
('Sprouts chaat','snack','Moong sprouts with lemon and onion','vegan','{evening,mid_morning}',100,'g',110,8,18,1,4,'{}'),
('Roasted makhana','snack','Fox nuts roasted','vegan','{evening}',25,'g',90,2.5,19,0.3,2,'{}'),
('Mixed nuts','nuts','Almonds, walnuts, cashews','vegan','{mid_morning,evening}',30,'g',180,5,7,15,2.5,'{tree_nut}'),
('Peanut chikki','nuts','Peanut jaggery bar','vegan','{evening}',30,'g',150,4.5,15,8,1.5,'{peanut}'),
('Flax & sunflower seeds','nuts','Mixed seeds','vegan','{mid_morning}',15,'g',85,3,3,7,3,'{}');
