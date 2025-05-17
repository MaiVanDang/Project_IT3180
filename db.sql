-- Database seed script for apartment management system
-- This script will generate 30 records for each table
-- It follows the schema specifications provided in the documentation

-- Clear existing data (if needed)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Resident;
TRUNCATE TABLE Apartment;
TRUNCATE TABLE Fee;
TRUNCATE TABLE Vehicle;
TRUNCATE TABLE User;
TRUNCATE TABLE Invoice;
TRUNCATE TABLE Utility_Bill;
TRUNCATE TABLE Invoice_Apartment;
TRUNCATE TABLE Fee_Invoice;
SET FOREIGN_KEY_CHECKS = 1;

-- Create Apartment data first (since many tables reference it)
INSERT INTO apartments (address_number, area, owner_phone, status, owner_id)
VALUES
(101, 75.5, 84987654321, 'Residential', NULL),
(102, 85.2, 84987654322, 'Residential', NULL),
(103, 60.0, 84987654323, 'Residential', NULL),
(104, 90.3, 84987654324, 'Business', NULL),
(105, 70.8, 84987654325, 'Residential', NULL),
(106, 100.1, 84987654326, 'Residential', NULL),
(107, 65.7, 0985285432, 'Vacant', NULL),
(108, 95.2, 84987654328, 'Residential', NULL),
(109, 80.0, 84987654329, 'Business', NULL),
(110, 72.6, 84987654330, 'Residential', NULL),
(201, 85.5, 84987654331, 'Residential', NULL),
(202, 95.2, 84987654332, 'Business', NULL),
(203, 65.0, 84987654333, 'Residential', NULL),
(204, 110.3, 84987654334, 'Residential', NULL),
(205, 75.8, NULL, 'Vacant', NULL),
(206, 90.1, 84987654336, 'Residential', NULL),
(207, 68.7, 84987654337, 'Residential', NULL),
(208, 105.2, 84987654338, 'Business', NULL),
(209, 82.0, 84987654339, 'Residential', NULL),
(210, 77.6, 84987654340, 'Residential', NULL),
(301, 95.5, 84987654341, 'Residential', NULL),
(302, 85.2, NULL, 'Vacant', NULL),
(303, 70.0, 84987654343, 'Residential', NULL),
(304, 100.3, 84987654344, 'Business', NULL),
(305, 82.8, 84987654345, 'Residential', NULL),
(306, 110.1, 84987654346, 'Residential', NULL),
(307, 75.7, 84987654347, 'Residential', NULL),
(308, 90.2, 84987654348, 'Business', NULL),
(309, 78.0, 84987654349, 'Residential', NULL),
(310, 92.6, 84987654350, 'Residential', NULL);

