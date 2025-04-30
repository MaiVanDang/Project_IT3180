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
INSERT INTO Apartment (address_number, area, status, owner_id, owner_phone, number_of_members)
VALUES
(101, 75.5, 'Residental', NULL, 84987654321, 2),
(102, 85.2, 'Residental', NULL, 84987654322, 3),
(103, 60.0, 'Residental', NULL, 84987654323, 1),
(104, 90.3, 'Business', NULL, 84987654324, 0),
(105, 70.8, 'Residental', NULL, 84987654325, 4),
(106, 100.1, 'Residental', NULL, 84987654326, 2),
(107, 65.7, 'Vacal', NULL, NULL, 0),
(108, 95.2, 'Residental', NULL, 84987654328, 3),
(109, 80.0, 'Business', NULL, 84987654329, 0),
(110, 72.6, 'Residental', NULL, 84987654330, 2),
(201, 85.5, 'Residental', NULL, 84987654331, 4),
(202, 95.2, 'Business', NULL, 84987654332, 0),
(203, 65.0, 'Residental', NULL, 84987654333, 1),
(204, 110.3, 'Residental', NULL, 84987654334, 5),
(205, 75.8, 'Vacal', NULL, NULL, 0),
(206, 90.1, 'Residental', NULL, 84987654336, 2),
(207, 68.7, 'Residental', NULL, 84987654337, 3),
(208, 105.2, 'Business', NULL, 84987654338, 0),
(209, 82.0, 'Residental', NULL, 84987654339, 2),
(210, 77.6, 'Residental', NULL, 84987654340, 3),
(301, 95.5, 'Residental', NULL, 84987654341, 2),
(302, 85.2, 'Vacal', NULL, NULL, 0),
(303, 70.0, 'Residental', NULL, 84987654343, 1),
(304, 100.3, 'Business', NULL, 84987654344, 0),
(305, 82.8, 'Residental', NULL, 84987654345, 4),
(306, 110.1, 'Residental', NULL, 84987654346, 3),
(307, 75.7, 'Residental', NULL, 84987654347, 2),
(308, 90.2, 'Business', NULL, 84987654348, 0),
(309, 78.0, 'Residental', NULL, 84987654349, 1),
(310, 92.6, 'Residental', NULL, 84987654350, 5);

