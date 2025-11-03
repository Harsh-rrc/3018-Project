# COMP-3018 – Pre-Milestone Project Planning

**Name:** Harsh Pandya  
**Course:** Back-End Development  
**Date:** November 3, 2025  

---

## 1. Project Concept

**Project Title:** High-Risk Loan Management API  

This project is about building an API for a financial company to manage client loans. Staff can add, update, view, or delete loan and client records. The system will also check which loans are high-risk based on the amount or other limits.  
The goal is to make it easier to handle client loans, reduce manual errors, and protect data with authentication.  

This project fits the course because it uses Node.js, Express, TypeScript, Firestore, and Firebase Auth to build a secure backend system.

---

## 2. Scope and Functionality

### Main Resources
- **User:** login info and roles (admin, manager, officer)  
- **Client:** personal and contact details  
- **Loan:** loan amount, date, and risk level  

### Example Endpoints
| Resource | Endpoint | Method | Description |
|-----------|-----------|---------|--------------|
| Loan | `/loans` | GET | Get all loans |
| Loan | `/loans` | POST | Add a loan |
| Loan | `/loans/:id` | PUT | Update a loan |
| Loan | `/loans/:id` | DELETE | Delete a loan (admin only) |
| Client | `/clients` | GET | Get all clients |
| Client | `/clients` | POST | Add a client |

### Features
- CRUD operations for users, clients, and loans  
- Authentication and role-based access  
- Firestore database  
- High-risk loan detection  
- Jest tests  
- Swagger documentation  
- Error handling middleware  

---

## 3. Course Content Alignment

| Course Topic | How It’s Used |
|---------------|---------------|
| Node.js + Express | For API routes |
| TypeScript | For clean and safe code |
| Firestore | For storing data |
| Firebase Auth | For user login |
| Jest | For testing |
| Swagger | For documentation |
| Error Middleware | Custom feature for handling errors |

---

## 4. GitHub Project Setup

- Repo Name: `3018-Assignment-04-High-Risk-Loan`  
- Branches: `main`, `development`, `feature/*`  
- Project Board: Backlog, In Progress, Review, Done  
- Each issue includes a short task and checklist  
- Use pull requests from feature branches into development  

---

###  Summary
This API will help manage loans and clients safely. It will include CRUD features, authentication, and testing. The plan follows the COMP-3018 project setup rules and is ready for development.

---

**Submitted by:** Harsh Pandya  
**Date:** November 3, 2025