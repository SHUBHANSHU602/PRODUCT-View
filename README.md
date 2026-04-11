# 🚀 AI Resume Analyzer & Mock Interview Platform

A production-grade, full-stack AI-powered SaaS platform that helps students and professionals prepare for job applications and technical interviews. Built with Node.js, MongoDB, Groq AI (LLaMA 3.3 70B), and React.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Freemium Model](#freemium-model)
- [AI Integration](#ai-integration)
- [Frontend Pages](#frontend-pages)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Overview

Most students lose job opportunities not because they are unqualified — but because their resume never passes the ATS (Applicant Tracking System) filter, or they walk into interviews underprepared.

This platform solves both problems:

1. **Resume Analyzer** — Upload your resume and a job description. The AI returns an ATS compatibility score, missing keywords, section-wise feedback, and actionable improvement suggestions.
2. **Mock Interview Agent** — The AI generates role-specific interview questions, evaluates your answers in real-time (text or voice), and gives detailed feedback with scores out of 10 and ideal answer descriptions.

---

## 🌐 Live Demo

> Coming soon — deployment in progress (Railway + Vercel)

---

## ✨ Features

### Core Features
- 📄 **AI Resume Analysis** — ATS scoring, keyword gap analysis, section-wise feedback, improvement suggestions
- 🎤 **AI Mock Interview** — Role-specific question generation, real-time answer evaluation, STAR framework scoring
- 🗣️ **Voice Interview Mode** — Web Speech API integration for voice-based answers with live transcript
- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing and 7-day token expiry
- 📊 **User Dashboard** — Complete history, average scores, progress tracking across sessions
- 💾 **Persistent Storage** — All analyses and interview sessions saved to MongoDB per user
- 💰 **Freemium Model** — Free tier with usage limits, premium upgrade endpoint ready for payment integration

### Security Features
- Password hashing with bcryptjs (12 salt rounds)
- JWT token authentication on all protected routes
- User-scoped data access (users can only access their own data)
- Environment-based configuration with dotenv
- Global error handling middleware

### AI Features
- Powered by **LLaMA 3.3 70B** via Groq API (fastest inference available)
- Structured JSON responses with strict prompt engineering
- ATS score from 0-100 based on keyword matching and content quality
- Per-answer evaluation with score, feedback, and ideal answer
- Company-agnostic question generation based on job description

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js v18+ |
| **Backend Framework** | Express.js |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **AI Model** | Groq API — LLaMA 3.3 70B Versatile |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **File Upload** | Multer (memory storage) |
| **PDF Parsing** | pdf-parse |
| **Frontend** | React 18 + Vite |
| **HTTP Client** | Axios |
| **Routing** | React Router DOM v6 |
| **Voice Input** | Web Speech API (browser native) |
| **Dev Tools** | Nodemon, dotenv |
| **Deployment** | Railway (backend) + Vercel (frontend) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React)                        │
│  Login │ Register │ Dashboard │ Resume │ Interview       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP (Axios + JWT)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 EXPRESS.JS BACKEND                       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Routes  │→ │Controllers│→ │ Services │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                    │                    │
│              ┌─────────────────────┤                   │
│              ▼                     ▼                    │
│        ┌──────────┐         ┌──────────┐               │
│        │ MongoDB  │         │ Groq API │               │
│        │  Atlas   │         │ LLaMA 3.3│               │
│        └──────────┘         └──────────┘               │
└─────────────────────────────────────────────────────────┘

Middleware Pipeline:
Request → CORS → JSON Parser → Auth (JWT) → Freemium Check → Controller → Response
```

---

## 📁 Project Structure

```
ai-resume-interview-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js           ← Environment config (port, keys)
│   │   │   ├── db.js              ← MongoDB connection
│   │   │   └── plans.js           ← Freemium plan limits
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js      ← Register, Login, Upgrade
│   │   │   ├── resumeController.js    ← PDF upload + AI analysis
│   │   │   ├── interviewController.js ← Start, Answer, Results
│   │   │   └── dashboardController.js ← User stats + history
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      ← JWT verification
│   │   │   ├── errorHandler.js        ← Global error handler
│   │   │   ├── upload.js              ← Multer PDF config
│   │   │   └── freemiumMiddleware.js  ← Plan limit checks
│   │   │
│   │   ├── models/
│   │   │   ├── User.js            ← User schema + bcrypt hooks
│   │   │   ├── ResumeAnalysis.js  ← Resume results schema
│   │   │   └── Interview.js       ← Interview session schema
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── resumeRoutes.js
│   │   │   ├── interviewRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   └── healthRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── aiService.js           ← Groq resume analysis
│   │   │   ├── authService.js         ← JWT + user logic
│   │   │   └── interviewService.js    ← Groq interview Q&A
│   │   │
│   │   └── index.js               ← Express app entry point
│   │
│   ├── .env                       ← Environment variables (git ignored)
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   └── Interview.jsx      ← Includes voice mode
│   │   │
│   │   ├── services/
│   │   │   └── api.js             ← Axios instance + all API calls
│   │   │
│   │   ├── App.jsx                ← React Router + Private Routes
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (free tier works)
- Groq API key (free at console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-resume-interview-platform.git
cd ai-resume-interview-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see Environment Variables section below).

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4. Verify Setup

Hit the health check endpoint:

```bash
curl http://localhost:5000/api/health
# Expected: { "status": "server is running" }
```

---

## 🔐 Environment Variables

Create `backend/.env` with the following:

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/resumeai

# Authentication
JWT_SECRET=your_very_long_random_secret_key_here_minimum_32_characters

# AI
GROQ_API_KEY=your_groq_api_key_here

# Environment
NODE_ENV=development
```

> ⚠️ Never commit `.env` to version control. It is already added to `.gitignore`.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Shubhanshu Singh",
  "email": "shubhanshu@gmail.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Shubhanshu Singh",
    "email": "shubhanshu@gmail.com",
    "plan": "free"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "shubhanshu@gmail.com",
  "password": "securepassword"
}
```

#### Upgrade to Premium
```http
POST /auth/upgrade
Authorization: Bearer <token>
```

---

### Resume Routes

#### Upload & Analyze Resume
```http
POST /resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <PDF file>
jobDescription: "We need a Node.js backend developer with REST API and MongoDB experience"
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "atsScore": 80,
    "missingKeywords": ["Docker", "Redis", "CI/CD"],
    "sectionFeedback": {
      "education": "Relevant CS degree, add specific coursework",
      "experience": "No direct work experience, projects compensate well",
      "skills": "Good coverage, add cloud technologies",
      "projects": "Strong projects, quantify impact with metrics"
    },
    "improvements": [
      "Add Docker to skills section",
      "Quantify project impact with numbers",
      "Include REST API design experience explicitly"
    ]
  }
}
```

---

### Interview Routes

#### Start Interview Session
```http
POST /interview/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobRole": "Backend Developer",
  "jobDescription": "Node.js backend developer with REST API and MongoDB experience"
}
```

**Response:**
```json
{
  "success": true,
  "interviewId": "69d3f678...",
  "questions": [
    "Explain the event loop in Node.js",
    "How do you design a scalable REST API?",
    "What is middleware in Express.js?",
    "Tell me about a challenging project you built",
    "How do you handle async operations in Node.js?"
  ]
}
```

#### Submit Answer
```http
POST /interview/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "interviewId": "69d3f678...",
  "questionIndex": 0,
  "userAnswer": "The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations..."
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "score": 8,
    "feedback": "Strong answer covering the core concepts. Could improve by mentioning the call stack, callback queue, and microtask queue in more detail.",
    "idealAnswer": "A complete answer covers the call stack, Web APIs, callback queue, microtask queue, and how they interact."
  },
  "status": "in_progress",
  "answeredCount": 1,
  "totalQuestions": 5
}
```

#### Get Interview Results
```http
GET /interview/results/:interviewId
Authorization: Bearer <token>
```

---

### Dashboard Route

#### Get User Dashboard
```http
GET /dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "user": {
      "name": "Shubhanshu Singh",
      "email": "shubhanshu@gmail.com",
      "plan": "free",
      "resumeAnalysisCount": 2,
      "interviewSessionCount": 1
    },
    "stats": {
      "totalResumeAnalyses": 2,
      "totalInterviews": 1,
      "completedInterviews": 1,
      "avgAtsScore": 80,
      "avgInterviewScore": 7
    },
    "recentResumeAnalyses": [...],
    "recentInterviews": [...]
  }
}
```

---

### Health Check

```http
GET /health
```

---

## 💰 Freemium Model

| Feature | Free Plan | Premium Plan |
|---|---|---|
| Resume Analyses | 3 per account | Unlimited |
| Mock Interviews | 3 per account | Unlimited |
| Voice Interview | ✅ | ✅ |
| Dashboard & History | ✅ | ✅ |
| Company-specific prep | ❌ | ✅ (coming soon) |
| Priority AI responses | ❌ | ✅ (coming soon) |
| Price | Free | ₹299/month (coming soon) |

When a free user exceeds their limit, the API returns:

```json
{
  "success": false,
  "message": "You have reached your free plan limit of 3 resume analyses. Please upgrade to premium.",
  "upgradeRequired": true
}
```

---

## 🤖 AI Integration

### Resume Analysis Prompt Strategy

The AI is given both the resume text and job description, then instructed to return a strict JSON structure with:

- **ATS Score (0-100)** — Based on keyword density, section completeness, and relevance to job description
- **Missing Keywords** — Technologies and skills present in JD but absent in resume
- **Section Feedback** — Specific feedback per section (Education, Experience, Skills, Projects)
- **Improvements** — Top 3 actionable suggestions

### Interview Evaluation Framework

Answers are evaluated on:

- **Technical accuracy** — Is the answer factually correct?
- **Depth of explanation** — Does the candidate explain the "why" not just the "what"?
- **Communication clarity** — Is the answer structured and easy to follow?
- **Real-world application** — Does the candidate connect concepts to practical scenarios?

Each answer receives:
- Score (0-10)
- Detailed feedback paragraph
- Description of an ideal answer

### Model Choice — LLaMA 3.3 70B via Groq

Groq provides the fastest LLM inference available (up to 500 tokens/second). LLaMA 3.3 70B offers GPT-4 level quality for technical evaluation tasks, making it ideal for real-time interview feedback.

---

## 🖥️ Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | User Dashboard | Protected |
| `/resume` | Resume Analyzer | Protected |
| `/interview` | Mock Interview | Protected |

### Voice Interview Mode

The interview page supports two input modes:

- **Text Mode** — Type answers in a textarea
- **Voice Mode** — Speak answers using the browser's Web Speech API

Voice mode features:
- Animated microphone with recording indicator
- Live transcript appears as you speak
- Editable transcript before submission
- Works best on Chrome browser

---

## 🗺️ Roadmap

### Completed ✅
- [x] Express.js server with modular structure
- [x] Resume upload and PDF text extraction
- [x] AI resume analysis with Groq
- [x] JWT user authentication
- [x] MongoDB data persistence
- [x] AI mock interview system
- [x] User dashboard API
- [x] Freemium usage limits
- [x] React frontend with all core pages
- [x] Voice interview mode

### In Progress 🔄
- [ ] Razorpay payment integration
- [ ] Deployment — Railway (backend) + Vercel (frontend)
- [ ] Modern UI overhaul with Tailwind CSS + Framer Motion

### Planned 📋
- [ ] Company-specific prep packs (Google, Microsoft, Amazon)
- [ ] STAR framework evaluation for behavioral questions
- [ ] LinkedIn profile analyzer
- [ ] Peer mock interview matching
- [ ] Email notifications and weekly progress reports
- [ ] Admin dashboard for analytics
- [ ] Mobile responsive design

---

## 🧪 Testing the API

Import this collection into Postman:

1. **Health Check** — `GET /api/health`
2. **Register** — `POST /api/auth/register` with JSON body
3. **Login** — `POST /api/auth/login` — copy the token
4. **Analyze Resume** — `POST /api/resume/upload` with Bearer token + form-data
5. **Start Interview** — `POST /api/interview/start` with Bearer token + JSON body
6. **Submit Answer** — `POST /api/interview/answer` with interviewId from step 5
7. **Dashboard** — `GET /api/dashboard` with Bearer token

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo
git fork https://github.com/yourusername/ai-resume-interview-platform

# Create a feature branch
git checkout -b feat/your-feature-name

# Make changes and commit
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feat/your-feature-name
```

### Commit Convention

This project follows conventional commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
refactor: code refactoring without feature change
style: formatting changes
test: add or update tests
```

---

## 📄 License

MIT License — feel free to use this project for learning, portfolio, or building on top of it.

---

## 👨‍💻 Author

**Shubhanshu Singh**
- CS Student | Backend Developer | AI Enthusiast
- Building toward a Microsoft Software Engineering Internship
- GitHub: [@shubhanshu](https://github.com/shubhanshu)
- Email: shubhanshusingh602@gmail.com

---

## ⭐ If this project helped you

Give it a star on GitHub — it helps others find it and motivates continued development!

---