-- Create Resident data
INSERT INTO Resident (id, name, dob, gender, cic, address_number, status, status_date)
VALUES
(1, 'Nguyen Van An', '1985-03-15', 1, '2020-05-20 10:30:00', 101, 'Permanent resident', '2020-06-01'),
(2, 'Tran Thi Binh', '1990-07-23', 0, '2020-05-22 09:15:00', 101, 'Permanent resident', '2020-06-01'),
(3, 'Le Van Cuong', '1982-11-05', 1, '2020-06-10 14:20:00', 102, 'Permanent resident', '2020-06-15'),
(4, 'Pham Thi Duyen', '1988-04-18', 0, '2020-06-12 11:45:00', 102, 'Permanent resident', '2020-06-15'),
(5, 'Hoang Minh Duc', '1995-09-30', 1, '2020-06-15 16:30:00', 102, 'Temporary resident', '2020-06-20'),
(6, 'Nguyen Thu Ha', '1991-02-27', 0, '2020-07-05 08:50:00', 103, 'Permanent resident', '2020-07-10'),
(7, 'Tran Van Giang', '1975-12-12', 1, '2020-07-10 13:25:00', 105, 'Permanent resident', '2020-07-15'),
(8, 'Le Thi Huong', '1978-08-08', 0, '2020-07-12 15:40:00', 105, 'Permanent resident', '2020-07-15'),
(9, 'Pham Van Kien', '2000-01-20', 1, '2020-07-15 10:15:00', 105, 'Permanent resident', '2020-07-20'),
(10, 'Hoang Thi Lan', '2005-05-03', 0, '2020-07-20 09:30:00', 105, 'Permanent resident', '2020-07-25'),
(11, 'Nguyen Van Minh', '1983-06-25', 1, '2020-08-01 14:45:00', 106, 'Permanent resident', '2020-08-05'),
(12, 'Tran Thi Nga', '1986-10-17', 0, '2020-08-03 16:20:00', 106, 'Permanent resident', '2020-08-05'),
(13, 'Le Van Oanh', '1992-03-08', 1, '2020-08-10 11:35:00', 108, 'Permanent resident', '2020-08-15'),
(14, 'Pham Thi Phuong', '1994-07-19', 0, '2020-08-12 13:50:00', 108, 'Permanent resident', '2020-08-15'),
(15, 'Hoang Quoc Quan', '1996-11-28', 1, '2020-08-15 15:25:00', 108, 'Temporary resident', '2020-08-20'),
(16, 'Nguyen Thi Rang', '1987-04-14', 0, '2020-09-01 10:40:00', 110, 'Permanent resident', '2020-09-05'),
(17, 'Tran Van Son', '1989-08-22', 1, '2020-09-03 12:15:00', 110, 'Permanent resident', '2020-09-05'),
(18, 'Le Thi Tuyet', '1993-12-09', 0, '2020-09-10 14:30:00', 201, 'Permanent resident', '2020-09-15'),
(19, 'Pham Van Ung', '1984-05-05', 1, '2020-09-12 16:45:00', 201, 'Permanent resident', '2020-09-15'),
(20, 'Hoang Thi Van', '1990-09-16', 0, '2020-09-15 09:20:00', 201, 'Permanent resident', '2020-09-20'),
(21, 'Nguyen Van Xuan', '1997-01-27', 1, '2020-09-20 11:35:00', 201, 'Temporary resident', '2020-09-25'),
(22, 'Tran Thi Yen', '1986-06-08', 0, '2020-10-01 13:50:00', 203, 'Permanent resident', '2020-10-05'),
(23, 'Le Van Anh', '1981-10-19', 1, '2020-10-05 15:25:00', 204, 'Permanent resident', '2020-10-10'),
(24, 'Pham Thi Bao', '1983-02-28', 0, '2020-10-07 10:40:00', 204, 'Permanent resident', '2020-10-10'),
(25, 'Hoang Minh Chau', '1985-07-11', 1, '2020-10-10 12:15:00', 204, 'Permanent resident', '2020-10-15'),
(26, 'Nguyen Thu Dung', '1988-11-22', 0, '2020-10-12 14:30:00', 204, 'Permanent resident', '2020-10-15'),
(27, 'Tran Van Em', '1991-04-03', 1, '2020-10-15 16:45:00', 204, 'Temporary resident', '2020-10-20'),
(28, 'Le Thi Giang', '1994-08-14', 0, '2020-11-01 09:20:00', 206, 'Permanent resident', '2020-11-05'),
(29, 'Pham Van Hai', '1996-12-25', 1, '2020-11-03 11:35:00', 206, 'Permanent resident', '2020-11-05'),
(30, 'Hoang Thi Khang', '1998-05-06', 0, '2020-11-10 13:50:00', 207, 'Permanent resident', '2020-11-15');

-- Update Apartment owner_id with Resident id
UPDATE Apartment SET owner_id = 1 WHERE address_number = 101;
UPDATE Apartment SET owner_id = 3 WHERE address_number = 102;
UPDATE Apartment SET owner_id = 6 WHERE address_number = 103;
UPDATE Apartment SET owner_id = 7 WHERE address_number = 105;
UPDATE Apartment SET owner_id = 11 WHERE address_number = 106;
UPDATE Apartment SET owner_id = 13 WHERE address_number = 108;
UPDATE Apartment SET owner_id = 16 WHERE address_number = 110;
UPDATE Apartment SET owner_id = 18 WHERE address_number = 201;
UPDATE Apartment SET owner_id = 22 WHERE address_number = 203;
UPDATE Apartment SET owner_id = 23 WHERE address_number = 204;
UPDATE Apartment SET owner_id = 28 WHERE address_number = 206;
UPDATE Apartment SET owner_id = 30 WHERE address_number = 207;

