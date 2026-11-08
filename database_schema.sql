-- ==============================================================
-- RUMUSKY AIRLINES - Tam İlişkisel Veritabanı Şeması (DDL)
-- MySQL 8.4+ / PostgreSQL Uyumlu Çekirdek Tablolar
-- ==============================================================

CREATE DATABASE IF NOT EXISTS rumusky_airlines CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rumusky_airlines;

-- 1. ROLLER & YETKİLER
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- 'super_admin', 'flight_manager', 'booking_manager', 'customer'
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. KULLANICILAR
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone VARCHAR(30) NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. HAVALİMANLARI
CREATE TABLE airports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    iata_code CHAR(3) NOT NULL UNIQUE,
    icao_code CHAR(4) NULL,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    city_en VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_en VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    terminal_info VARCHAR(150) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_airports_iata (iata_code),
    INDEX idx_airports_city (city)
);

-- 4. UÇAK FİLOSU
CREATE TABLE aircraft (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(100) NOT NULL, -- 'Airbus A320-200neo', 'Boeing 737-800'
    registration_number VARCHAR(20) NOT NULL UNIQUE, -- 'TC-RMK'
    manufacturer VARCHAR(50) NOT NULL, -- 'Airbus', 'Boeing'
    total_capacity INT NOT NULL,
    business_rows INT NOT NULL DEFAULT 4,
    economy_rows INT NOT NULL DEFAULT 24,
    seats_per_row_json JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. UÇAK KOLTUK ŞABLONU
CREATE TABLE aircraft_seats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    aircraft_id BIGINT UNSIGNED NOT NULL,
    seat_number VARCHAR(10) NOT NULL, -- '12A'
    row_number INT NOT NULL,
    seat_letter CHAR(1) NOT NULL,
    cabin_class ENUM('economy', 'business') NOT NULL DEFAULT 'economy',
    is_extra_legroom BOOLEAN NOT NULL DEFAULT FALSE,
    is_exit_row BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(id) ON DELETE CASCADE,
    UNIQUE KEY uq_aircraft_seat (aircraft_id, seat_number)
);

-- 6. ROTALAR
CREATE TABLE routes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    origin_airport_id BIGINT UNSIGNED NOT NULL,
    destination_airport_id BIGINT UNSIGNED NOT NULL,
    distance_km INT NOT NULL,
    estimated_duration_minutes INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (origin_airport_id) REFERENCES airports(id) ON DELETE RESTRICT,
    FOREIGN KEY (destination_airport_id) REFERENCES airports(id) ON DELETE RESTRICT
);

-- 7. UÇUŞLAR (SEFERLER)
CREATE TABLE flights (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL UNIQUE, -- 'RMK-101'
    route_id BIGINT UNSIGNED NOT NULL,
    aircraft_id BIGINT UNSIGNED NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    price_economy DECIMAL(10, 2) NOT NULL,
    price_business DECIMAL(10, 2) NOT NULL,
    baggage_allowance_kg INT NOT NULL DEFAULT 25,
    operational_status ENUM('Scheduled', 'Boarding', 'Departed', 'In Air', 'Landed', 'Delayed', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
    booking_status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    available_economy_seats INT NOT NULL DEFAULT 150,
    available_business_seats INT NOT NULL DEFAULT 18,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE RESTRICT,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(id) ON DELETE RESTRICT,
    INDEX idx_flights_date_route (departure_time, route_id)
);

-- 8. UÇUŞ BAZLI KOLTUK ENVANTERİ
CREATE TABLE flight_seats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    flight_id BIGINT UNSIGNED NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    cabin_class ENUM('economy', 'business') NOT NULL,
    price_modifier DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('available', 'held', 'booked', 'blocked') NOT NULL DEFAULT 'available',
    held_by_session_id VARCHAR(100) NULL,
    held_until DATETIME NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE,
    UNIQUE KEY uq_flight_seat (flight_id, seat_number),
    INDEX idx_held_expiry (status, held_until)
);

-- 9. REZERVASYONLAR (BOOKINGS)
CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pnr VARCHAR(10) NOT NULL UNIQUE, -- 'RMK84A'
    flight_id BIGINT UNSIGNED NOT NULL,
    return_flight_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NULL,
    contact_email VARCHAR(191) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'TRY',
    status ENUM('pending', 'confirmed', 'cancelled', 'expired') NOT NULL DEFAULT 'pending',
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_pnr (pnr)
);

-- 10. YOLCULAR
CREATE TABLE passengers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    date_of_birth DATE NOT NULL,
    passenger_type ENUM('adult', 'child', 'infant') NOT NULL DEFAULT 'adult',
    nationality CHAR(2) NOT NULL DEFAULT 'TR',
    id_or_passport_no VARCHAR(50) NOT NULL,
    selected_seat VARCHAR(10) NULL,
    cabin_class ENUM('economy', 'business') NOT NULL DEFAULT 'economy',
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 11. BİLETLER (TICKETS & BİNİŞ KARTLARI)
CREATE TABLE tickets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(30) NOT NULL UNIQUE, -- '235-9012849102'
    booking_id BIGINT UNSIGNED NOT NULL,
    passenger_id BIGINT UNSIGNED NOT NULL,
    flight_id BIGINT UNSIGNED NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    cabin_class ENUM('economy', 'business') NOT NULL,
    baggage_kg INT NOT NULL DEFAULT 25,
    qr_code_hash VARCHAR(255) NOT NULL,
    status ENUM('issued', 'checked_in', 'cancelled') NOT NULL DEFAULT 'issued',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
    FOREIGN KEY (passenger_id) REFERENCES passengers(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE RESTRICT
);

-- 12. ÖDEMELER (SIMULATED TEST PAYMENTS)
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT UNSIGNED NOT NULL,
    transaction_ref VARCHAR(100) NOT NULL UNIQUE,
    card_last_four CHAR(4) NOT NULL,
    card_brand VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'TRY',
    status ENUM('pending', 'successful', 'failed', 'refunded') NOT NULL,
    error_message VARCHAR(255) NULL,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
);

-- 13. SİSTEM AYARLARI
CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255) NULL
);
