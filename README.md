# Loan Service API

## Overview
This project implements a backend Loan Service API with features including client management, loan management, secure authentication and authorization, advanced filtering and sorting, email integration, and comprehensive API documentation.

## Features
- Client CRUD operations with validation
- Loan CRUD operations with risk assessment
- Secure JWT-based authentication and role-based authorization (admin, manager, user)
- Advanced loan filtering and sorting on multiple fields
- Email notifications on client creation and loan status changes
- API documentation using OpenAPI (Swagger)
- In-memory repository with test isolation
- Jest-based tests with coverage
- Dynamic Ethereal Email Integration for testing environment

## Setup and Running
1. Install dependencies:
   ```
   npm install
   ```

2. Set environment variables in `.env` file (or your environment):
   ```
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_SERVICE=gmail
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

   **Note**: For automated Ethereal Email testing integration, set:
   ```
   EMAIL_SERVICE=ethereal
   ```
   and do **not** set EMAIL_USER or EMAIL_PASS. The system will generate a test Ethereal account dynamically.

3. Run tests with coverage:
   ```
   npm test
   ```

4. Start the server locally:
   ```
   npm start
   ```

## API Documentation
Access Swagger UI for API documentation and testing at:
```
http://localhost:PORT/api-docs
```
(Note: Replace PORT with your server port)

## Advanced Features
- Loan filtering by status and risk status
- Sorting loans by amount, interest rate, duration, status, creation date
- Role-based access control: admin and manager roles for modifying data
- Comprehensive validation for inputs

## Testing Notes
- Tests reset in-memory repositories for isolation
- Email sending is mocked during tests
- Console logs suppressed in test environment for clean output
- Dynamic Ethereal email accounts used automatically for testing when EMAIL_SERVICE=ethereal

## Contribution
Follow GitHub workflow best practices for managing branches and pull requests.

---

For any issues or contributions, please open an issue or submit a pull request.