-- Create Fee data
INSERT INTO Fee (id, name, description, fee_type_enum, unit_price)
VALUES
(1, 'Management Fee', 'Monthly fee for apartment management services', 'DeparmentFee', 100000.00),
(2, 'Security Fee', 'Monthly fee for security services', 'DeparmentFee', 50000.00),
(3, 'Cleaning Fee', 'Monthly fee for common area cleaning', 'DeparmentFee', 30000.00),
(4, 'Elevator Maintenance', 'Fee for elevator maintenance', 'DeparmentFee', 20000.00),
(5, 'Building Insurance', 'Annual building insurance contribution', 'ContributionFund', 200000.00),
(6, 'Renovation Fund', 'Fund for future building renovations', 'ContributionFund', 150000.00),
(7, 'Event Fund', 'Fund for community events', 'ContributionFund', 50000.00),
(8, 'Garbage Collection', 'Fee for garbage collection services', 'DeparmentFee', 25000.00),
(9, 'Parking Fee', 'Monthly fee for parking spaces', 'DeparmentFee', 100000.00),
(10, 'Swimming Pool', 'Fee for swimming pool maintenance', 'DeparmentFee', 80000.00),
(11, 'Gym Fee', 'Fee for gym facilities', 'DeparmentFee', 75000.00),
(12, 'Garden Maintenance', 'Fee for garden maintenance', 'DeparmentFee', 20000.00),
(13, 'Emergency Fund', 'Fund for emergency situations', 'ContributionFund', 100000.00),
(14, 'Fire Safety System', 'Maintenance of fire safety equipment', 'DeparmentFee', 30000.00),
(15, 'Playground Maintenance', 'Fee for playground upkeep', 'DeparmentFee', 15000.00),
(16, 'Pest Control', 'Fee for pest control services', 'DeparmentFee', 20000.00),
(17, 'CCTV Maintenance', 'Fee for security camera system', 'DeparmentFee', 25000.00),
(18, 'Lobby Decoration', 'Fund for lobby decoration', 'ContributionFund', 50000.00),
(19, 'Staff Salary', 'Contribution for building staff salaries', 'DeparmentFee', 120000.00),
(20, 'Water Pump Maintenance', 'Fee for water system maintenance', 'DeparmentFee', 15000.00),
(21, 'Electrical System', 'Fee for electrical system maintenance', 'DeparmentFee', 20000.00),
(22, 'Annual Festival', 'Fund for annual building festival', 'ContributionFund', 70000.00),
(23, 'Backup Generator', 'Fee for generator maintenance', 'DeparmentFee', 30000.00),
(24, 'Common Area Utilities', 'Fee for common area electricity and water', 'DeparmentFee', 40000.00),
(25, 'Sport Facilities', 'Maintenance of sport facilities', 'DeparmentFee', 60000.00),
(26, 'Children Activities', 'Fund for children activities', 'ContributionFund', 30000.00),
(27, 'Guest Reception', 'Fee for reception services', 'DeparmentFee', 20000.00),
(28, 'Roof Maintenance', 'Fund for roof maintenance', 'ContributionFund', 80000.00),
(29, 'Water Tank Cleaning', 'Fee for water tank cleaning service', 'DeparmentFee', 40000.00),
(30, 'Facade Cleaning', 'Fee for building facade cleaning', 'DeparmentFee', 50000.00);

