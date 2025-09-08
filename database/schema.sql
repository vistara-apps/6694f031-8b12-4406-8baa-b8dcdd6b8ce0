-- SampleSafe Database Schema
-- This file contains the complete database schema for the SampleSafe application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'unlimited', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rights holders table
CREATE TABLE rights_holders (
    rights_holder_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact_info JSONB NOT NULL,
    managed_samples TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Samples table
CREATE TABLE samples (
    sample_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_track VARCHAR(255) NOT NULL,
    detected_samples JSONB NOT NULL,
    rights_info JSONB NOT NULL,
    clearance_status VARCHAR(50) DEFAULT 'pending' CHECK (clearance_status IN ('pending', 'active', 'cleared', 'rejected')),
    license_terms JSONB,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ipfs_hash VARCHAR(255),
    file_url TEXT,
    agreement_ipfs_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id UUID NOT NULL REFERENCES samples(sample_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rights_holder_id UUID NOT NULL REFERENCES rights_holders(rights_holder_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue')),
    payment_method VARCHAR(50) DEFAULT 'onchain' CHECK (payment_method IN ('onchain', 'fiat')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    transaction_hash VARCHAR(255),
    ipfs_hash VARCHAR(255)
);

-- Clearance requests table
CREATE TABLE clearance_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sample_id UUID NOT NULL REFERENCES samples(sample_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rights_holder_id UUID NOT NULL REFERENCES rights_holders(rights_holder_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    proposed_terms JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'responded', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_samples_user_id ON samples(user_id);
CREATE INDEX idx_samples_clearance_status ON samples(clearance_status);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_sample_id ON invoices(sample_id);
CREATE INDEX idx_clearance_requests_sample_id ON clearance_requests(sample_id);
CREATE INDEX idx_clearance_requests_user_id ON clearance_requests(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rights_holders_updated_at BEFORE UPDATE ON rights_holders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_samples_updated_at BEFORE UPDATE ON samples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearance_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Samples policies
CREATE POLICY "Users can view own samples" ON samples
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own samples" ON samples
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own samples" ON samples
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Invoices policies
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own invoices" ON invoices
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own invoices" ON invoices
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Clearance requests policies
CREATE POLICY "Users can view own clearance requests" ON clearance_requests
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own clearance requests" ON clearance_requests
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own clearance requests" ON clearance_requests
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Insert some sample rights holders
INSERT INTO rights_holders (name, contact_info) VALUES
('Universal Music Publishing', '{"email": "licensing@ump.com", "phone": "+1-555-0123"}'),
('Sony Music Publishing', '{"email": "clearance@sonymusic.com", "phone": "+1-555-0124"}'),
('Warner Chappell Music', '{"email": "licensing@warnerchappell.com", "phone": "+1-555-0125"}'),
('BMG Rights Management', '{"email": "sync@bmg.com", "phone": "+1-555-0126"}'),
('Kobalt Music Publishing', '{"email": "licensing@kobaltmusic.com", "phone": "+1-555-0127"}');

-- Create a function to automatically create rights holders
CREATE OR REPLACE FUNCTION create_rights_holder_if_not_exists(
    holder_name TEXT,
    contact_email TEXT
) RETURNS UUID AS $$
DECLARE
    holder_id UUID;
BEGIN
    -- Try to find existing rights holder
    SELECT rights_holder_id INTO holder_id
    FROM rights_holders
    WHERE name = holder_name;
    
    -- If not found, create new one
    IF holder_id IS NULL THEN
        INSERT INTO rights_holders (name, contact_info)
        VALUES (holder_name, jsonb_build_object('email', contact_email))
        RETURNING rights_holder_id INTO holder_id;
    END IF;
    
    RETURN holder_id;
END;
$$ LANGUAGE plpgsql;
