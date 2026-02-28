# FitFlow - Advanced Gym Management System (Cloud Edition)

A professional, full-stack gym management platform deployed on **Microsoft Azure**, utilizing **Next.js 15**, **TypeScript**, and **MongoDB Atlas**. This project showcases modern cloud infrastructure and automated service management.

## 👤 Developer Information
- **Name:** Taian Chen (Taian-an)
- **Student ID:** 6630027
- **Major:** Computer Science

## ☁️ Cloud Infrastructure & Deployment
This project has been successfully migrated from local development to a production-ready cloud environment:

- **Host:** Microsoft Azure Virtual Machine (Ubuntu 22.04 LTS).
- **Reverse Proxy:** Nginx configured for Port 80 to Port 3000 forwarding.
- **Process Manager:** PM2 (with systemd integration) for 24/7 service uptime and auto-restart on reboot.
- **Database:** MongoDB Atlas with IP Whitelisting for secure Azure VM access.
- **Networking:** Static Public IP assigned with specialized Inbound Security Rules (Port 80/22).

## 🚀 System Features

### 📅 Smart Scheduling & Enrollment
- **Standardized Categories:** 15+ fitness types (CrossFit, Hyrox, Yoga, etc.).
- **Native DatePicker:** Precise ISO-standard scheduling.
- **Capacity Management:** Real-time tracking of student-to-coach ratios.
- **Enrollment CRUD:** Full management of member-course relationships with delete capabilities.

### 🏋️ Coach & Member Management
- **Multi-Expertise Selection:** Coaches can be assigned multiple skillsets.
- **Relational Integrity:** One-to-many relationship mapping between Coaches and Courses.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Azure VM, Nginx, PM2, GitHub

## 📂 Deployment Guide (VM Quick Start)

1. **Access Server:** `ssh -i your_key.pem azureuser@your_static_ip`
2. **Environment:** Ensure `.env` contains `MONGODB_URI`.
3. **Build:** `npm run build`
4. **Service Start:** `pm2 start npm --name "fitflow" -- start`
5. **Auto-Start:** `pm2 save`