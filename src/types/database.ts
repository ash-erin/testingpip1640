export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string | null
          cuisine_id: string | null
          meal_type: string | null
          total_time_minutes: number | null
          servings: number | null
          notes: string | null
          likes_count: number
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cuisine_id?: string | null
          meal_type?: string | null
          total_time_minutes?: number | null
          servings?: number | null
          notes?: string | null
          likes_count?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cuisine_id?: string | null
          meal_type?: string | null
          total_time_minutes?: number | null
          servings?: number | null
          notes?: string | null
          likes_count?: number
          created_at?: string | null
        }
      }
      cuisines: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      ingredients: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      recipe_ingredients: {
        Row: {
          recipe_id: string
          ingredient_id: string
          amount: string | null
          descriptor: string | null
          is_optional: boolean | null
        }
        Insert: {
          recipe_id: string
          ingredient_id: string
          amount?: string | null
          descriptor?: string | null
          is_optional?: boolean | null
        }
        Update: {
          recipe_id?: string
          ingredient_id?: string
          amount?: string | null
          descriptor?: string | null
          is_optional?: boolean | null
        }
      }
      recipe_steps: {
        Row: {
          id: string
          recipe_id: string | null
          step_number: number | null
          instruction: string | null
        }
        Insert: {
          id?: string
          recipe_id?: string | null
          step_number?: number | null
          instruction?: string | null
        }
        Update: {
          id?: string
          recipe_id?: string | null
          step_number?: number | null
          instruction?: string | null
        }
      }
      tools: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      recipe_tools: {
        Row: {
          recipe_id: string
          tool_id: string
        }
        Insert: {
          recipe_id: string
          tool_id: string
        }
        Update: {
          recipe_id?: string
          tool_id?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag_id: string
        }
        Insert: {
          recipe_id: string
          tag_id: string
        }
        Update: {
          recipe_id?: string
          tag_id?: string
        }
      }
      recipe_likes: {
        Row: {
          id: string
          recipe_id: string | null
          user_id: string | null
          liked_at: string
        }
        Insert: {
          id?: string
          recipe_id?: string | null
          user_id?: string | null
          liked_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string | null
          user_id?: string | null
          liked_at?: string
        }
      }
      user_saved_recipes: {
        Row: {
          id: string
          user_id: string | null
          recipe_id: string | null
          saved_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          recipe_id?: string | null
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          recipe_id?: string | null
          saved_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          dark_mode: boolean
          location: string | null
          notification_settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          dark_mode?: boolean
          location?: string | null
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          dark_mode?: boolean
          location?: string | null
          notification_settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_cuisines: {
        Row: {
          user_id: string
          cuisine_id: string
        }
        Insert: {
          user_id: string
          cuisine_id: string
        }
        Update: {
          user_id?: string
          cuisine_id?: string
        }
      }
      user_allergies: {
        Row: {
          user_id: string
          ingredient_id: string
        }
        Insert: {
          user_id: string
          ingredient_id: string
        }
        Update: {
          user_id?: string
          ingredient_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}