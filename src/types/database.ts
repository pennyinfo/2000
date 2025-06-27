
// Database schema types for the Self Employment Registration App

export interface Registration {
  id: string;
  uid: string;
  category: string;
  full_name: string;
  address: string;
  whatsapp_number: string;
  panchayath: string;
  ward: string;
  pro_details: string;
  status: "Approved" | "Pending" | "Rejected";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_ml: string;
  actual_fee: number;
  offer_fee: number;
  description: string;
  description_ml: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Panchayath {
  id: string;
  name: string;
  district: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  role: "super" | "local" | "user";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// SQL Table Creation Scripts (for reference)
export const tableSchemas = {
  registrations: `
    CREATE TABLE registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      uid VARCHAR(50) UNIQUE NOT NULL,
      category VARCHAR(100) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      whatsapp_number VARCHAR(15) NOT NULL,
      panchayath VARCHAR(100) NOT NULL,
      ward VARCHAR(10) NOT NULL,
      pro_details TEXT,
      status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Approved', 'Pending', 'Rejected')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  
  categories: `
    CREATE TABLE categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      name_ml VARCHAR(255) NOT NULL,
      actual_fee INTEGER NOT NULL DEFAULT 0,
      offer_fee INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      description_ml TEXT,
      image_url TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  
  panchayaths: `
    CREATE TABLE panchayaths (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      district VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,
  
  admin_users: `
    CREATE TABLE admin_users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('super', 'local', 'user')),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `
};

// Sample data insertion scripts
export const sampleData = {
  categories: `
    INSERT INTO categories (name, name_ml, actual_fee, offer_fee, description, description_ml) VALUES
    ('Pennyekart Free Registration', 'പെന്നികാർട്ട് സൗജന്യ രജിസ്ട്രേഷൻ', 0, 0, 'Free delivery 2PM to 6PM', 'സൗജന്യ ഡെലിവറി 2PM മുതൽ 6PM വരെ'),
    ('Pennyekart Paid Registration', 'പെന്നികാർട്ട് പെയ്ഡ് രജിസ്ട്രേഷൻ', 500, 300, 'Delivery 8AM to 7PM', 'ഡെലിവറി 8AM മുതൽ 7PM വരെ'),
    ('Farmelife', 'ഫാമേലൈഫ്', 800, 400, 'Dairy and poultry farm support', 'പാലുൽപ്പാദനവും കോഴിവളർത്തലും'),
    ('Organelife', 'ഓർഗനേലൈഫ്', 600, 350, 'Organic vegetable gardening', 'ജൈവ പച്ചക്കറി കൃഷി'),
    ('Foodelife', 'ഫുഡേലൈഫ്', 700, 400, 'Food processing opportunities', 'ഭക്ഷ്യ സംസ്കരണ അവസരങ്ങൾ'),
    ('Entrelife', 'എൻട്രേലൈഫ്', 750, 450, 'Skill-based entrepreneurship', 'കഴിവുകൾ അടിസ്ഥാനമാക്കിയുള്ള സംരംഭകത്വം'),
    ('E-life Job Card Registration', 'ഇ-ലൈഫ് ജോബ് കാർഡ് രജിസ്ട്രേഷൻ', 1000, 500, 'Combo registration with discounts', 'കിഴിവുകളോടെ കോമ്പോ രജിസ്ട്രേഷൻ');
  `,
  
  panchayaths: `
    INSERT INTO panchayaths (name, district) VALUES
    ('Amarambalam', 'Malappuram'),
    ('Tirur', 'Malappuram'),
    ('Tanur', 'Malappuram'),
    ('Kuttippuram', 'Malappuram'),
    ('Vengara', 'Malappuram');
  `,
  
  admin_users: `
    INSERT INTO admin_users (username, password_hash, role) VALUES
    ('evaadmin', '$2b$10$hashedpassword1', 'super'),
    ('admin', '$2b$10$hashedpassword2', 'local'),
    ('admin', '$2b$10$hashedpassword3', 'user');
  `
};
