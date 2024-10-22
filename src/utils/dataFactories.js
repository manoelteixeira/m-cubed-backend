// utils/factory.jsx
const { faker, da } = require("@faker-js/faker");
const bcrypt = require("bcrypt");
const { getRandomName, choose, randomInt, offsetDate } = require("./helpers");
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
    "Agriculture",
    "Construction",
    "Hospitality",
    "Renewable Energy",
    "Other",
  ];
  return {
    business_name: name,
    email:
      name.replaceAll(" ", "_").toLowerCase() +
      `${randomInt(1800, 2024)}` +
      "@borrower.com",
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
  const date = faker.date.past({ days: 5 });
  const expiration = offsetDate(date, { days: 30 });

  const description = faker.commerce.productDescription();
  return {
    title: `New ${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
    description: description.replaceAll("'", "''"),
    value: Number(faker.commerce.price({ min: 2000, max: 100000 })),
    created_at: date.toISOString(),
    expire_at: expiration.toISOString(),
    borrower_id: id,
  };
}

function createLoanProposal(request, report, lender) {
  const possibleRequirements = ["Personal Guarantee ", "Downpayment", "None"];
  let date = new Date(request.created_at);
  date = offsetDate(date, { hours: randomInt(1, 10) });
  const expiration = offsetDate(date, { months: 1 });
  const description = faker.hacker.phrase();
  const { score } = report;
  let requirements = null;
  if (score < 650) {
    requirements = possibleRequirements.slice(0, 2);
  } else if (score < 700) {
    requirements = possibleRequirements[1];
  } else if (score > 750) {
    requirements = possibleRequirements[2];
  }

  return {
    title: `${lender.business_name} - ${request.title}`,
    description: description.replaceAll("'", "''"),
    requirements: requirements,
    loan_amount: request.value,
    interest_rate: randomInt(0, 12) / 100,
    repayment_term: randomInt(12, 60),
    lender_id: lender.id,
    created_at: date.toISOString(),
    expire_at: expiration.toISOString(),
    loan_request_id: request.id,
  };
}

function createCreditReport(id, date) {
  const end = offsetDate(date, { months: 1 });
  const bureauList = [
    "Trust Me Bro ltda",
    "Dun & Bradstreet",
    "Experian Business",
    "Equifax Business",
    "FICO SBSS",
    "CreditSafe",
  ];

  return {
    credit_bureau: choose(bureauList),
    report_id: `${faker.string.alphanumeric(15)}`,
    score: randomInt(600, 850),
    created_at: date.toISOString(),
    expire_at: end.toISOString(),
    borrower_id: id,
  };
}

async function createUser(user, role) {
  const password = await bcrypt.hash("password123", SALT);
  const now = offsetDate(new Date(), { days: -randomInt(0, 10) });
  return {
    email: user.email,
    password,
    role,
    last_logged: now.toISOString(),
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
