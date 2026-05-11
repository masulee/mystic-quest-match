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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_word_bank: {
        Row: {
          active: boolean
          category: string
          color: string | null
          created_at: string
          id: number
          word: string
        }
        Insert: {
          active?: boolean
          category: string
          color?: string | null
          created_at?: string
          id?: number
          word: string
        }
        Update: {
          active?: boolean
          category?: string
          color?: string | null
          created_at?: string
          id?: number
          word?: string
        }
        Relationships: []
      }
      collected_items: {
        Row: {
          collected_at: string
          id: string
          location_id: number
          reward_id: number
          user_id: string
        }
        Insert: {
          collected_at?: string
          id?: string
          location_id: number
          reward_id: number
          user_id: string
        }
        Update: {
          collected_at?: string
          id?: string
          location_id?: number
          reward_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collected_items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collected_items_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: number
          name: string
          order_index: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name: string
          order_index?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      match_attempts: {
        Row: {
          attempted_at: string
          id: string
          partner_id: string | null
          percentage: number | null
          result: Database["public"]["Enums"]["attempt_result"]
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          partner_id?: string | null
          percentage?: number | null
          result: Database["public"]["Enums"]["attempt_result"]
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          partner_id?: string | null
          percentage?: number | null
          result?: Database["public"]["Enums"]["attempt_result"]
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          dominant_trait: string | null
          id: string
          match_percentage: number
          matched_at: string
          status: Database["public"]["Enums"]["match_status"]
          temperature: number
          user_a_id: string
          user_b_id: string
        }
        Insert: {
          dominant_trait?: string | null
          id?: string
          match_percentage?: number
          matched_at?: string
          status?: Database["public"]["Enums"]["match_status"]
          temperature?: number
          user_a_id: string
          user_b_id: string
        }
        Update: {
          dominant_trait?: string | null
          id?: string
          match_percentage?: number
          matched_at?: string
          status?: Database["public"]["Enums"]["match_status"]
          temperature?: number
          user_a_id?: string
          user_b_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bio: string | null
          birthdate: string | null
          created_at: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          nickname: string | null
          profile_completed: boolean
          provider: Database["public"]["Enums"]["auth_provider"] | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          nickname?: string | null
          profile_completed?: boolean
          provider?: Database["public"]["Enums"]["auth_provider"] | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          nickname?: string | null
          profile_completed?: boolean
          provider?: Database["public"]["Enums"]["auth_provider"] | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          answered_at: string
          id: string
          option_id: number
          quiz_id: number
          trait: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          option_id: number
          quiz_id: number
          trait: string
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          option_id?: number
          quiz_id?: number
          trait?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "quiz_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_options: {
        Row: {
          created_at: string
          id: number
          quiz_id: number
          response_text: string | null
          text: string
          trait: string
        }
        Insert: {
          created_at?: string
          id?: number
          quiz_id: number
          response_text?: string | null
          text: string
          trait: string
        }
        Update: {
          created_at?: string
          id?: number
          quiz_id?: number
          response_text?: string | null
          text?: string
          trait?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: number
          location_id: number
          order_index: number
          question: string
        }
        Insert: {
          created_at?: string
          id?: number
          location_id: number
          order_index?: number
          question: string
        }
        Update: {
          created_at?: string
          id?: number
          location_id?: number
          order_index?: number
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: number
          item_name: string
          location_id: number
          rarity: Database["public"]["Enums"]["rarity_type"]
          trait: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          item_name: string
          location_id: number
          rarity?: Database["public"]["Enums"]["rarity_type"]
          trait: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          item_name?: string
          location_id?: number
          rarity?: Database["public"]["Enums"]["rarity_type"]
          trait?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          current_location_id: number | null
          id: string
          trait_scores: Json
          unlocked_locations: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          current_location_id?: number | null
          id?: string
          trait_scores?: Json
          unlocked_locations?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          current_location_id?: number | null
          id?: string
          trait_scores?: Json
          unlocked_locations?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      are_users_matched: {
        Args: { _user_a: string; _user_b: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_match_participant: {
        Args: { _match_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      attempt_result: "success" | "failed"
      auth_provider: "google" | "instagram" | "apple" | "email"
      gender_type: "male" | "female" | "other"
      match_status: "active" | "ended" | "blocked"
      rarity_type: "common" | "rare" | "legendary"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
      attempt_result: ["success", "failed"],
      auth_provider: ["google", "instagram", "apple", "email"],
      gender_type: ["male", "female", "other"],
      match_status: ["active", "ended", "blocked"],
      rarity_type: ["common", "rare", "legendary"],
    },
  },
} as const