-- Create Resident data
INSERT INTO residents (id, name, dob, gender, cic, address_number, status, status_date, is_active)
VALUES
(1, 'Nguyen Van An', '1985-03-15', 1, '2020-05-20 10:30:00', 101, 'Resident', '2020-06-01', 1),
(2, 'Tran Thi Binh', '1990-07-23', 0, '2020-05-22 09:15:00', 101, 'Resident', '2020-06-01', 1),
(3, 'Le Van Cuong', '1982-11-05', 1, '2020-06-10 14:20:00', 102, 'Resident', '2020-06-15', 1),
(4, 'Pham Thi Duyen', '1988-04-18', 0, '2020-06-12 11:45:00', 102, 'Resident', '2020-06-15', 1),
(5, 'Hoang Minh Duc', '1995-09-30', 1, '2020-06-15 16:30:00', 102, 'Temporary', '2020-06-20', 1),
(6, 'Nguyen Thu Ha', '1991-02-27', 0, '2020-07-05 08:50:00', 103, 'Resident', '2020-07-10', 1),
(7, 'Tran Van Giang', '1975-12-12', 1, '2020-07-10 13:25:00', 105, 'Resident', '2020-07-15', 1),
(8, 'Le Thi Huong', '1978-08-08', 0, '2020-07-12 15:40:00', 105, 'Resident', '2020-07-15', 1),
(9, 'Pham Van Kien', '2000-01-20', 1, '2020-07-15 10:15:00', 105, 'Resident', '2020-07-20', 1),
(10, 'Hoang Thi Lan', '2005-05-03', 0, '2020-07-20 09:30:00', 105, 'Resident', '2020-07-25', 1),
(11, 'Nguyen Van Minh', '1983-06-25', 1, '2020-08-01 14:45:00', 106, 'Resident', '2020-08-05', 1),
(12, 'Tran Thi Nga', '1986-10-17', 0, '2020-08-03 16:20:00', 106, 'Resident', '2020-08-05', 1),
(13, 'Le Van Oanh', '1992-03-08', 1, '2020-08-10 11:35:00', 108, 'Resident', '2020-08-15', 1),
(14, 'Pham Thi Phuong', '1994-07-19', 0, '2020-08-12 13:50:00', 108, 'Resident', '2020-08-15', 1),
(15, 'Hoang Quoc Quan', '1996-11-28', 1, '2020-08-15 15:25:00', 108, 'Temporary', '2020-08-20', 1),
(16, 'Nguyen Thi Rang', '1987-04-14', 0, '2020-09-01 10:40:00', 110, 'Resident', '2020-09-05', 1),
(17, 'Tran Van Son', '1989-08-22', 1, '2020-09-03 12:15:00', 110, 'Resident', '2020-09-05', 1),
(18, 'Le Thi Tuyet', '1993-12-09', 0, '2020-09-10 14:30:00', 201, 'Resident', '2020-09-15', 1),
(19, 'Pham Van Ung', '1984-05-05', 1, '2020-09-12 16:45:00', 201, 'Resident', '2020-09-15', 1),
(20, 'Hoang Thi Van', '1990-09-16', 0, '2020-09-15 09:20:00', 201, 'Resident', '2020-09-20', 1),
(21, 'Nguyen Van Xuan', '1997-01-27', 1, '2020-09-20 11:35:00', 201, 'Temporary', '2020-09-25', 1),
(22, 'Tran Thi Yen', '1986-06-08', 0, '2020-10-01 13:50:00', 203, 'Resident', '2020-10-05', 1),
(23, 'Le Van Anh', '1981-10-19', 1, '2020-10-05 15:25:00', 204, 'Resident', '2020-10-10', 1),
(24, 'Pham Thi Bao', '1983-02-28', 0, '2020-10-07 10:40:00', 204, 'Resident', '2020-10-10', 1),
(25, 'Hoang Minh Chau', '1985-07-11', 1, '2020-10-10 12:15:00', 204, 'Resident', '2020-10-15', 1),
(26, 'Nguyen Thu Dung', '1988-11-22', 0, '2020-10-12 14:30:00', 204, 'Resident', '2020-10-15', 1),
(27, 'Tran Van Em', '1991-04-03', 1, '2020-10-15 16:45:00', 204, 'Temporary', '2020-10-20', 1),
(28, 'Le Thi Giang', '1994-08-14', 0, '2020-11-01 09:20:00', 206, 'Resident', '2020-11-05', 1),
(29, 'Pham Van Hai', '1996-12-25', 1, '2020-11-03 11:35:00', 206, 'Resident', '2020-11-05', 1),
(30, 'Hoang Thi Khang', '1998-05-06', 0, '2020-11-10 13:50:00', 207, 'Resident', '2020-11-15', 1);

