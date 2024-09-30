
\c m3_dev


-- Insert data into the lenders table
INSERT INTO "lenders" (email, password, business_name) VALUES
('lender1@example.com', 'password123', 'Lender Corp'),
('lender2@example.com', 'securePass!45', 'Finance Solutions'),
('lender3@example.com', 'l3nd3rP@ss', 'Quick Loans LLC'),
('lender4@example.com', '4Lend!P@ss', 'Smart Financing Inc.'),
('lender5@example.com', 'P@ssw0rd456', 'Capital Partners');

-- Insert data into the borrowers table
INSERT INTO "borrowers" (email, password, city, street, state, zip_code, phone, business_name, credit_score, start_date, industry) VALUES
('borrower1@example.com', 'b0rr0wPass', 'New York', '123 Main St', 'NY', '10001', '1234567890', 'Small Biz LLC', 720, '2020-05-15', 'Retail'),
('borrower2@example.com', 'SecureBorr2', 'Los Angeles', '456 Elm St', 'CA', '90001', '0987654321', 'Tech Innovators', 680, '2019-03-10', 'Technology'),
('borrower3@example.com', 'Borr3werPass', 'Chicago', '789 Oak St', 'IL', '60601', '2345678901', 'Food Services Co', 650, '2018-07-01', 'Food & Beverage'),
('borrower4@example.com', 'passwordPass4', 'Houston', '321 Pine St', 'TX', '77001', '3456789012', 'Construction Pros', 700, '2021-01-20', 'Construction'),
('borrower5@example.com', '5BorrowMe!', 'Miami', '987 Maple St', 'FL', '33101', '4567890123', 'Healthcare Hub', 740, '2022-10-05', 'Healthcare');

-- Insert data into the loan_requests table
INSERT INTO "loan_requests" (title, description, value, created_at, funded_at, accepted_proposal_id, borrower_id) VALUES
('Expansion Loan', 'Loan to expand operations and purchase new equipment.', 50000.00, '2023-01-15', NULL, NULL, 1),
('Tech Upgrade', 'Loan to upgrade software and IT infrastructure.', 75000.00, '2023-02-10', '2023-03-01', 2, 2),
('Restaurant Renovation', 'Loan to renovate restaurant and improve kitchen facilities.', 100000.00, '2023-03-05', NULL, NULL, 3),
('Warehouse Purchase', 'Loan to purchase a new warehouse for inventory storage.', 200000.00, '2023-04-12', NULL, NULL, 4),
('Clinic Expansion', 'Loan to expand clinic services and add new equipment.', 150000.00, '2023-05-18', NULL, NULL, 5);

-- Insert data into the loan_proposals table with accepted values
INSERT INTO "loan_proposals" (title, description, loan_amount, interest_rate, repayment_term, created_at, accepted, lender_id, loan_request_id) VALUES
('Low-Interest Proposal', 'Offering a low-interest loan with flexible repayment options.',  50000.00, 5.00, 36, '2023-01-20', NULL, 1, 1),
('Fast Approval', 'Fast approval process and moderate interest rates.',  75000.00, 5.00, 36, '2023-02-12', NULL, 2, 2),
('Flexible Terms', 'Offering flexible repayment terms to suit your business needs.', 100000.00, 5.00, 16,  '2023-03-10', NULL, 3, 3),
('Quick Disbursement', 'Loan can be disbursed within 5 business days upon approval.', 200000.00, 5.00, 12,  '2023-04-15', NULL, 4, 4),
('No Prepayment Penalty', 'No penalties for early repayment of the loan.', 150000.00, 5.00, 42,  '2023-05-20', NULL, 5, 5);
