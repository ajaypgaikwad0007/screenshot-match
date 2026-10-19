export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      diet_plan_items: {
        Row: {
          diet_plan_id: string
          food_id: string
          id: string
          meal_date: string
          meal_type: string
          serving_quantity: number
        }
        Insert: {
          diet_plan_id: string
          food_id: string
          id?: string
          meal_date: string
          meal_type: string
          serving_quantity: number
        }
        Update: {
          diet_plan_id?: string
          food_id?: string
          id?: string
          meal_date?: string
          meal_type?: string
          serving_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "diet_plan_items_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diet_plan_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          created_at: string
          daily_calorie_target: number
          end_date: string
          id: string
          start_date: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_calorie_target: number
          end_date: string
          id?: string
          start_date: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_calorie_target?: number
          end_date?: string
          id?: string
          start_date?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      foods: {
        Row: {
          allergens: string[]
          calories: number
          carbohydrates: number
          category: string
          created_at: string
          description: string | null
          dietary_type: string
          fat: number
          fiber: number | null
          id: string
          image_url: string | null
          is_active: boolean
          meal_slots: string[]
          name: string
          protein: number
          serving_size: number
          serving_unit: string
          updated_at: string
        }
        Insert: {
          allergens?: string[]
          calories: number
          carbohydrates?: number
          category: string
          created_at?: string
          description?: string | null
          dietary_type: string
          fat?: number
          fiber?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meal_slots?: string[]
          name: string
          protein?: number
          serving_size: number
          serving_unit?: string
          updated_at?: string
        }
        Update: {
          allergens?: string[]
          calories?: number
          carbohydrates?: number
          category?: string
          created_at?: string
          description?: string | null
          dietary_type?: string
          fat?: number
          fiber?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          meal_slots?: string[]
          name?: string
          protein?: number
          serving_size?: number
          serving_unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      meal_logs: {
        Row: {
          created_at: string
          food_id: string
          id: string
          logged_date: string
          meal_type: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          logged_date?: string
          meal_type: string
          quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          logged_date?: string
          meal_type?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          allergies: string[]
          calc_basis: string | null
          created_at: string
          dietary_preference: string | null
          email: string | null
          exclusions: string[]
          fitness_goal: string | null
          full_name: string
          gender: string | null
          height_cm: number | null
          id: string
          is_active: boolean
          meals_per_day: number
          medical_flag: boolean
          updated_at: string
          water_goal_l: number | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[]
          calc_basis?: string | null
          created_at?: string
          dietary_preference?: string | null
          email?: string | null
          exclusions?: string[]
          fitness_goal?: string | null
          full_name?: string
          gender?: string | null
          height_cm?: number | null
          id: string
          is_active?: boolean
          meals_per_day?: number
          medical_flag?: boolean
          updated_at?: string
          water_goal_l?: number | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          allergies?: string[]
          calc_basis?: string | null
          created_at?: string
          dietary_preference?: string | null
          email?: string | null
          exclusions?: string[]
          fitness_goal?: string | null
          full_name?: string
          gender?: string | null
          height_cm?: number | null
          id?: string
          is_active?: boolean
          meals_per_day?: number
          medical_flag?: boolean
          updated_at?: string
          water_goal_l?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weight_logs: {
        Row: {
          created_at: string
          id: string
          recorded_date: string
          user_id: string
          weight_kg: number
        }
        Insert: {
          created_at?: string
          id?: string
          recorded_date?: string
          user_id: string
          weight_kg: number
        }
        Update: {
          created_at?: string
          id?: string
          recorded_date?: string
          user_id?: string
          weight_kg?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