-- Update Apartment owner_id with Resident id
UPDATE apartments SET owner_id = 1 WHERE address_number = 101;
UPDATE apartments SET owner_id = 3 WHERE address_number = 102;
UPDATE apartments SET owner_id = 6 WHERE address_number = 103;
UPDATE apartments SET owner_id = 7 WHERE address_number = 105;
UPDATE apartments SET owner_id = 11 WHERE address_number = 106;
UPDATE apartments SET owner_id = 13 WHERE address_number = 108;
UPDATE apartments SET owner_id = 16 WHERE address_number = 110;
UPDATE apartments SET owner_id = 18 WHERE address_number = 201;
UPDATE apartments SET owner_id = 22 WHERE address_number = 203;
UPDATE apartments SET owner_id = 23 WHERE address_number = 204;
UPDATE apartments SET owner_id = 28 WHERE address_number = 206;
UPDATE apartments SET owner_id = 30 WHERE address_number = 207;

-- Create Fee data
INSERT INTO fees (id, name, description, fee_type_enum, unit_price)
VALUES
(1, 'Management Fee', 'Monthly fee for apartment management services', 'DepartmentFee', 100000.00),
(2, 'Security Fee', 'Monthly fee for security services', 'DepartmentFee', 50000.00),
(3, 'Cleaning Fee', 'Monthly fee for common area cleaning', 'DepartmentFee', 30000.00),
(4, 'Elevator Maintenance', 'Fee for elevator maintenance', 'DepartmentFee', 20000.00),
(5, 'Building Insurance', 'Annual building insurance contribution', 'ContributionFund', 200000.00),
(6, 'Renovation Fund', 'Fund for future building renovations', 'ContributionFund', 150000.00),
(7, 'Event Fund', 'Fund for community events', 'ContributionFund', 50000.00),
(8, 'Garbage Collection', 'Fee for garbage collection services', 'DepartmentFee', 25000.00),
(9, 'Parking Fee', 'Monthly fee for parking spaces', 'DepartmentFee', 100000.00),
(10, 'Swimming Pool', 'Fee for swimming pool maintenance', 'DepartmentFee', 80000.00),
(11, 'Gym Fee', 'Fee for gym facilities', 'DepartmentFee', 75000.00),
(12, 'Garden Maintenance', 'Fee for garden maintenance', 'DepartmentFee', 20000.00),
(13, 'Emergency Fund', 'Fund for emergency situations', 'ContributionFund', 100000.00),
(14, 'Fire Safety System', 'Maintenance of fire safety equipment', 'DepartmentFee', 30000.00),
(15, 'Playground Maintenance', 'Fee for playground upkeep', 'DepartmentFee', 15000.00),
(16, 'Pest Control', 'Fee for pest control services', 'DepartmentFee', 20000.00),
(17, 'CCTV Maintenance', 'Fee for security camera system', 'DepartmentFee', 25000.00),
(18, 'Lobby Decoration', 'Fund for lobby decoration', 'ContributionFund', 50000.00),
(19, 'Staff Salary', 'Contribution for building staff salaries', 'DepartmentFee', 120000.00),
(20, 'Water Pump Maintenance', 'Fee for water system maintenance', 'DepartmentFee', 15000.00),
(21, 'Electrical System', 'Fee for electrical system maintenance', 'DepartmentFee', 20000.00),
(22, 'Annual Festival', 'Fund for annual building festival', 'ContributionFund', 70000.00),
(23, 'Backup Generator', 'Fee for generator maintenance', 'DepartmentFee', 30000.00),
(24, 'Common Area Utilities', 'Fee for common area electricity and water', 'DepartmentFee', 40000.00),
(25, 'Sport Facilities', 'Maintenance of sport facilities', 'DepartmentFee', 60000.00),
(26, 'Children Activities', 'Fund for children activities', 'ContributionFund', 30000.00),
(27, 'Guest Reception', 'Fee for reception services', 'DepartmentFee', 20000.00),
(28, 'Roof Maintenance', 'Fund for roof maintenance', 'ContributionFund', 80000.00),
(29, 'Water Tank Cleaning', 'Fee for water tank cleaning service', 'DepartmentFee', 40000.00),
(30, 'Facade Cleaning', 'Fee for building facade cleaning', 'DepartmentFee', 50000.00);

