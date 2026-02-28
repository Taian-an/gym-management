# FitFlow - Advanced Gym Management System

A robust, full-stack gym management platform built with **Next.js 15 (App Router)**, **TypeScript**, and **MongoDB**. This project demonstrates advanced database relationships, real-time data integrity, and a professional user interface.

## 👤 Developer Information
- **Name:** Taian Chen (Taian-an)
- **Student ID:** 6630027
- **Major:** Computer Science
- **GitHub:** [Taian-an](https://github.com/Taian-an)

## 🚀 Key Features

### 📅 Advanced Course Scheduling
- **Standardized Categories:** Supports 15+ fitness categories including Hyrox, CrossFit, and TRX.
- **Native DatePicker:** Integrated `datetime-local` for precision scheduling and ISO-standard time storage.
- **Capacity Control:** Automated tracking of enrolled students vs. maximum capacity (e.g., 8/10 slots).

### 🏋️ Professional Coach Management
- **Multi-Expertise Selection:** Coaches can be assigned multiple specialties using an intuitive checkbox interface.
- **Relational Integrity:** One-to-Many relationship between Coaches and Courses.

### 📝 Enrollment & Membership
- **Deep Data Population:** Enrollment view fetches data across Member, Course, and Coach collections simultaneously.
- **Conflict Prevention:** Full-capacity courses are automatically disabled in the enrollment selection.
- **Full CRUD Support:** Complete Create, Read, Update, and Delete capabilities for all modules.

### 📊 Real-time Dashboard
- Live statistics counting total members, coaches, and active courses.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Type Safety)
- **Database:** MongoDB Atlas
- **ORM:** Mongoose
- **Styling:** Tailwind CSS

## 📂 System Architecture



## ⚙️ Quick Start

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Taian-an/gym-management.git](https://github.com/Taian-an/gym-management.git)