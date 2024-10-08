DROP DATABASE IF EXISTS m3_dev;
CREATE DATABASE m3_dev;

\c m3_dev;

CREATE TABLE "users"(
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(140) UNIQUE NOT NULL,
  "password" VARCHAR(140) NOT NULL,
  "role" VARCHAR(10) NOT NULL
);

CREATE TABLE "lenders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "business_name" TEXT NOT NULL,
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE "borrowers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "city" VARCHAR(100) NOT NULL,
  "street" VARCHAR(100) NOT NULL,
  "state" VARCHAR(100) NOT NULL,
  "zip_code" VARCHAR(11) NOT NULL,
  "phone" VARCHAR(10) NOT NULL,
  "business_name" TEXT NOT NULL,
  "credit_score" INTEGER NOT NULL,
  "start_date" DATE NOT NULL,
  "industry" VARCHAR(100) NOT NULL,
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE TABLE "loan_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(140) NOT NULL,
  "description" TEXT NOT NULL,
  "value" NUMERIC(15, 2) NOT NULL,
  "created_at" DATE NOT NULL,
  "funded_at" DATE DEFAULT NULL,
  -- "accepted_proposal_id" INTEGER DEFAULT NULL,
  "accepted_proposal_id" uuid DEFAULT NULL,
  "borrower_id" uuid  REFERENCES "borrowers" ("id") ON DELETE CASCADE
  
);

CREATE TABLE "loan_proposals" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(140) NOT NULL,
  "description" TEXT NOT NULL,
  "loan_amount" NUMERIC(15, 2) NOT NULL,  -- Loan amount (e.g., $10,000.00)
  "interest_rate" NUMERIC(5, 2) NOT NULL,  -- Interest rate as a percentage (e.g., 5.00%)
  "repayment_term" INTEGER NOT NULL,  -- Repayment term in months (e.g., 24 for 2 years)
  "created_at" DATE NOT NULL,
  "accepted" BOOLEAN DEFAULT NULL,
  "lender_id" uuid REFERENCES "lenders" ("id") ON DELETE CASCADE,
  "loan_request_id" uuid REFERENCES "loan_requests" ("id") ON DELETE CASCADE
);

ALTER TABLE loan_requests
ADD CONSTRAINT fk_customer
      FOREIGN KEY (accepted_proposal_id)
      REFERENCES loan_proposals (id);