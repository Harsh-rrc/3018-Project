# New Component Plan

## Component name
Nodemailer — Email notification service

## Purpose
Send email notifications for key events in the Financial Loan Management API:
- When a new client is created (send welcome/confirmation email).
- When a loan status changes to `approved` or `rejected` (notify client and staff).

## Why chosen
- Practical, adds real-world behavior.
- Easy to implement and test for Milestone 1.
- Minimal risk if implemented with a safe fallback (no credentials required in repo).

## Implementation plan (detailed)
1. Install package:
# New Component Plan

## Component name
Nodemailer — Email notification service

## Purpose
Send email notifications for key events in the Financial Loan Management API:
- When a new client is created (send welcome/confirmation email).
- When a loan status changes to `approved` or `rejected` (notify client and staff).

## Why chosen
- Practical, adds real-world behavior.
- Easy to implement and test for Milestone 1.
- Minimal risk if implemented with a safe fallback (no credentials required in repo).

## Implementation plan (detailed)
1. Install package:
# New Component Plan

## Component name
Nodemailer — Email notification service

## Purpose
Send email notifications for key events in the Financial Loan Management API:
- When a new client is created (send welcome/confirmation email).
- When a loan status changes to `approved` or `rejected` (notify client and staff).

## Why chosen
- Practical, adds real-world behavior.
- Easy to implement and test for Milestone 1.
- Minimal risk if implemented with a safe fallback (no credentials required in repo).

## Implementation plan (detailed)
1. Install package:

2. Add environment variables (see `.env.example`):
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASS`

3. Add a simple utility: `src/utils/emailService.ts`.
- If credentials are missing, log the intent and do not throw.
- Always swallow internal errors so email failures do not break API flows.

4. Integrate:
- After creating a client in `clientController.createClient`, call `sendEmail(newClient.email, 'Welcome', ...)`.
- After updating a loan in `loanController.updateLoan`, if `status` is `approved` or `rejected`, call `sendEmail(clientEmail, ...)`. (I will log recipient as staff if client email is not known.)

5. Tests:
- Add `tests/emailIntegration.test.ts` that mocks `sendEmail` and asserts it is called on create/update flows.

6. Documentation:
- Add a short note in README and a swagger comment mentioning that create-client triggers email (if configured).

## Risk & Mitigation
- **Risk:** Accidentally committing credentials.  
**Mitigation:** Use `.env` and `.env.example`; do not commit real credentials.
- **Risk:** Email sending failure causing errors.  
**Mitigation:** `sendEmail` will catch and log errors and not throw.

## Demo plan
- Run server locally.
- Use Postman to `POST /api/clients` and check server logs for "Email credentials not set — skipping real send..." message (safe fallback).
- Run tests to confirm `sendEmail` is called (mocked).

## Files to add
- `src/utils/emailService.ts`
- `tests/emailIntegration.test.ts`
- Update `src/controllers/clientController.ts` and `src/controllers/loanController.ts`