-- Create Vehicle data
INSERT INTO vehicles (id, category, register_date, address_id)
VALUES
-- Using 0 and 1 as possible category values
('29A-12345', 0, '2020-06-10', 101),
('29A-23456', 0, '2020-06-15', 101),
('30A-34567', 1, '2020-07-05', 102),
('30A-45678', 1, '2020-07-10', 102),
('29B-56789', 0, '2020-07-15', 103),
('29B-67890', 0, '2020-08-01', 105),
('30B-78901', 1, '2020-08-05', 105),
('30B-89012', 1, '2020-08-10', 106),
('29C-90123', 0, '2020-08-15', 106),
('29C-01234', 0, '2020-09-01', 108),
('30C-12345', 1, '2020-09-05', 108),
('30C-23456', 1, '2020-09-10', 110),
('29D-34567', 0, '2020-09-15', 110),
('29D-45678', 0, '2020-10-01', 201),
('30D-56789', 1, '2020-10-05', 201),
('30D-67890', 1, '2020-10-10', 201),
('29E-78901', 0, '2020-10-15', 203),
('29E-89012', 0, '2020-11-01', 204),
('30E-90123', 1, '2020-11-05', 204),
('30E-01234', 1, '2020-11-10', 204),
('29F-12345', 0, '2020-11-15', 206),
('29F-23456', 0, '2020-11-20', 206),
('30F-34567', 1, '2020-12-01', 207),
('30F-45678', 1, '2020-12-05', 209),
('29G-56789', 0, '2020-12-10', 209),
('29G-67890', 0, '2020-12-15', 210),
('30G-78901', 1, '2020-12-20', 210),
('30G-89012', 1, '2021-01-05', 301),
('29H-90123', 0, '2021-01-10', 301),
('29H-01234', 0, '2021-01-15', 303);


