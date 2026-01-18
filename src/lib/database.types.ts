export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  app: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          amount: number;
          currency: string;
          description: string | null;
          main_image_url: string | null;
          images: string[];
          available_sizes: string[];
          available_colors: string[];
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          amount: number;
          currency?: string;
          description?: string | null;
          main_image_url?: string | null;
          images?: string[];
          available_sizes?: string[];
          available_colors?: string[];
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          amount?: number;
          currency?: string;
          description?: string | null;
          main_image_url?: string | null;
          images?: string[];
          available_sizes?: string[];
          available_colors?: string[];
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      checkout_products: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          selected_size: string | null;
          selected_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          selected_size?: string | null;
          selected_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          selected_size?: string | null;
          selected_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'checkout_products_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'user_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'checkout_products_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types for user profile operations
export type UserProfile = Database['app']['Tables']['user_profiles']['Row'];
export type UserProfileInsert =
  Database['app']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate =
  Database['app']['Tables']['user_profiles']['Update'];

// Helper types for product operations
export type Product = Database['app']['Tables']['products']['Row'];
export type ProductInsert = Database['app']['Tables']['products']['Insert'];
export type ProductUpdate = Database['app']['Tables']['products']['Update'];

// Helper types for checkout product operations
export type CheckoutProduct =
  Database['app']['Tables']['checkout_products']['Row'];
export type CheckoutProductInsert =
  Database['app']['Tables']['checkout_products']['Insert'];
export type CheckoutProductUpdate =
  Database['app']['Tables']['checkout_products']['Update'];
