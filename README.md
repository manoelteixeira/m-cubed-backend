# Money Money Money

Back-end for [M-Cubed](https://github.com/manoelteixeira/m-cubed-frontend) app

## Instalation And Setup

1. **Fork** and **Clone** this repository
2. Create a **.env** with:
    - `PORT=<server port>`
    - `PG_HOST=<database url>`
    - `PG_PORT=5432`
    - `PG_DATABASE=m3_dev`
    - `PG_USER=postgres`
    - `PG_PASSWORD=<database password - if necessary>`
    - `SECRET=<password>`
3. Install project dependencies with `npm install`

## Commands

- `npm run start`: to run the server
- `npm run watch`: to run the server using **nodemon**
- `npm run db:init`: to initialize the database
- `npm run db:seed`: to seed the database
- `npm run dev`: to initialize and seed the databa

## Endpoints

| #   | Protected | URL | HTTP Method | Description |
| --- | --------- | --- | ----------- | ----------- |
| 00  | ❌ | `/` | GET | API “home” route |
| 01  | ❌ | `/login`  | POST | Log In User |
| 02  | ❌ | `/borrowers/` | POST | Create a new Borrower |
| 03  | ✅ | `/borrowers/:id/` | GET | Get Borrower |
| 04  | ✅ | `/borrowers/:id/` | PUT | Update Borrower |
| 05  | ✅ | `/borrowers/:id/` | DELETE | Delete Borrower |
| 06  | ✅ | `/borrowers/:id/requests/` | GET | Get all loan requests made by the Borrower |
| 07  | ✅ | `/borrowers/:id/requests/` | POST | Create a new loan request |
| 08  | ✅ | `/borrowers/:b_id/request/:id/` | GET | Get single loan request for a given borrower |
| 09  | ✅ | `/borrowers/:b_id/request/:id/` | PUT | Update loan request |
| 10  | ✅ | `/borrowers/:b_id/request/:id/` | DELETE | Delete loan request |
| 11  | ✅ | `/borrowers/:b_id/request/:id/proposals/` | GET | Get all proposals for a single loan request |
| 12  | ✅ | `/borrowers/:b_id/request/:id/proposals/` | PUT | Accept given proposition, and reject all others |
| 13  | ✅ | `/borrowers/:b_id/request/:r_id/proposals/:id`  | GET | Get a single proposition for a given loan |
| 14  | ❌ | `/lenders/` | POST | Create a new Lenders |
| 15  | ✅ | `/lenders/:id/` | GET | Get a Single Lender |
| 16  | ✅ | `/lenders/:id/` | PUT | Update Lender |
| 17  | ✅ | `/lenders/:id/` | DELETE | Delete Lender |
| 18  | ✅ | `/lenders/:id/proposals/` | GET | Get all proposals made by the lender |
| 19  | ✅ | `/lenders/:l_id/proposals/:id/` | GET | Get a single made by the Lender |
| 20  | ✅ | `/lenders/:l_id/proposals/:id/` | PUT | Update loan proposition |
| 21  | ✅ | `/lenders/:l_id/proposals/:id/` | DELETE | Update loan proposition |
| 22  | ✅ | `/lenders/:l_id/requests/` | GET | Get all pending requests (not accepted) |
| 23  | ✅ | `/lenders/:l_id/requests/:id/` | GET | Get a single loan request |
| 24  | ✅ | `/lenders/:l_id/requests/:id/` | POST | Create a new Proposition |

> You check the endpoints [here](https://m-cubed-backend.onrender.com/docs)