-- Create Invoice data
INSERT INTO invoices (id, description, name, updated_at, is_active)
VALUES
('INV-2023-01-0001', 'January 2023 building fees', 'Monthly Building Fee - Jan 2023', '2023-01-10 10:00:00', 1),
('INV-2023-01-0002', 'January 2023 maintenance fees', 'Maintenance Fee - Jan 2023', '2023-01-10 10:15:00', 1),
('INV-2023-01-0003', 'January 2023 security fees', 'Security Fee - Jan 2023', '2023-01-10 10:30:00', 1),
('INV-2023-02-0001', 'February 2023 building fees', 'Monthly Building Fee - Feb 2023', '2023-02-10 10:00:00', 1),
('INV-2023-02-0002', 'February 2023 maintenance fees', 'Maintenance Fee - Feb 2023', '2023-02-10 10:15:00', 1),
('INV-2023-02-0003', 'February 2023 security fees', 'Security Fee - Feb 2023', '2023-02-10 10:30:00', 1),
('INV-2023-03-0001', 'March 2023 building fees', 'Monthly Building Fee - Mar 2023', '2023-03-10 10:00:00', 1),
('INV-2023-03-0002', 'March 2023 maintenance fees', 'Maintenance Fee - Mar 2023', '2023-03-10 10:15:00', 1),
('INV-2023-03-0003', 'March 2023 security fees', 'Security Fee - Mar 2023', '2023-03-10 10:30:00', 1),
('INV-2023-04-0001', 'April 2023 building fees', 'Monthly Building Fee - Apr 2023', '2023-04-10 10:00:00', 1),
('INV-2023-04-0002', 'April 2023 maintenance fees', 'Maintenance Fee - Apr 2023', '2023-04-10 10:15:00', 1),
('INV-2023-04-0003', 'April 2023 security fees', 'Security Fee - Apr 2023', '2023-04-10 10:30:00', 1),
('INV-2023-05-0001', 'May 2023 building fees', 'Monthly Building Fee - May 2023', '2023-05-10 10:00:00', 1),
('INV-2023-05-0002', 'May 2023 maintenance fees', 'Maintenance Fee - May 2023', '2023-05-10 10:15:00', 1),
('INV-2023-05-0003', 'May 2023 security fees', 'Security Fee - May 2023', '2023-05-10 10:30:00', 1),
('INV-2023-06-0001', 'June 2023 building fees', 'Monthly Building Fee - Jun 2023', '2023-06-10 10:00:00', 1),
('INV-2023-06-0002', 'June 2023 maintenance fees', 'Maintenance Fee - Jun 2023', '2023-06-10 10:15:00', 1),
('INV-2023-06-0003', 'June 2023 security fees', 'Security Fee - Jun 2023', '2023-06-10 10:30:00', 1),
('INV-2023-07-0001', 'July 2023 building fees', 'Monthly Building Fee - Jul 2023', '2023-07-10 10:00:00', 1),
('INV-2023-07-0002', 'July 2023 maintenance fees', 'Maintenance Fee - Jul 2023', '2023-07-10 10:15:00', 1),
('INV-2023-07-0003', 'July 2023 security fees', 'Security Fee - Jul 2023', '2023-07-10 10:30:00', 1),
('INV-2023-08-0001', 'August 2023 building fees', 'Monthly Building Fee - Aug 2023', '2023-08-10 10:00:00', 1),
('INV-2023-08-0002', 'August 2023 maintenance fees', 'Maintenance Fee - Aug 2023', '2023-08-10 10:15:00', 1),
('INV-2023-08-0003', 'August 2023 security fees', 'Security Fee - Aug 2023', '2023-08-10 10:30:00', 1),
('INV-2023-09-0001', 'September 2023 building fees', 'Monthly Building Fee - Sep 2023', '2023-09-10 10:00:00', 1),
('INV-2023-09-0002', 'September 2023 maintenance fees', 'Maintenance Fee - Sep 2023', '2023-09-10 10:15:00', 1),
('INV-2023-09-0003', 'September 2023 security fees', 'Security Fee - Sep 2023', '2023-09-10 10:30:00', 1),
('INV-2023-10-0001', 'October 2023 building fees', 'Monthly Building Fee - Oct 2023', '2023-10-10 10:00:00', 1),
('INV-2023-10-0002', 'October 2023 maintenance fees', 'Maintenance Fee - Oct 2023', '2023-10-10 10:15:00', 1),
('INV-2023-10-0003', 'October 2023 security fees', 'Security Fee - Oct 2023', '2023-10-10 10:30:00', 1);

-- Create Utility_Bill data
SELECT * FROM public.utility_bills
ORDER BY id ASC 

