
DROP DATABASE IF EXISTS m3_dev;
CREATE DATABASE m3_dev;

\c m3_dev;

CREATE TABLE "lenders" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(140) UNIQUE NOT NULL,
  "password" VARCHAR(140) NOT NULL,
  "business_name" TEXT NOT NULL
);

CREATE TABLE "borrowers" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(140) UNIQUE NOT NULL,
  "password" VARCHAR(140) NOT NULL,
  "city" VARCHAR(100) NOT NULL,
  "street" VARCHAR(100) NOT NULL,
  "state" VARCHAR(100) NOT NULL,
  "zip_code" VARCHAR(11) NOT NULL,
  "phone" VARCHAR(10) NOT NULL,
  "business_name" TEXT NOT NULL,
  "credit_score" INTEGER NOT NULL,
  "start_date" DATE NOT NULL,
  "industry" VARCHAR(100) NOT NULL
);

CREATE TABLE "loan_requests" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(140) NOT NULL,
  "description" TEXT NOT NULL,
  "value" FLOAT NOT NULL,
  "created_at" DATE NOT NULL,
  "funded_at" DATE DEFAULT NULL,
  "borrower_id" INTEGER  REFERENCES "borrowers" ("id") ON DELETE CASCADE
);

CREATE TABLE "loan_proposals" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(140) NOT NULL,
  "description" TEXT NOT NULL,
  "created_at" DATE NOT NULL,
  "accepted" BOOLEAN DEFAULT NULL,
  "lender_id" INTEGER REFERENCES "lenders" ("id") ON DELETE CASCADE,
  "loan_request_id" INTEGER REFERENCES "loan_requests" ("id") ON DELETE CASCADE
);
