# Recruitment Tool

A full-stack recruitment platform built with **PHP/Symfony** and **React**, deployed on AWS. Recruiters can post job offers and review AI-scored candidates, while candidates can create profiles, upload CVs, and apply for positions.

🌐 **Live demo:** [www.recruitment-tool.pl](https://www.recruitment-tool.pl)

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Recruiter | recruiter@gmail.com | recruiter123 |
| Candidate | candidate@gmail.com | candidate123 |

---

## Features

**For Recruiters**
- Create and manage job offers with must-have / nice-to-have requirements
- View applicants on a Kanban board sorted by AI score
- AI-powered candidate scoring: `strong_match`, `partial_match`, `no_match`
- Full-text candidate search powered by Elasticsearch

**For Candidates**
- Register and create a profile
- Upload a CV — parsed automatically by Claude AI
- Browse and apply for job offers
- Track application status

---

## Tech Stack

### Backend
- **PHP 8.4** + **Symfony 8**
- **PostgreSQL 16** via Doctrine ORM
- **Elasticsearch 8** for candidate search
- **Symfony Messenger** for async job processing
- **Claude API** (claude-sonnet-4-6) for CV parsing and candidate scoring
- **JWT Authentication** via lexik/jwt-authentication-bundle
- **Flysystem** for CV storage (local / AWS S3)

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS v4** + **shadcn/ui**
- **React Query** for server state
- **React Router DOM**
- **Axios**
- Design inspired by Linear.app + Vercel dashboard

### Infrastructure (AWS)
- **ECS Fargate** — containerized backend (nginx + PHP-FPM + Elasticsearch)
- **RDS PostgreSQL** — managed database
- **S3** — CV storage + static frontend hosting
- **CloudFront** — CDN for frontend
- **ALB** — Application Load Balancer for stable backend URL
- **ECR** — Docker image registry
- **EventBridge Scheduler** — auto stop/start ECS (00:00–07:00 Europe/Warsaw)

### DevOps
- **Terraform** — infrastructure as code
- **GitHub Actions** — CI/CD pipeline
- **Docker** + **Docker Compose** for local development
