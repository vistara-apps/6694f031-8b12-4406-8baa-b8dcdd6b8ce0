import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          username: string;
          wallet_address: string;
          email: string;
          subscription_tier: 'free' | 'unlimited' | 'premium';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          username: string;
          wallet_address: string;
          email: string;
          subscription_tier?: 'free' | 'unlimited' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          username?: string;
          wallet_address?: string;
          email?: string;
          subscription_tier?: 'free' | 'unlimited' | 'premium';
          updated_at?: string;
        };
      };
      samples: {
        Row: {
          sample_id: string;
          original_track: string;
          detected_samples: any;
          rights_info: any;
          clearance_status: 'pending' | 'active' | 'cleared' | 'rejected';
          license_terms: any;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          sample_id?: string;
          original_track: string;
          detected_samples: any;
          rights_info: any;
          clearance_status?: 'pending' | 'active' | 'cleared' | 'rejected';
          license_terms?: any;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          sample_id?: string;
          original_track?: string;
          detected_samples?: any;
          rights_info?: any;
          clearance_status?: 'pending' | 'active' | 'cleared' | 'rejected';
          license_terms?: any;
          updated_at?: string;
        };
      };
      rights_holders: {
        Row: {
          rights_holder_id: string;
          name: string;
          contact_info: any;
          managed_samples: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          rights_holder_id?: string;
          name: string;
          contact_info: any;
          managed_samples?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rights_holder_id?: string;
          name?: string;
          contact_info?: any;
          managed_samples?: string[];
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          invoice_id: string;
          sample_id: string;
          user_id: string;
          rights_holder_id: string;
          amount: number;
          status: 'paid' | 'unpaid' | 'overdue';
          payment_method: 'onchain' | 'fiat';
          created_at: string;
          due_date: string;
          paid_at: string | null;
          transaction_hash: string | null;
          ipfs_hash: string | null;
        };
        Insert: {
          invoice_id?: string;
          sample_id: string;
          user_id: string;
          rights_holder_id: string;
          amount: number;
          status?: 'paid' | 'unpaid' | 'overdue';
          payment_method: 'onchain' | 'fiat';
          created_at?: string;
          due_date: string;
          paid_at?: string | null;
          transaction_hash?: string | null;
          ipfs_hash?: string | null;
        };
        Update: {
          invoice_id?: string;
          sample_id?: string;
          user_id?: string;
          rights_holder_id?: string;
          amount?: number;
          status?: 'paid' | 'unpaid' | 'overdue';
          payment_method?: 'onchain' | 'fiat';
          due_date?: string;
          paid_at?: string | null;
          transaction_hash?: string | null;
          ipfs_hash?: string | null;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
