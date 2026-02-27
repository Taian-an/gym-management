# FitFlow - Gym Management System

A full-stack gym management application built with **Next.js 15**, **TypeScript**, and **MongoDB**. This project features complex relational data handling, real-time capacity tracking, and deep data population.

## 👤 Developer
- **Name:** Taian Chen (Taian-an)
- **Student ID:** 6630027
- **Major:** Computer Science

## 🚀 Features

### 📊 Dashboard
- Real-time statistics for total coaches, members, and active courses.
- Quick action shortcuts and recent course activity list.

### 🏋️ Coach & Member Management
- Full CRUD (Create, Read, Delete) operations for coaches and members.
- Expertise tracking for coaches and contact management for members.

### 📅 Course Management
- Dynamic course creation with coach assignment (One-to-Many relationship).
- Integrated **Capacity Tracking** that calculates real-time occupancy (e.g., 5/10 slots filled).

### 📝 Enrollment System
- Secure enrollment logic with duplicate registration prevention.
- **Deep Data Population**: Displays student, course, and assigned teacher names in a single view.
- Automated "Full" status detection to disable enrollment for maxed-out courses.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict Type Safety)
- **Database:** MongoDB Atlas
- **ORM:** Mongoose
- **Styling:** Tailwind CSS

## 📂 Project Structure

- `/app/api`: RESTful API routes handling MongoDB operations.
- `/app/components`: Reusable UI components like the Global Navbar.
- `/src/models`: Mongoose schemas for Members, Coaches, Courses, and Enrollments.
- `/src/lib`: Database connection configuration.

## ⚙️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Taian-an/gym-management.git](https://github.com/Taian-an/gym-management.git)