-- Create Vehicle data
INSERT INTO Vehicle (id, category, apartment_address_number, register_date, address_id)
VALUES
('29A-12345', 'Motobike', 101, '2020-06-10', 101),
('29A-23456', 'Motobike', 101, '2020-06-15', 101),
('30A-34567', 'Car', 102, '2020-07-05', 102),
('30A-45678', 'Car', 102, '2020-07-10', 102),
('29B-56789', 'Motobike', 103, '2020-07-15', 103),
('29B-67890', 'Motobike', 105, '2020-08-01', 105),
('30B-78901', 'Car', 105, '2020-08-05', 105),
('30B-89012', 'Car', 106, '2020-08-10', 106),
('29C-90123', 'Motobike', 106, '2020-08-15', 106),
('29C-01234', 'Motobike', 108, '2020-09-01', 108),
('30C-12345', 'Car', 108, '2020-09-05', 108),
('30C-23456', 'Car', 110, '2020-09-10', 110),
('29D-34567', 'Motobike', 110, '2020-09-15', 110),
('29D-45678', 'Motobike', 201, '2020-10-01', 201),
('30D-56789', 'Car', 201, '2020-10-05', 201),
('30D-67890', 'Car', 201, '2020-10-10', 201),
('29E-78901', 'Motobike', 203, '2020-10-15', 203),
('29E-89012', 'Motobike', 204, '2020-11-01', 204),
('30E-90123', 'Car', 204, '2020-11-05', 204),
('30E-01234', 'Car', 204, '2020-11-10', 204),
('29F-12345', 'Motobike', 206, '2020-11-15', 206),
('29F-23456', 'Motobike', 206, '2020-11-20', 206),
('30F-34567', 'Car', 207, '2020-12-01', 207),
('30F-45678', 'Car', 209, '2020-12-05', 209),
('29G-56789', 'Motobike', 209, '2020-12-10', 209),
('29G-67890', 'Motobike', 210, '2020-12-15', 210),
('30G-78901', 'Car', 210, '2020-12-20', 210),
('30G-89012', 'Car', 301, '2021-01-05', 301),
('29H-90123', 'Motobike', 301, '2021-01-10', 301),
('29H-01234', 'Motobike', 303, '2021-01-15', 303);

