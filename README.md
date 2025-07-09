# Resume Analyzer (LLM + Redis + BullMQ + MongoDB)

A production-grade backend system for AI-powered resume analysis with LLM scoring, Redis caching, background job queues, and secure API endpoints.

## 🚀 Features

- ✅ Resume Upload & Parsing (PDF → Text)
- 🤖 LLM-based Resume Scoring (Gemini)
- 🧵 BullMQ + Redis Queue for async processing
- 🗃 MongoDB for resume feedback storage
- 🔐 JWT Auth + Rate Limiting
- 📦 Postman API Documentation
- 
## 🧠 System Architecture

![Resume Analyzer Architecture](/server/assets/architecture.svg)

## 🧪 API Documentation

[📘 Postman Public Docs](https://documenter.getpostman.com/view/34835270/2sB34eK37G)

## 📦 Setup
```bash
git clone https://github.com/yourname/resume-analyzer.git
cd resume-analyzer
npm install
```

Create a .env file
```bash
GEMINI_KEY="your_gemini_api_key"
PORT=3001
MONGODB_URI="mongodb_uri"
JWT_SECRET="your-jwt_secret"
```