INSERT INTO Utility_Bill (id, name, address_id, created_at, water, electricity, internet, payment_status)
VALUES
('2023010001', 'January 2023 Utilities - Apt 101', 101, '2023-01-15 09:00:00', 125000.00, 350000.00, 200000.00, '1'),
('2023010002', 'January 2023 Utilities - Apt 102', 102, '2023-01-15 09:15:00', 150000.00, 400000.00, 200000.00, '1'),
('2023010003', 'January 2023 Utilities - Apt 103', 103, '2023-01-15 09:30:00', 100000.00, 250000.00, 200000.00, '1'),
('2023010004', 'January 2023 Utilities - Apt 105', 105, '2023-01-15 09:45:00', 180000.00, 425000.00, 200000.00, '1'),
('2023010005', 'January 2023 Utilities - Apt 106', 106, '2023-01-15 10:00:00', 130000.00, 375000.00, 200000.00, '1'),
('2023020001', 'February 2023 Utilities - Apt 101', 101, '2023-02-15 09:00:00', 120000.00, 330000.00, 200000.00, '1'),
('2023020002', 'February 2023 Utilities - Apt 102', 102, '2023-02-15 09:15:00', 145000.00, 380000.00, 200000.00, '1'),
('2023020003', 'February 2023 Utilities - Apt 103', 103, '2023-02-15 09:30:00', 95000.00, 240000.00, 200000.00, '1'),
('2023020004', 'February 2023 Utilities - Apt 105', 105, '2023-02-15 09:45:00', 175000.00, 415000.00, 200000.00, '1'),
('2023020005', 'February 2023 Utilities - Apt 106', 106, '2023-02-15 10:00:00', 125000.00, 365000.00, 200000.00, '1'),
('2023030001', 'March 2023 Utilities - Apt 101', 101, '2023-03-15 09:00:00', 130000.00, 360000.00, 200000.00, '1'),
('2023030002', 'March 2023 Utilities - Apt 102', 102, '2023-03-15 09:15:00', 155000.00, 410000.00, 200000.00, '1'),
('2023030003', 'March 2023 Utilities - Apt 103', 103, '2023-03-15 09:30:00', 105000.00, 260000.00, 200000.00, '1'),
('2023030004', 'March 2023 Utilities - Apt 105', 105, '2023-03-15 09:45:00', 185000.00, 435000.00, 200000.00, '1'),
('2023030005', 'March 2023 Utilities - Apt 106', 106, '2023-03-15 10:00:00', 135000.00, 385000.00, 200000.00, '1'),
('2023040001', 'April 2023 Utilities - Apt 101', 101, '2023-04-15 09:00:00', 140000.00, 390000.00, 200000.00, '1'),
('2023040002', 'April 2023 Utilities - Apt 102', 102, '2023-04-15 09:15:00', 165000.00, 430000.00, 200000.00, '1'),
('2023040003', 'April 2023 Utilities - Apt 103', 103, '2023-04-15 09:30:00', 110000.00, 280000.00, 200000.00, '1'),
('2023040004', 'April 2023 Utilities - Apt 105', 105, '2023-04-15 09:45:00', 190000.00, 445000.00, 200000.00, '1'),
('2023040005', 'April 2023 Utilities - Apt 106', 106, '2023-04-15 10:00:00', 140000.00, 395000.00, 200000.00, '1'),
('2023050001', 'May 2023 Utilities - Apt 101', 101, '2023-05-15 09:00:00', 150000.00, 410000.00, 200000.00, '1'),
('2023050002', 'May 2023 Utilities - Apt 102', 102, '2023-05-15 09:15:00', 175000.00, 450000.00, 200000.00, '1'),
('2023050003', 'May 2023 Utilities - Apt 103', 103, '2023-05-15 09:30:00', 120000.00, 300000.00, 200000.00, '1'),
('2023050004', 'May 2023 Utilities - Apt 105', 105, '2023-05-15 09:45:00', 200000.00, 465000.00, 200000.00, '1'),
('2023050005', 'May 2023 Utilities - Apt 106', 106, '2023-05-15 10:00:00', 145000.00, 405000.00, 200000.00, '0'),
('2023060001', 'June 2023 Utilities - Apt 101', 101, '2023-06-15 09:00:00', 160000.00, 430000.00, 200000.00, '0'),
('2023060002', 'June 2023 Utilities - Apt 102', 102, '2023-06-15 09:15:00', 185000.00, 470000.00, 200000.00, '1'),
('2023060003', 'June 2023 Utilities - Apt 103', 103, '2023-06-15 09:30:00', 130000.00, 320000.00, 200000.00, '0'),
('2023060004', 'June 2023 Utilities - Apt 105', 105, '2023-06-15 09:45:00', 210000.00, 485000.00, 200000.00, '1'),
('2023060005', 'June 2023 Utilities - Apt 106', 106, '2023-06-15 10:00:00', 150000.00, 415000.00, 200000.00, '0');

