# Agricultural Marketplace Platform

A full-stack agricultural marketplace built on the **MERN stack** (MongoDB, Express, React, Node.js).  
The platform enables **direct digital commerce between farmers and buyers**, supported by secure authentication, role-based workflows, and an admin-controlled product approval system.

---

## Overview

This application provides a streamlined marketplace experience for agricultural trade, focusing on:

- Secure multi-role access
- Efficient product and order management
- A responsive, modern user interface
- Scalable backend architecture

---

## Core Features

### Access & Security
- Role-Based Access Control (RBAC) for **Farmers**, **Buyers**, and **Admins**
- JWT authentication with **access and refresh tokens**
- Secure password hashing using **bcrypt**

### Product & Order Management
- Farmers can create, update, and manage seasonal products
- Admin approval workflow before products are publicly visible
- Product search and category-based filtering
- Cart functionality and end-to-end order processing
- Order status tracking for buyers

### User Experience
- Responsive UI built with **vanilla CSS**
- Optimized for desktop, tablet, and mobile devices
- Clean and intuitive navigation

---

## Technology Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT)
- Bcrypt.js
- Multer (file uploads)
- Cookie-parser (session handling)

---

## Project Structure
Farmer market place ver1/
│
├── Backend/ # Server-side application
│ ├── src/
│ │ ├── models/ # Database schemas
│ │ ├── controllers/ # Business logic
│ │ ├── routes/ # API endpoints
│ │ └── middleware/ # Auth & validation middleware
│ │
│ ├── .env # Backend environment variables
│ ├── seed.js # Database seeding script
│ └── package.json
│
├── Frontend/ # Client-side application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Application pages
│ │ ├── services/ # API service handlers
│ │ └── assets/ # Static files
│ │
│ ├── index.html # Application entry point
│ ├── .env # Frontend environment variables
│ └── package.json
│
└── README.md # Project documentation




