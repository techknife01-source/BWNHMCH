# Smart Homeopathic Medical College Digital Ecosystem 🏥🎓

An enterprise-grade, production-ready, clean-architecture digital ecosystem engineered for **Homeopathic Medical Colleges & Hospitals**.

Built for **Burdwan Homoeopathic Medical College & Hospital (Estd. 1958)** & AYUSH medical institutions across India.

---

## 🏛️ Architecture Overview

The system follows **Enterprise Clean Architecture** split into decoupled Frontend and Backend services:

```
homeopathic-medical-college/
├── frontend/                     # React 19 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/          # Reusable UI & Domain Modules (IPD, Library, CMS, OPD, Pharmacy, Lab)
│   │   ├── pages/               # Views (Home, Dashboards, AuthPages, Public pages)
│   │   ├── types.ts             # Domain TypeScript Types & Role Matrices
│   │   ├── data/                # Mock Data & Seeds
│   │   ├── services/            # API Clients
│   │   └── utils/               # Formatting & Helper Utilities
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json              # Vercel Deployment Config
│
├── backend/                      # Spring Boot 3.4.x + Java 21 + MongoDB Atlas
│   ├── src/main/java/com/homeopathy/college/
│   │   ├── config/              # OpenApi, Security, Mongo, Cors Configs
│   │   ├── common/              # ApiResponse & GlobalExceptionHandler
│   │   ├── controller/          # REST Controllers
│   │   ├── dto/                 # Request/Response DTOs
│   │   ├── entity/              # MongoDB Document Models
│   │   ├── repository/          # MongoRepositories
│   │   └── service/             # Business Logic & Security Services
│   ├── src/main/resources/
│   │   └── application.yml      # System Environment Properties
│   ├── pom.xml                  # Maven Dependency Specification
│   └── Dockerfile               # Multi-stage Docker Container
│
├── vercel.json                  # Frontend Deployment Manifest
├── render.yaml                  # Backend Render Deployment Blueprint
└── Dockerfile                   # Frontend Nginx Container
```

---

## 🔐 Roles & Permission Matrix

The application supports **15 Enterprise Roles** with granular access rules:

| Role Identifier | Title | Access Scope |
| :--- | :--- | :--- |
| `super_admin` | Super Administrator | Full System & Database Access |
| `principal` | Principal & Administrator | Principal Desk CMS, ERP Analytics, Academic Approvals |
| `vice_principal` | Vice Principal | Academic Control & Faculty Coordination |
| `office_admin` | Office Administration | Student Registry, CMS Website Editor, Fee Management |
| `hospital_superintendent` | Hospital Superintendent | Full IPD Bed Map, OPD Patient Registries, Clinical Rosters |
| `hod` | Head of Department | Departmental Research, Clinical Postings & Rosters |
| `faculty` | Medical Professor / Lecturer | Student Attendance, Clinical Postings, Patient Care |
| `librarian` | Chief Librarian | E-Library DRM Management & Book Publishing |
| `pharmacist` | Hospital Pharmacist | Pharmacy Stock Dispensary, Reorder Alerts, Batch Entry |
| `lab_technician` | Clinical Lab Technician | Diagnostic Lab Booking, Sample Tracking, Result Uploads |
| `accountant` | Accounts Officer | Student Fee Collection & Financial Analytics |
| `reception` | Front Desk / Receptionist | OPD Patient OPD Ticket Generation & Enquiry Desk |
| `admission_cell` | Admission Officer | BHMS & MD Admission Workflow Management |
| `student` | BHMS / MD Student | Attendance Tracker, Digital E-Library Reader, Clinical Duty Chart |
| `patient` | Inpatient / Outpatient | Personal Medical History, Discharge Summary, OPD Schedule |
| `guest` | Visitor / Prospective | Public Information Portal, Principal Message, Course Prospectus |

---

## 🚀 Tech Stack

### Frontend
- **React 19** with **TypeScript 5.8**
- **Vite 6** Fast Bundler
- **Tailwind CSS v4** styling with custom AYUSH Medical Palette
- **Lucide React** medical icon kit
- **Motion / Framer Motion** smooth UI transitions

### Backend
- **Spring Boot 3.4.2** & **Java 21**
- **Spring Security** with JWT & Refresh Tokens
- **Spring Data MongoDB** with MongoDB Atlas
- **SpringDoc OpenAPI 3** / Swagger UI
- **Cloudinary SDK** for secure document & photo uploads
- **Java Mail** for OTP and notification dispatching

---

## 🛠️ Deployment Instructions

### 1. Deploy Frontend to Vercel
```bash
git push origin main
# Vercel automatically detects vercel.json and builds dist/ via Vite
```

### 2. Deploy Backend to Render
```bash
# Render connects to render.yaml and builds the Maven Spring Boot Docker container
```

### 3. Local Development
```bash
# Frontend
npm run dev

# Backend
cd backend
mvn spring-boot:run
```

---

## 📝 Compliance & Standards

- **AYUSH & NCH Accreditation Ready**: Built to meet National Commission for Homoeopathy standards.
- **DRM E-Library Reader**: Prevents unauthorized downloading of copyrighted classical treatises for students.
- **WBUHS Affiliation Standards**: Built for West Bengal University of Health Sciences guidelines.
