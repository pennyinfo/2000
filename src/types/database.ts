
// Database schema types for the Self Employment Registration App
import { Tables } from "@/integrations/supabase/types";

// Re-export types from Supabase for consistency
export type Registration = Tables<'registrations'>;
export type Category = Tables<'categories'>;
export type Panchayath = Tables<'panchayaths'>;
export type AdminUser = Tables<'admin_users'>;

// SQL Table Creation Scripts (for reference)
export const tableSchemas = {
  registrations: `
    CREATE TABLE registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      full_name TEXT NOT NULL,
      address TEXT,
      whatsapp_number TEXT,
      mobile_number TEXT NOT NULL,
      panchayath TEXT,
      category TEXT,
      status TEXT DEFAULT 'Pending',
      email TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,
  
  categories: `
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      actual_fee NUMERIC NOT NULL,
      offer_fee NUMERIC,
      division TEXT NOT NULL,
      popup_image TEXT
    );
  `,
  
  panchayaths: `
    CREATE TABLE panchayaths (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      malayalam_name TEXT,
      district TEXT NOT NULL
    );
  `,
  
  admin_users: `
    CREATE TABLE admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      role TEXT NOT NULL CHECK (role IN ('super', 'local', 'user')),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
};

// Sample data insertion scripts
export const sampleData = {
  categories: `
    INSERT INTO categories (name, actual_fee, offer_fee, division) VALUES
    ('Pennyekart Free Registration', 0, 0, 'Pennyekart Hybrid-Ecommerce'),
    ('Pennyekart Paid Registration', 500, 300, 'Pennyekart Hybrid-Ecommerce'),
    ('Farmelife', 800, 400, 'E-life Self-Employment'),
    ('Organelife', 600, 350, 'E-life Self-Employment'),
    ('Foodelife', 700, 400, 'E-life Self-Employment'),
    ('Entrelife', 750, 450, 'E-life Self-Employment'),
    ('E-life Job Card Registration', 1000, 500, 'E-life Job Card');
  `,
  
  panchayaths: `
    INSERT INTO panchayaths (name, malayalam_name, district) VALUES
    ('Amarambalam', 'അമരാമ്പലം', 'Malappuram'),
    ('Tirur', 'തിരൂർ', 'Malappuram'),
    ('Tanur', 'തണൂർ', 'Malappuram'),
    ('Kuttippuram', 'കുറ്റിപ്പുറം', 'Malappuram'),
    ('Vengara', 'വേങ്ങര', 'Malappuram');
  `,
  
  admin_users: `
    INSERT INTO admin_users (username, password_hash, role) VALUES
    ('evaadmin', '$2b$10$hashedpassword1', 'super'),
    ('admin', '$2b$10$hashedpassword2', 'local'),
    ('useradmin', '$2b$10$hashedpassword3', 'user');
  `
};
