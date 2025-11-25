-- ============================================
-- STURGEON EXCURSIONS - DATABASE SCHEMA
-- Version: 2.0 (Booking System)
-- Date: November 15, 2025
-- ============================================

-- ============================================
-- 1. EXCURSIONS TABLE (Trip Templates)
-- ============================================
-- Defines the types of fishing trips offered
CREATE TABLE Excursions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_hours DECIMAL(4,2) NOT NULL, -- e.g., 4.00, 6.50, 8.00
    base_price DECIMAL(10,2) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 6,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample charter types
INSERT INTO Charters (name, description, duration_hours, base_price, max_capacity) VALUES
('Half-Day Morning Trip', 'Early morning sturgeon fishing adventure. Best for beginners and families.', 4.00, 300.00, 6),
('Half-Day Afternoon Trip', 'Afternoon sturgeon excursion. Perfect for those who like to sleep in.', 4.00, 300.00, 6),
('Full-Day Trophy Hunt', 'All-day expedition targeting trophy sturgeon. Lunch included.', 8.00, 550.00, 4),
('Multi-Day Expedition', 'Two-day intensive fishing trip. Accommodation and meals included.', 16.00, 1200.00, 4);

-- ============================================
-- 2. CUSTOMERS TABLE (Updated)
-- ============================================
-- Keep existing table, but add some fields
ALTER TABLE Customers 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS total_bookings INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_first_timer BOOLEAN DEFAULT true;

-- ============================================
-- 3. BOOKINGS TABLE (Core Business Logic)
-- ============================================
CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES Customers(id) ON DELETE CASCADE,
    charter_id INT NOT NULL REFERENCES Charters(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- 'morning', 'afternoon', 'full-day'
    num_guests INT NOT NULL DEFAULT 1,
    base_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', 
    -- Status values: 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Business rule: Prevent double-booking same charter/date/time
    CONSTRAINT unique_booking UNIQUE(charter_id, booking_date, time_slot),
    
    -- Business rule: Can't book in the past
    CONSTRAINT future_booking CHECK (booking_date >= CURRENT_DATE),
    
    -- Business rule: Valid number of guests
    CONSTRAINT valid_guests CHECK (num_guests > 0 AND num_guests <= 10),
    
    -- Business rule: Valid status
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show'))
);

-- Index for fast availability queries
CREATE INDEX idx_bookings_date_charter ON Bookings(booking_date, charter_id);
CREATE INDEX idx_bookings_customer ON Bookings(customer_id);
CREATE INDEX idx_bookings_status ON Bookings(status);

-- ============================================
-- 4. PAYMENTS TABLE
-- ============================================
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES Bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    payment_method VARCHAR(50), -- 'card', 'cash', 'bank_transfer'
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status values: 'pending', 'processing', 'succeeded', 'failed', 'refunded'
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    refund_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Business rule: Valid status
    CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    
    -- Business rule: Can't refund more than paid
    CONSTRAINT valid_refund CHECK (refund_amount <= amount)
);

CREATE INDEX idx_payments_booking ON Payments(booking_id);
CREATE INDEX idx_payments_stripe ON Payments(stripe_payment_intent_id);

-- ============================================
-- 5. BLOCKED_DATES TABLE (Maintenance/Weather)
-- ============================================
CREATE TABLE BlockedDates (
    id SERIAL PRIMARY KEY,
    block_date DATE NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    charter_id INT REFERENCES Charters(id) ON DELETE CASCADE, -- NULL = blocks all charters
    created_by VARCHAR(100), -- Admin who created the block
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocked_dates ON BlockedDates(block_date);

-- Sample blocked dates
INSERT INTO BlockedDates (block_date, reason, charter_id) VALUES
('2025-12-25', 'Christmas Day - Office Closed', NULL),
('2025-01-01', 'New Years Day - Office Closed', NULL);

-- ============================================
-- 6. DISCOUNTS TABLE (Optional - For Future)
-- ============================================
CREATE TABLE Discounts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10,2) NOT NULL,
    valid_from DATE,
    valid_until DATE,
    max_uses INT,
    times_used INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_discount_type CHECK (discount_type IN ('percentage', 'fixed_amount'))
);

-- Sample discounts
INSERT INTO Discounts (code, description, discount_type, discount_value, valid_until, max_uses) VALUES
('FIRST50', 'First-time customer 50% off', 'percentage', 50.00, '2026-12-31', 1000),
('VETERAN15', 'Veterans discount', 'percentage', 15.00, '2026-12-31', NULL);

