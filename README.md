# Ruwād Innovation Platform - Refactoring Project

## 🔄 Active Development - Platform Refactoring

[![Status](https://img.shields.io/badge/Status-Refactoring%20in%20Progress-orange)](./docs/README.md)
[![Phase](https://img.shields.io/badge/Current%20Phase-Foundation%20&%20Routing-blue)](./docs/01-Getting-Started/)

**Comprehensive refactoring and expansion of the Ruwād Innovation Management System for enhanced scalability, subscription support, and AI integration.**

## 🎯 Project Overview

This is an **8-9 week refactoring project** to transform the existing Ruwād platform into a modern, scalable system supporting:
- Public/authenticated route separation
- Subscription-based monetization
- AI-enhanced workflows
- Enhanced media management
- Advanced analytics dashboard

## 📋 Current Architecture

**Tech Stack:** React + TypeScript (Vite), TailwindCSS, Supabase (Postgres + Auth + Storage + Realtime), TanStack Query, react-i18next

**Preserved Features:**
- Full RLS and RBAC implementation
- Multitenant organization-scoped architecture
- Modular service ownership
- Unsplash & Supabase Storage integration

## 📚 Project Documentation

- [Main Documentation Index](./docs/README.md)
- [Getting Started Guide](./docs/01-Getting-Started/README.md)
- [Platform Architecture](./docs/02-Platform-Architecture/System-Overview.md)
- [Development Workflow](./docs/03-Development-Guides/Development-Workflow.md)
- [Troubleshooting](./docs/07-Operations-Maintenance/Troubleshooting.md)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Start development server
npm run dev
```

**Current Focus:** Phase 1 - Foundation & Routing (Week 1-2)

---

Built for the Government of Saudi Arabia | Supporting Vision 2030