-- Create Invoice_Apartment data
INSERT INTO invoice_apartment (id, apartment_id, invoice_id, payment_status)
VALUES
(1, 101, 'INV-2023-01-0001', '1'),
(2, 102, 'INV-2023-01-0001', '1'),
(3, 103, 'INV-2023-01-0001', '1'),
(4, 105, 'INV-2023-01-0001', '1'),
(5, 106, 'INV-2023-01-0001', '1'),
(6, 108, 'INV-2023-01-0001', '1'),
(7, 110, 'INV-2023-01-0001', '1'),
(8, 201, 'INV-2023-01-0001', '1'),
(9, 203, 'INV-2023-01-0001', '1'),
(10, 204, 'INV-2023-01-0001', '1'),
(11, 101, 'INV-2023-02-0001', '1'),
(12, 102, 'INV-2023-02-0001', '1'),
(13, 103, 'INV-2023-02-0001', '1'),
(14, 105, 'INV-2023-02-0001', '1'),
(15, 106, 'INV-2023-02-0001', '1'),
(16, 108, 'INV-2023-02-0001', '1'),
(17, 110, 'INV-2023-02-0001', '1'),
(18, 201, 'INV-2023-02-0001', '1'),
(19, 203, 'INV-2023-02-0001', '1'),
(20, 204, 'INV-2023-02-0001', '1'),
(21, 101, 'INV-2023-03-0001', '1'),
(22, 102, 'INV-2023-03-0001', '1'),
(23, 103, 'INV-2023-03-0001', '1'),
(24, 105, 'INV-2023-03-0001', '1'),
(25, 106, 'INV-2023-03-0001', '1'),
(26, 108, 'INV-2023-03-0001', '1'),
(27, 110, 'INV-2023-03-0001', '1'),
(28, 201, 'INV-2023-03-0001', '1'),
(29, 203, 'INV-2023-03-0001', '1'),
(30, 204, 'INV-2023-03-0001', '1');

-- Create Fee_Invoice data
INSERT INTO fee_invoice (id, fee_id, invoice_id)
VALUES
(1, 1, 'INV-2023-01-0001'),
(2, 2, 'INV-2023-01-0001'),
(3, 3, 'INV-2023-01-0001'),
(4, 4, 'INV-2023-01-0002'),
(5, 8, 'INV-2023-01-0002'),
(6, 12, 'INV-2023-01-0002'),
(7, 2, 'INV-2023-01-0003'),
(8, 17, 'INV-2023-01-0003'),
(9, 19, 'INV-2023-01-0003'),
(10, 1, 'INV-2023-02-0001'),
(11, 2, 'INV-2023-02-0001'),
(12, 3, 'INV-2023-02-0001'),
(13, 4, 'INV-2023-02-0002'),
(14, 8, 'INV-2023-02-0002'),
(15, 12, 'INV-2023-02-0002'),
(16, 2, 'INV-2023-02-0003'),
(17, 17, 'INV-2023-02-0003'),
(18, 19, 'INV-2023-02-0003'),
(19, 1, 'INV-2023-03-0001'),
(20, 2, 'INV-2023-03-0001'),
(21, 3, 'INV-2023-03-0001'),
(22, 4, 'INV-2023-03-0002'),
(23, 8, 'INV-2023-03-0002'),
(24, 12, 'INV-2023-03-0002'),
(25, 2, 'INV-2023-03-0003'),
(26, 17, 'INV-2023-03-0003'),
(27, 19, 'INV-2023-03-0003'),
(28, 5, 'INV-2023-04-0001'),
(29, 6, 'INV-2023-04-0001'),
(30, 13, 'INV-2023-04-0001');

-- Update Apartment owner_id with some NULL values to match status='Vacal'
UPDATE Apartment SET owner_id = NULL WHERE status = 'Vacal';

-- Update Vehicle register_date with some NULL values
UPDATE Vehicle SET register_date = NULL WHERE id IN ('29A-12345', '30A-34567', '29B-56789');

-- End of database seed script