-- ============================================
-- 7. BOOKING_DISCOUNTS TABLE (Junction)
-- ============================================
CREATE TABLE BookingDiscounts (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES Bookings(id) ON DELETE CASCADE,
    discount_id INT NOT NULL REFERENCES Discounts(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(booking_id, discount_id)
);

-- ============================================
-- 8. AUDIT_LOG TABLE (Track Important Changes)
-- ============================================
CREATE TABLE AuditLog (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_table_record ON AuditLog(table_name, record_id);
CREATE INDEX idx_audit_date ON AuditLog(changed_at);

-- ============================================
-- 9. VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Available dates for next 90 days
CREATE OR REPLACE VIEW AvailableDates AS
SELECT 
    c.id as charter_id,
    c.name as charter_name,
    d.date as available_date,
    CASE 
        WHEN b_morning.id IS NULL THEN true 
        ELSE false 
    END as morning_available,
    CASE 
        WHEN b_afternoon.id IS NULL THEN true 
        ELSE false 
    END as afternoon_available
FROM 
    Charters c
    CROSS JOIN generate_series(
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '90 days',
        INTERVAL '1 day'
    ) d(date)
    LEFT JOIN Bookings b_morning ON (
        b_morning.charter_id = c.id 
        AND b_morning.booking_date = d.date 
        AND b_morning.time_slot = 'morning'
        AND b_morning.status NOT IN ('cancelled', 'no-show')
    )
    LEFT JOIN Bookings b_afternoon ON (
        b_afternoon.charter_id = c.id 
        AND b_afternoon.booking_date = d.date 
        AND b_afternoon.time_slot = 'afternoon'
        AND b_afternoon.status NOT IN ('cancelled', 'no-show')
    )
    LEFT JOIN BlockedDates bd ON (
        bd.block_date = d.date 
        AND (bd.charter_id IS NULL OR bd.charter_id = c.id)
    )
WHERE 
    c.is_active = true
    AND bd.id IS NULL
    AND d.date >= CURRENT_DATE;

-- View: Daily revenue report
CREATE OR REPLACE VIEW DailyRevenue AS
SELECT 
    b.booking_date,
    COUNT(b.id) as total_bookings,
    SUM(b.total_price) as gross_revenue,
    SUM(b.discount_amount) as total_discounts,
    SUM(CASE WHEN p.status = 'succeeded' THEN p.amount ELSE 0 END) as collected_revenue,
    COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) as cancelled_bookings
FROM 
    Bookings b
    LEFT JOIN Payments p ON b.id = p.booking_id
GROUP BY 
    b.booking_date
ORDER BY 
    b.booking_date DESC;

-- View: Customer booking history
CREATE OR REPLACE VIEW CustomerBookingHistory AS
SELECT 
    c.id as customer_id,
    c.name,
    c.email,
    c.phone,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_trips,
    SUM(b.total_price) as lifetime_value,
    MAX(b.booking_date) as last_booking_date,
    MIN(b.booking_date) as first_booking_date
FROM 
    Customers c
    LEFT JOIN Bookings b ON c.id = b.customer_id
GROUP BY 
    c.id, c.name, c.email, c.phone;

-- ============================================
-- 10. TRIGGERS
-- ============================================

-- Trigger: Update customer's total_bookings and is_first_timer
CREATE OR REPLACE FUNCTION update_customer_booking_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE Customers 
        SET 
            total_bookings = total_bookings + 1,
            is_first_timer = false
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_bookings
AFTER INSERT ON Bookings
FOR EACH ROW
EXECUTE FUNCTION update_customer_booking_count();

-- Trigger: Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
BEFORE UPDATE ON Bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_charters_updated_at
BEFORE UPDATE ON Charters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 11. FUNCTIONS FOR BUSINESS LOGIC
-- ============================================

-- Function: Check if a date/time/charter is available
CREATE OR REPLACE FUNCTION check_availability(
    p_charter_id INT,
    p_booking_date DATE,
    p_time_slot VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_blocked BOOLEAN;
    v_existing_booking INT;
BEGIN
    -- Check if date is blocked
    SELECT EXISTS(
        SELECT 1 FROM BlockedDates 
        WHERE block_date = p_booking_date 
        AND (charter_id IS NULL OR charter_id = p_charter_id)
    ) INTO v_is_blocked;
    
    IF v_is_blocked THEN
        RETURN false;
    END IF;
    
    -- Check if already booked
    SELECT id INTO v_existing_booking
    FROM Bookings
    WHERE charter_id = p_charter_id
    AND booking_date = p_booking_date
    AND time_slot = p_time_slot
    AND status NOT IN ('cancelled', 'no-show');
    
    IF v_existing_booking IS NOT NULL THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate booking price with discounts
CREATE OR REPLACE FUNCTION calculate_booking_price(
    p_charter_id INT,
    p_num_guests INT,
    p_is_first_timer BOOLEAN
)
RETURNS TABLE(base_price DECIMAL, discount_amount DECIMAL, total_price DECIMAL) AS $$
DECLARE
    v_base_price DECIMAL;
    v_discount DECIMAL := 0.00;
BEGIN
    -- Get base price
    SELECT Charters.base_price INTO v_base_price
    FROM Charters
    WHERE id = p_charter_id;
    
    -- Apply first-timer discount
    IF p_is_first_timer THEN
        v_discount := v_base_price * 0.50;
    END IF;
    
    RETURN QUERY SELECT 
        v_base_price,
        v_discount,
        v_base_price - v_discount;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 12. SAMPLE DATA FOR TESTING
-- ============================================

-- Add some test customers (if not already exist)
INSERT INTO Customers (name, phone, email, is_first_timer) VALUES
('John Smith', '555-0101', 'john@email.com', true),
('Sarah Johnson', '555-0102', 'sarah@email.com', false),
('Mike Williams', '555-0103', 'mike@email.com', true)
ON CONFLICT DO NOTHING;

-- Add some test bookings
INSERT INTO Bookings (customer_id, charter_id, booking_date, time_slot, num_guests, base_price, discount_amount, total_price, status)
VALUES
(1, 1, CURRENT_DATE + INTERVAL '3 days', 'morning', 2, 300.00, 150.00, 150.00, 'confirmed'),
(2, 3, CURRENT_DATE + INTERVAL '7 days', 'full-day', 4, 550.00, 0.00, 550.00, 'pending'),
(3, 2, CURRENT_DATE + INTERVAL '5 days', 'afternoon', 3, 300.00, 150.00, 150.00, 'confirmed');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check charter data
SELECT * FROM Charters;

-- Check availability for next 7 days
SELECT * FROM AvailableDates 
WHERE available_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
LIMIT 20;

-- Test availability function
SELECT check_availability(1, CURRENT_DATE + INTERVAL '10 days', 'morning');

-- Test price calculation
SELECT * FROM calculate_booking_price(1, 2, true);