-- Create User data
INSERT INTO User (id, name, email, password, auth_type, google_account_id, refresh_token, is_active)
VALUES
(1, 'Admin User', 'admin@apartment.com', '$2a$10$XDzGJ1RmBjC4S/gTnFHYk.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(2, 'Nguyen Van An', 'nguyenvanan@gmail.com', '$2a$10$abcdefghijklmnopqrstuv.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(3, 'Tran Thi Binh', 'tranthibinh@gmail.com', '$2a$10$wxyzabcdefghijklmnopqrs.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(4, 'Le Van Cuong', 'levancuong@gmail.com', '$2a$10$123456789abcdefghijklmn.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(5, 'Pham Thi Duyen', 'phamthiduyen@gmail.com', '$2a$10$nopqrstuvwxyz123456789.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(6, 'Hoang Minh Duc', 'hoangminhduc@gmail.com', '$2a$10$abcdefg12345hijklmnopq.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g12345', 'refresh_token_1', 1),
(7, 'Nguyen Thu Ha', 'nguyenthuha@gmail.com', '$2a$10$rstuvwx67890yzabcdefgh.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g23456', 'refresh_token_2', 1),
(8, 'Tran Van Giang', 'tranvangiang@gmail.com', '$2a$10$ijklmno12345pqrstuvwxy.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(9, 'Le Thi Huong', 'lethihuong@gmail.com', '$2a$10$zabcdef67890ghijklmnop.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(10, 'Pham Van Kien', 'phamvankien@gmail.com', '$2a$10$qrstuvw12345xyzabcdefg.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g34567', 'refresh_token_3', 1),
(11, 'Hoang Thi Lan', 'hoangthilan@gmail.com', '$2a$10$hijklmn67890opqrstuvwx.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(12, 'Nguyen Van Minh', 'nguyenvanminh@gmail.com', '$2a$10$yzabcde12345fghijklmno.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(13, 'Tran Thi Nga', 'tranthinga@gmail.com', '$2a$10$pqrstuv67890wxyzabcdef.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g45678', 'refresh_token_4', 1),
(14, 'Le Van Oanh', 'levanoanh@gmail.com', '$2a$10$ghijklm12345nopqrstuvw.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(15, 'Pham Thi Phuong', 'phamthiphuong@gmail.com', '$2a$10$xyzabcd67890efghijklmn.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(16, 'Hoang Quoc Quan', 'hoangquocquan@gmail.com', '$2a$10$opqrstu12345vwxyzabcde.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g56789', 'refresh_token_5', 1),
(17, 'Nguyen Thi Rang', 'nguyenthirang@gmail.com', '$2a$10$fghijkl67890mnopqrstuv.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(18, 'Tran Van Son', 'tranvanson@gmail.com', '$2a$10$uvwxyzab12345cdefghijklm.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 0),
(19, 'Le Thi Tuyet', 'lethituyet@gmail.com', '$2a$10$nopqrst67890uvwxyzabcde.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g67890', 'refresh_token_6', 1),
(20, 'Pham Van Ung', 'phamvanung@gmail.com', '$2a$10$fghijkl12345mnopqrstuvw.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(21, 'Hoang Thi Van', 'hoangthivan@gmail.com', '$2a$10$xyzabcd67890efghijklmno.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(22, 'Nguyen Van Xuan', 'nguyenvanxuan@gmail.com', '$2a$10$pqrstuv12345wxyzabcdef.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g78901', 'refresh_token_7', 1),
(23, 'Tran Thi Yen', 'tranthiyen@gmail.com', '$2a$10$ghijklm67890nopqrstuvwx.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(24, 'Le Van Anh', 'levananh@gmail.com', '$2a$10$yzabcde12345fghijklmnop.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(25, 'Pham Thi Bao', 'phamthibao@gmail.com', '$2a$10$qrstuvw67890xyzabcdefgh.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g89012', 'refresh_token_8', 1),
(26, 'Hoang Minh Chau', 'hoangminhchau@gmail.com', '$2a$10$ijklmno12345pqrstuvwxyz.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 0),
(27, 'Nguyen Thu Dung', 'nguyenthudung@gmail.com', '$2a$10$abcdefg67890hijklmnopqr.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(28, 'Tran Van Em', 'tranvanem@gmail.com', '$2a$10$stuvwxy12345zabcdefghij.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'google', 'g90123', 'refresh_token_9', 1),
(29, 'Le Thi Giang', 'lethigiang@gmail.com', '$2a$10$klmnopq67890rstuvwxyzab.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1),
(30, 'Pham Van Hai', 'phamvanhai@gmail.com', '$2a$10$cdefghi12345jklmnopqrstu.4K5U2AIg5A7xgF0qGg9gQOLxMsgQQo2', 'local', NULL, NULL, 1);

-- Create Invoice data
INSERT INTO Invoice (id, description, name, updated_at)
VALUES
('INV-2023-01-0001', 'January 2023 building fees', 'Monthly Building Fee - Jan 2023', '2023-01-10 10:00:00'),
('INV-2023-01-0002', 'January 2023 maintenance fees', 'Maintenance Fee - Jan 2023', '2023-01-10 10:15:00'),
('INV-2023-01-0003', 'January 2023 security fees', 'Security Fee - Jan 2023', '2023-01-10 10:30:00'),
('INV-2023-02-0001', 'February 2023 building fees', 'Monthly Building Fee - Feb 2023', '2023-02-10 10:00:00'),
('INV-2023-02-0002', 'February 2023 maintenance fees', 'Maintenance Fee - Feb 2023', '2023-02-10 10:15:00'),
('INV-2023-02-0003', 'February 2023 security fees', 'Security Fee - Feb 2023', '2023-02-10 10:30:00'),
('INV-2023-03-0001', 'March 2023 building fees', 'Monthly Building Fee - Mar 2023', '2023-03-10 10:00:00'),
('INV-2023-03-0002', 'March 2023 maintenance fees', 'Maintenance Fee - Mar 2023', '2023-03-10 10:15:00'),
('INV-2023-03-0003', 'March 2023 security fees', 'Security Fee - Mar 2023', '2023-03-10 10:30:00'),
('INV-2023-04-0001', 'April 2023 building fees', 'Monthly Building Fee - Apr 2023', '2023-04-10 10:00:00'),
('INV-2023-04-0002', 'April 2023 maintenance fees', 'Maintenance Fee - Apr 2023', '2023-04-10 10:15:00'),
('INV-2023-04-0003', 'April 2023 security fees', 'Security Fee - Apr 2023', '2023-04-10 10:30:00'),
('INV-2023-05-0001', 'May 2023 building fees', 'Monthly Building Fee - May 2023', '2023-05-10 10:00:00'),
('INV-2023-05-0002', 'May 2023 maintenance fees', 'Maintenance Fee - May 2023', '2023-05-10 10:15:00'),
('INV-2023-05-0003', 'May 2023 security fees', 'Security Fee - May 2023', '2023-05-10 10:30:00'),
('INV-2023-06-0001', 'June 2023 building fees', 'Monthly Building Fee - Jun 2023', '2023-06-10 10:00:00'),
('INV-2023-06-0002', 'June 2023 maintenance fees', 'Maintenance Fee - Jun 2023', '2023-06-10 10:15:00'),
('INV-2023-06-0003', 'June 2023 security fees', 'Security Fee - Jun 2023', '2023-06-10 10:30:00'),
('INV-2023-07-0001', 'July 2023 building fees', 'Monthly Building Fee - Jul 2023', '2023-07-10 10:00:00'),
('INV-2023-07-0002', 'July 2023 maintenance fees', 'Maintenance Fee - Jul 2023', '2023-07-10 10:15:00'),
('INV-2023-07-0003', 'July 2023 security fees', 'Security Fee - Jul 2023', '2023-07-10 10:30:00'),
('INV-2023-08-0001', 'August 2023 building fees', 'Monthly Building Fee - Aug 2023', '2023-08-10 10:00:00'),
('INV-2023-08-0002', 'August 2023 maintenance fees', 'Maintenance Fee - Aug 2023', '2023-08-10 10:15:00'),
('INV-2023-08-0003', 'August 2023 security fees', 'Security Fee - Aug 2023', '2023-08-10 10:30:00'),
('INV-2023-09-0001', 'September 2023 building fees', 'Monthly Building Fee - Sep 2023', '2023-09-10 10:00:00'),
('INV-2023-09-0002', 'September 2023 maintenance fees', 'Maintenance Fee - Sep 2023', '2023-09-10 10:15:00'),
('INV-2023-09-0003', 'September 2023 security fees', 'Security Fee - Sep 2023', '2023-09-10 10:30:00'),
('INV-2023-10-0001', 'October 2023 building fees', 'Monthly Building Fee - Oct 2023', '2023-10-10 10:00:00'),
('INV-2023-10-0002', 'October 2023 maintenance fees', 'Maintenance Fee - Oct 2023', '2023-10-10 10:15:00'),
('INV-2023-10-0003', 'October 2023 security fees', 'Security Fee - Oct 2023', '2023-10-10 10:30:00');

-- Create Utility_Bill data
INSERT INTO Utility_Bill (id, name, address_id, created_at, date, water, electricity, internet, payment_status)
VALUES
('UTI-2023-01-0001', 'January 2023 Utilities - Apt 101', 101, '2023-01-15 09:00:00', '2023-01-15', 125000.00, 350000.00, 200000.00, 'Paid'),
('UTI-2023-01-0002', 'January 2023 Utilities - Apt 102', 102, '2023-01-15 09:15:00', '2023-01-15', 150000.00, 400000.00, 200000.00, 'Paid'),
('UTI-2023-01-0003', 'January 2023 Utilities - Apt 103', 103, '2023-01-15 09:30:00', '2023-01-15', 100000.00, 250000.00, 200000.00, 'Paid'),
('UTI-2023-01-0004', 'January 2023 Utilities - Apt 105', 105, '2023-01-15 09:45:00', '2023-01-15', 180000.00, 425000.00, 200000.00, 'Paid'),
('UTI-2023-01-0005', 'January 2023 Utilities - Apt 106', 106, '2023-01-15 10:00:00', '2023-01-15', 130000.00, 375000.00, 200000.00, 'Paid'),
('UTI-2023-02-0001', 'February 2023 Utilities - Apt 101', 101, '2023-02-15 09:00:00', '2023-02-15', 120000.00, 330000.00, 200000.00, 'Paid'),
('UTI-2023-02-0002', 'February 2023 Utilities - Apt 102', 102, '2023-02-15 09:15:00', '2023-02-15', 145000.00, 380000.00, 200000.00, 'Paid'),
('UTI-2023-02-0003', 'February 2023 Utilities - Apt 103', 103, '2023-02-15 09:30:00', '2023-02-15', 95000.00, 240000.00, 200000.00, 'Paid'),
('UTI-2023-02-0004', 'February 2023 Utilities - Apt 105', 105, '2023-02-15 09:45:00', '2023-02-15', 175000.00, 415000.00, 200000.00, 'Paid'),
('UTI-2023-02-0005', 'February 2023 Utilities - Apt 106', 106, '2023-02-15 10:00:00', '2023-02-15', 125000.00, 365000.00, 200000.00, 'Paid'),
('UTI-2023-03-0001', 'March 2023 Utilities - Apt 101', 101, '2023-03-15 09:00:00', '2023-03-15', 130000.00, 360000.00, 200000.00, 'Paid'),
('UTI-2023-03-0002', 'March 2023 Utilities - Apt 102', 102, '2023-03-15 09:15:00', '2023-03-15', 155000.00, 410000.00, 200000.00, 'Paid'),
('UTI-2023-03-0003', 'March 2023 Utilities - Apt 103', 103, '2023-03-15 09:30:00', '2023-03-15', 105000.00, 260000.00, 200000.00, 'Paid'),
('UTI-2023-03-0004', 'March 2023 Utilities - Apt 105', 105, '2023-03-15 09:45:00', '2023-03-15', 185000.00, 435000.00, 200000.00, 'Paid'),
('UTI-2023-03-0005', 'March 2023 Utilities - Apt 106', 106, '2023-03-15 10:00:00', '2023-03-15', 135000.00, 385000.00, 200000.00, 'Paid'),
('UTI-2023-04-0001', 'April 2023 Utilities - Apt 101', 101, '2023-04-15 09:00:00', '2023-04-15', 140000.00, 390000.00, 200000.00, 'Paid'),
('UTI-2023-04-0002', 'April 2023 Utilities - Apt 102', 102, '2023-04-15 09:15:00', '2023-04-15', 165000.00, 430000.00, 200000.00, 'Paid'),
('UTI-2023-04-0003', 'April 2023 Utilities - Apt 103', 103, '2023-04-15 09:30:00', '2023-04-15', 110000.00, 280000.00, 200000.00, 'Paid'),
('UTI-2023-04-0004', 'April 2023 Utilities - Apt 105', 105, '2023-04-15 09:45:00', '2023-04-15', 190000.00, 445000.00, 200000.00, 'Paid'),
('UTI-2023-04-0005', 'April 2023 Utilities - Apt 106', 106, '2023-04-15 10:00:00', '2023-04-15', 140000.00, 395000.00, 200000.00, 'Paid'),
('UTI-2023-05-0001', 'May 2023 Utilities - Apt 101', 101, '2023-05-15 09:00:00', '2023-05-15', 150000.00, 410000.00, 200000.00, 'Paid'),
('UTI-2023-05-0002', 'May 2023 Utilities - Apt 102', 102, '2023-05-15 09:15:00', '2023-05-15', 175000.00, 450000.00, 200000.00, 'Paid'),
('UTI-2023-05-0003', 'May 2023 Utilities - Apt 103', 103, '2023-05-15 09:30:00', '2023-05-15', 120000.00, 300000.00, 200000.00, 'Paid'),
('UTI-2023-05-0004', 'May 2023 Utilities - Apt 105', 105, '2023-05-15 09:45:00', '2023-05-15', 200000.00, 465000.00, 200000.00, 'Paid'),
('UTI-2023-05-0005', 'May 2023 Utilities - Apt 106', 106, '2023-05-15 10:00:00', '2023-05-15', 145000.00, 405000.00, 200000.00, 'Unpaid'),
('UTI-2023-06-0001', 'June 2023 Utilities - Apt 101', 101, '2023-06-15 09:00:00', '2023-06-15', 160000.00, 430000.00, 200000.00, 'Unpaid'),
('UTI-2023-06-0002', 'June 2023 Utilities - Apt 102', 102, '2023-06-15 09:15:00', '2023-06-15', 185000.00, 470000.00, 200000.00, 'Paid'),
('UTI-2023-06-0003', 'June 2023 Utilities - Apt 103', 103, '2023-06-15 09:30:00', '2023-06-15', 130000.00, 320000.00, 200000.00, 'Unpaid'),
('UTI-2023-06-0004', 'June 2023 Utilities - Apt 105', 105, '2023-06-15 09:45:00', '2023-06-15', 210000.00, 485000.00, 200000.00, 'Paid'),
('UTI-2023-06-0005', 'June 2023 Utilities - Apt 106', 106, '2023-06-15 10:00:00', '2023-06-15', 150000.00, 415000.00, 200000.00, 'Unpaid');

-- Create Invoice_Apartment data
INSERT INTO Invoice_Apartment (id, address_id, invoice_id, payment_status)
VALUES
(1, 101, 'INV-2023-01-0001', 'Paid'),
(2, 102, 'INV-2023-01-0001', 'Paid'),
(3, 103, 'INV-2023-01-0001', 'Paid'),
(4, 105, 'INV-2023-01-0001', 'Paid'),
(5, 106, 'INV-2023-01-0001', 'Paid'),
(6, 108, 'INV-2023-01-0001', 'Paid'),
(7, 110, 'INV-2023-01-0001', 'Paid'),
(8, 201, 'INV-2023-01-0001', 'Paid'),
(9, 203, 'INV-2023-01-0001', 'Paid'),
(10, 204, 'INV-2023-01-0001', 'Paid'),
(11, 101, 'INV-2023-02-0001', 'Paid'),
(12, 102, 'INV-2023-02-0001', 'Paid'),
(13, 103, 'INV-2023-02-0001', 'Paid'),
(14, 105, 'INV-2023-02-0001', 'Paid'),
(15, 106, 'INV-2023-02-0001', 'Paid'),
(16, 108, 'INV-2023-02-0001', 'Paid'),
(17, 110, 'INV-2023-02-0001', 'Paid'),
(18, 201, 'INV-2023-02-0001', 'Paid'),
(19, 203, 'INV-2023-02-0001', 'Paid'),
(20, 204, 'INV-2023-02-0001', 'Paid'),
(21, 101, 'INV-2023-03-0001', 'Paid'),
(22, 102, 'INV-2023-03-0001', 'Paid'),
(23, 103, 'INV-2023-03-0001', 'Paid'),
(24, 105, 'INV-2023-03-0001', 'Paid'),
(25, 106, 'INV-2023-03-0001', 'Paid'),
(26, 108, 'INV-2023-03-0001', 'Paid'),
(27, 110, 'INV-2023-03-0001', 'Paid'),
(28, 201, 'INV-2023-03-0001', 'Paid'),
(29, 203, 'INV-2023-03-0001', 'Paid'),
(30, 204, 'INV-2023-03-0001', 'Paid');

-- Create Fee_Invoice data
INSERT INTO Fee_Invoice (id, fee_id, invoice_id)
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