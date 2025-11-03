export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          admin_id: string
          created_at: string | null
          email: string
          name: string
          school_id: string | null
          school_name: string | null
          user_id: string | null
        }
        Insert: {
          admin_id?: string
          created_at?: string | null
          email: string
          name: string
          school_id?: string | null
          school_name?: string | null
          user_id?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          email?: string
          name?: string
          school_id?: string | null
          school_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admins_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
        ]
      }
      health_records: {
        Row: {
          bmi: number | null
          created_at: string | null
          date: string
          h_id: string
          height_cm: number | null
          sickle_cell_status: string | null
          sickle_cell_type: string | null
          stage: string | null
          student_id: string | null
          vision: string | null
          weight_kg: number | null
        }
        Insert: {
          bmi?: number | null
          created_at?: string | null
          date?: string
          h_id?: string
          height_cm?: number | null
          sickle_cell_status?: string | null
          sickle_cell_type?: string | null
          stage?: string | null
          student_id?: string | null
          vision?: string | null
          weight_kg?: number | null
        }
        Update: {
          bmi?: number | null
          created_at?: string | null
          date?: string
          h_id?: string
          height_cm?: number | null
          sickle_cell_status?: string | null
          sickle_cell_type?: string | null
          stage?: string | null
          student_id?: string | null
          vision?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      nutrition_logs: {
        Row: {
          calories: number | null
          created_at: string | null
          date: string
          n_id: string
          present: boolean | null
          protein_g: number | null
          student_id: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string | null
          date?: string
          n_id?: string
          present?: boolean | null
          protein_g?: number | null
          student_id?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string | null
          date?: string
          n_id?: string
          present?: boolean | null
          protein_g?: number | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrition_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      schools: {
        Row: {
          created_at: string | null
          location: string | null
          password: string | null
          school_id: string
          school_name: string
        }
        Insert: {
          created_at?: string | null
          location?: string | null
          password?: string | null
          school_id?: string
          school_name: string
        }
        Update: {
          created_at?: string | null
          location?: string | null
          password?: string | null
          school_id?: string
          school_name?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          age: number | null
          class: string
          created_at: string | null
          gender: string | null
          s_name: string
          school_id: string | null
          student_id: string
        }
        Insert: {
          age?: number | null
          class: string
          created_at?: string | null
          gender?: string | null
          s_name: string
          school_id?: string | null
          student_id?: string
        }
        Update: {
          age?: number | null
          class?: string
          created_at?: string | null
          gender?: string | null
          s_name?: string
          school_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
        ]
      }
      teachers: {
        Row: {
          assigned_class: string | null
          created_at: string | null
          email: string
          school_id: string | null
          t_name: string
          teacher_id: string
          user_id: string | null
        }
        Insert: {
          assigned_class?: string | null
          created_at?: string | null
          email: string
          school_id?: string | null
          t_name: string
          teacher_id?: string
          user_id?: string | null
        }
        Update: {
          assigned_class?: string | null
          created_at?: string | null
          email?: string
          school_id?: string | null
          t_name?: string
          teacher_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["school_id"]
          },
        ]
      }
      vaccination_status: {
        Row: {
          completed_date: string | null
          created_at: string | null
          due_date: string | null
          status: string | null
          student_id: string | null
          v_id: string
          vaccination_type: string | null
          vaccine_name: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          due_date?: string | null
          status?: string | null
          student_id?: string | null
          v_id?: string
          vaccination_type?: string | null
          vaccine_name: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          due_date?: string | null
          status?: string | null
          student_id?: string | null
          v_id?: string
          vaccination_type?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_status_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_school_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
