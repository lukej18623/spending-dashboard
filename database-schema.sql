-- Service Business Management Database Schema

-- Customers table
CREATE TABLE Customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    industry VARCHAR(100) NOT NULL
);

-- Jobs table
CREATE TABLE Jobs (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES Customers(id) ON DELETE CASCADE,
    service_type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Invoices table
CREATE TABLE Invoices (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES Customers(id) ON DELETE CASCADE,
    invoice_date TIMESTAMP NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL
);

-- Invoice-Jobs junction table (many-to-many)
CREATE TABLE InvoiceJobs (
    invoice_id INTEGER NOT NULL REFERENCES Invoices(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES Jobs(id) ON DELETE CASCADE,
    PRIMARY KEY (invoice_id, job_id)
);

-- Sample data for testing
INSERT INTO Customers (name, phone, email, address, industry) VALUES
('John Smith', '555-0101', 'john@example.com', '123 Main St', 'Lawn Care'),
('Sarah Johnson', '555-0102', 'sarah@example.com', '456 Oak Ave', 'Plumbing'),
('Mike Davis', '555-0103', 'mike@example.com', '789 Pine Rd', 'HVAC');

INSERT INTO Jobs (customer_id, service_type, description, date, status, price) VALUES
(1, 'Lawn Mowing', 'Weekly lawn maintenance', '2024-11-01', 'Completed', 75.00),
(1, 'Hedge Trimming', 'Trim front and back hedges', '2024-11-05', 'Completed', 50.00),
(2, 'Leak Repair', 'Fix kitchen sink leak', '2024-11-03', 'Completed', 150.00),
(3, 'AC Maintenance', 'Annual AC checkup', '2024-11-07', 'Scheduled', 120.00);
