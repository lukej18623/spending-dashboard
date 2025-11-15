-- Migration to update Customers table for Sturgeon Excursions booking
-- Removes address and industry fields, keeping only name, phone, email

-- Remove address and industry columns
ALTER TABLE Customers DROP COLUMN IF EXISTS address;
ALTER TABLE Customers DROP COLUMN IF EXISTS industry;

-- Verify table structure
-- Table should now have: id, name, phone, email
