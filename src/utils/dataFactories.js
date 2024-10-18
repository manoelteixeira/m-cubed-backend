// utils/factory.jsx
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const { getRandomName, choose, randomInt } = require("./commons");
require("dotenv").config();
const SALT = parseInt(process.env.SALT);

function createLender() {
  const name = getRandomName();

  return {
    business_name: name,
    email: name.replaceAll(" ", "_").toLowerCase() + "@lender.com",
  };
}

function lenderFactory(num) {
  const emailList = [];
  const lenders = [];
  while (lenders.length < num) {
    const lender = createLender();
    if (!emailList.includes(lender.email)) {
      lenders.push(lender);
    }
  }
  return lenders;
}

function createBorrower() {
  const name = getRandomName();
  const industry_options = [
    "Retail",
    "Food Service",
    "Technology",
    "Manufacturing",
    "Healthcare",
  ];
  return {
    business_name: name,
    email:
      name.replaceAll(" ", "_").toLowerCase() +
      `${randomInt(1800, 2024)}` +
      "@lender.com",
    city: faker.location.city().replaceAll("'", "''"),
    street: faker.location.streetAddress().replaceAll("'", "''"),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    phone: faker.phone.number({ style: "international" }).slice(2),
    ein: faker.string.numeric(9),
    start_date: faker.date.past({ years: 10 }).toISOString(),
    industry: choose(industry_options),
  };
}

function borrowerFactory(num) {
  const emailList = [];
  const borrowers = [];
  while (borrowers.length < num) {
    const borrower = createBorrower();
    if (!emailList.includes(borrower.email)) {
      borrowers.push(borrower);
    }
  }
  return borrowers;
}

function createLoanRequest(id) {
  const date = faker.date.past({ days: 10 });
  const expiration = faker.date.future({ days: 31, refDate: date });
  const description = faker.commerce.productDescription();
  return {
    title: `New ${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
    description: description.replaceAll("'", "''"),
    value: Number(faker.commerce.price({ min: 2000, max: 10000 })),
    created_at: date.toISOString(),
    expiration_date: expiration.toISOString(),
    borrower_id: id,
  };
}

function createLoanProposal(request, lender) {
  const date = new Date(request.created_at);
  date.setHours(date.getHours() + randomInt(1, 12));
  const expiration = faker.date.future({ days: 31, refDate: date });
  const description = faker.hacker.phrase();
  return {
    title: `${lender.business_name} - ${request.title}`,
    description: description.replaceAll("'", "''"),
    loan_amount: request.value,
    interest_rate: randomInt(0, 12) / 100,
    repayment_term: randomInt(12, 60),
    lender_id: lender.id,
    created_at: date.toISOString(),
    expiration_date: expiration.toISOString(),
    loan_request_id: request.id,
  };
}

function createCreditReport(id) {
  const created = faker.date.past({ days: 10 });
  const end = faker.date.future({ days: 31, refDate: created });
  const bureauList = ["Expirian", "Equifax", "Trus Me Bro"];
  return {
    credit_bureau: choose(bureauList),
    report_id: `${faker.string.alphanumeric(15)}`,
    score: randomInt(550, 780),
    created_at: created.toISOString(),
    expiration_date: end.toISOString(),
    borrower_id: id,
  };
}

async function createUser(user, role) {
  const password = await bcrypt.hash("password123", SALT);
  const now = new Date().toISOString();
  return {
    email: user.email,
    password,
    role,
    last_logged: now,
  };
}

function loanRequestFactory(num, id) {
  const loanRequests = [];
  let total = 0;
  while (loanRequests.length < num) {
    const request = createLoanRequest(id);
    total += request.value;
    if (total < 200000.0) {
      loanRequests.push(request);
    } else {
      break;
    }
  }
  return loanRequests;
}

module.exports = {
  createLender,
  createBorrower,
  createUser,
  createLoanRequest,
  createLoanProposal,
  borrowerFactory,
  lenderFactory,
  loanRequestFactory,
  createCreditReport,
};
