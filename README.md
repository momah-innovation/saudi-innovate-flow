# Ruwād Innovation Platform

A modern innovation management platform built with React, TypeScript, and Supabase.

## 🛠️ Tech Stack

- **Frontend:** React 18.3.1 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components  
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **State Management:** TanStack Query
- **Internationalization:** react-i18next (Arabic/English support)
- **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 📚 Documentation

- [Main Documentation](./docs/README.md)
- [Getting Started Guide](./docs/01-Getting-Started/README.md)
- [Development Setup](./docs/01-Getting-Started/Development-Setup.md)
- [Project Structure](./docs/01-Getting-Started/Project-Structure.md)

## 🏗️ Architecture

- **Multi-tenant Architecture** - Organization-based workspace isolation
- **Role-based Access Control** - Granular permissions system
- **Real-time Features** - Live updates via Supabase Realtime
- **Internationalization** - Full Arabic/English RTL/LTR support
- **File Management** - Integrated Supabase Storage

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key from the API settings
3. Update your `.env.local` file with these credentials

---

Built for the Government of Saudi Arabia | Supporting Vision 2030