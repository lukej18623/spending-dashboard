-- ============================================
-- STURGEON EXCURSIONS - DATABASE SCHEMA
-- Version: 2.0 (Booking System with Availability Calendar)
-- Date: November 25, 2025
-- ============================================

-- ============================================
-- 1. EXCURSIONS TABLE (Trip Templates)
-- ============================================
CREATE TABLE Excursions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_hours DECIMAL(4,2) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 6,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample excursions
INSERT INTO Excursions (name, description, duration_hours, base_price, max_capacity) VALUES
('Half-Day Morning Trip', 'Early morning sturgeon fishing adventure. Best for beginners and families.', 4.00, 300.00, 6),
('Half-Day Afternoon Trip', 'Afternoon sturgeon excursion. Perfect for those who like to sleep in.', 4.00, 300.00, 6),
('Full-Day Trophy Hunt', 'All-day expedition targeting trophy sturgeon. Lunch included.', 8.00, 550.00, 4);

-- ============================================
-- 2. CUSTOMERS TABLE
-- ============================================
CREATE TABLE Customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. BOOKINGS TABLE
-- ============================================
CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES Customers(id) ON DELETE CASCADE,
    excursion_id INT NOT NULL REFERENCES Excursions(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- 'morning', 'afternoon', 'full-day'
    num_guests INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Business rule: Prevent double-booking same excursion/date/time
    CONSTRAINT unique_booking UNIQUE(excursion_id, booking_date, time_slot),

    -- Business rule: Can't book in the past
    CONSTRAINT future_booking CHECK (booking_date >= CURRENT_DATE),

    -- Business rule: Valid number of guests
    CONSTRAINT valid_guests CHECK (num_guests > 0 AND num_guests <= 10),

    -- Business rule: Valid status
    CONSTRAINT valid_status CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no-show'))
);

CREATE INDEX idx_bookings_date_excursion ON Bookings(booking_date, excursion_id);
CREATE INDEX idx_bookings_customer ON Bookings(customer_id);
CREATE INDEX idx_bookings_status ON Bookings(status);

-- ============================================
-- 4. BLOCKED_DATES TABLE
-- ============================================
CREATE TABLE BlockedDates (
    id SERIAL PRIMARY KEY,
    block_date DATE NOT NULL UNIQUE,
    reason TEXT NOT NULL,
    excursion_id INT REFERENCES Excursions(id) ON DELETE CASCADE, -- NULL = blocks all excursions
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocked_dates ON BlockedDates(block_date);

-- Sample blocked dates
INSERT INTO BlockedDates (block_date, reason, excursion_id, created_by) VALUES
('2025-12-25', 'Christmas Day - Office Closed', NULL, 'admin'),
('2025-01-01', 'New Years Day - Office Closed', NULL, 'admin');

-- ============================================
-- 5. TRIGGERS
-- ============================================

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

CREATE TRIGGER trigger_excursions_updated_at
BEFORE UPDATE ON Excursions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Available dates and times for next 90 days
CREATE OR REPLACE VIEW AvailableDates AS
SELECT
    e.id as excursion_id,
    e.name as excursion_name,
    d.date as available_date,
    CASE
        WHEN b_morning.id IS NULL THEN true
        ELSE false
    END as morning_available,
    CASE
        WHEN b_afternoon.id IS NULL THEN true
        ELSE false
    END as afternoon_available,
    CASE
        WHEN b_fullday.id IS NULL THEN true
        ELSE false
    END as fullday_available
FROM
    Excursions e
    CROSS JOIN generate_series(
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '90 days',
        INTERVAL '1 day'
    ) d(date)
    LEFT JOIN Bookings b_morning ON (
        b_morning.excursion_id = e.id
        AND b_morning.booking_date = d.date
        AND b_morning.time_slot = 'morning'
        AND b_morning.status NOT IN ('cancelled', 'no-show')
    )
    LEFT JOIN Bookings b_afternoon ON (
        b_afternoon.excursion_id = e.id
        AND b_afternoon.booking_date = d.date
        AND b_afternoon.time_slot = 'afternoon'
        AND b_afternoon.status NOT IN ('cancelled', 'no-show')
    )
    LEFT JOIN Bookings b_fullday ON (
        b_fullday.excursion_id = e.id
        AND b_fullday.booking_date = d.date
        AND b_fullday.time_slot = 'full-day'
        AND b_fullday.status NOT IN ('cancelled', 'no-show')
    )
    LEFT JOIN BlockedDates bd ON (
        bd.block_date = d.date
        AND (bd.excursion_id IS NULL OR bd.excursion_id = e.id)
    )
WHERE
    e.is_active = true
    AND bd.id IS NULL
    AND d.date >= CURRENT_DATE;

-- ============================================
-- 7. FUNCTIONS FOR BUSINESS LOGIC
-- ============================================

-- Function: Check if a date/time/excursion is available
CREATE OR REPLACE FUNCTION check_availability(
    p_excursion_id INT,
    p_booking_date DATE,
    p_time_slot VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_blocked BOOLEAN;
    v_existing_booking INT;
BEGIN
    -- Check if date is in the past
    IF p_booking_date < CURRENT_DATE THEN
        RETURN false;
    END IF;

    -- Check if date is blocked
    SELECT EXISTS(
        SELECT 1 FROM BlockedDates
        WHERE block_date = p_booking_date
        AND (excursion_id IS NULL OR excursion_id = p_excursion_id)
    ) INTO v_is_blocked;

    IF v_is_blocked THEN
        RETURN false;
    END IF;

    -- Check if already booked
    SELECT id INTO v_existing_booking
    FROM Bookings
    WHERE excursion_id = p_excursion_id
    AND booking_date = p_booking_date
    AND time_slot = p_time_slot
    AND status NOT IN ('cancelled', 'no-show');

    IF v_existing_booking IS NOT NULL THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function: Validate booking capacity
CREATE OR REPLACE FUNCTION validate_booking_capacity(
    p_excursion_id INT,
    p_num_guests INT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_max_capacity INT;
BEGIN
    SELECT max_capacity INTO v_max_capacity
    FROM Excursions
    WHERE id = p_excursion_id;

    RETURN p_num_guests <= v_max_capacity;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check excursions
SELECT * FROM Excursions;

-- Check available dates for next 7 days
SELECT * FROM AvailableDates
WHERE available_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
LIMIT 20;

-- Test availability function
SELECT check_availability(1, CURRENT_DATE + INTERVAL '10 days', 'morning');

-- Test capacity validation
SELECT validate_booking_capacity(1, 4);