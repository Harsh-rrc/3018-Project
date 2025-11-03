## COMP-3018 – Pre-Milestone Project Planning

Name: Harsh Pandya
Course: Back-End Development
Date: November 3, 2025 

## 1. Project Concept

Project Title: Financial Loan Management API

For my project, I plan to build a back-end system that helps a financial company manage client loans. Staff will be able to add, update, delete, and view loan and client details. The system will also check which loans are high-risk based on the amount or certain limits.

The goal is to make loan management easier and more secure while reducing human mistakes. It will also include login protection so only authorized users can access or change information.

This project connects well with the course because it uses Node.js, Express, TypeScript, Firebase Auth, and Firestore — all tools we’ve learned in class.

## 2. Scope and Functionality
Main Resources

# User: login info and role (admin, manager, staff)
# Client: name, contact info, and details
# Loan: amount, date, and risk status 

# Example Endpoints
Resource	Endpoint	Method	Description
Loan	/loans	GET	Get all loans
Loan	/loans	POST	Add a new loan
Loan	/loans/:id	PUT	Update loan details
Loan	/loans/:id	DELETE	Delete a loan (admin only)
Client	/clients	GET	Get all clients
Client	/clients	POST	Add a new client

# Planned Features

-  CRUD functions for clients and loans 
-  Authentication and role-based access 
-  Firestore database for storing data
-  High-risk loan detection 
-  Central error handling 
-  Jest testing 
-  Swagger API documentation

## 3. Course Content Alignment

Course Topic	Project Use

- Node.js + Express	- Used to build all API routes
- TypeScript - Helps write clean and safe code
- Firestore	Stores -  client and loan data
- Firebase Auth	- Handles user login and roles
- Jest - For testing routes and logic
- Swagger - For documenting the API
- Error Middleware - Handles system and user errors
  
## 4. GitHub Project Setup

- Repository: 3018-Project
- Branches: main, development, feature/*
- Project Board: Columns for Backlog, In Progress, Review, and Done
- Each task will have a GitHub issue with a checklist
- Pull requests will merge feature branches into 'development'



## Summary

- This project will create a secure and organized back-end system for managing client loans. It will include authentication, role control, and full CRUD features. The plan follows course requirements and is ready to move into Milestone 1.

## Submitted by: Harsh Pandya
## Date: November 3, 2025