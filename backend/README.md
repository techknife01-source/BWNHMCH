# BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL Backend Microservice

Clean-architecture Spring Boot 3.4.x / Java 21 REST API foundation for **BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL Digital Ecosystem**.

## 🚀 Key Modules Built

- **Spring Security & Stateless JWT**: Bearer Token Authentication + Refresh Tokens with Token Revocation
- **MongoDB Atlas Integration**: Spring Data Mongo with Audit Listener (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `version`)
- **Global Error Handling**: Standardized `ApiResponse<T>` wrapper and `GlobalExceptionHandler`
- **Cloudinary CDN Service**: Direct file & document upload/delete handler
- **Java Mail & Async Service**: OTP code dispatching & welcome transactional emails
- **OpenAPI 3 / Swagger Documentation**: Auto-generated interactive API docs at `/api/v1/swagger-ui.html`

## 🛠️ Environment Variables

Copy `.env.example` to `.env` or configure variables in render/Docker:

```env
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/homeopathy_erp
JWT_SECRET=9a4f2c8d1e6b3a7f0e9c8b7a6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c
CLOUDINARY_CLOUD_NAME=bhmch-cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=noreply@bwnhmch.com
SMTP_PASSWORD=secret_password
```

## 🐳 Running with Docker Compose

```bash
docker-compose up --build
```
