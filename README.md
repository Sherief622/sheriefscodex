# ⟨/⟩ Sherief's Dev Codex

A modern, dark mode portfolio website for showcasing software engineering projects. Built with React, TypeScript, and Supabase, featuring an on site admin interface for managing projects with rich content blocks.

## Features

### Public Pages

- **Landing Page** — Hero section with animated orbs and featured project showcase
- **Projects Gallery** — Filterable grid with search and tag based filtering
- **Project Detail** — Rich content rendering with syntax highlighted code blocks, images, text, and headings
- **About Page** — Skills grid, bio, and contact links

### Admin Interface (`/admin`)

- **Secure Login** — Email + password authentication via Supabase Auth
- **Project Dashboard** — View, edit, and delete projects
- **Project Editor** — WYSIWYG style block editor with:
  - Text blocks (Markdown support)
  - Code blocks (17 languages, syntax highlighting, line numbers)
  - Image blocks (uploaded to Supabase Storage)
  - Heading blocks (H2/H3)
  - Drag to reorder, live preview mode

### Technical Highlights

- **Supabase Auth** — Secure admin authentication with Row Level Security
- **Supabase Database** — PostgreSQL with public read / authenticated write policies
- **Supabase Storage** — Persistent image hosting with public URLs
- **Universal Persistence** — Projects and images visible to all visitors across all browsers
- **Vite** — Fast dev server with HMR and optimized production builds
- **Dark mode Glassmorphism** — Custom CSS design system with smooth animations

## 🛠️ Tech Stack

| Layer                 | Technology                         |
| --------------------- | ---------------------------------- |
| **Framework**         | React 19 + TypeScript              |
| **Build Tool**        | Vite 7                             |
| **Routing**           | React Router v7                    |
| **Database**          | Supabase (PostgreSQL)              |
| **Auth**              | Supabase Auth                      |
| **Image Storage**     | Supabase Storage                   |
| **Styling**           | Vanilla CSS (custom design system) |
| **Code Highlighting** | react-syntax-highlighter (Prism)   |
| **Markdown**          | react-markdown                     |
| **Hosting**           | Vercel                             |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/Sherief622/sheriefscodex.git
   cd sheriefscodex
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase**

   Run this SQL in the Supabase SQL Editor:

   ```sql
   CREATE TABLE projects (
     id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title           TEXT NOT NULL DEFAULT '',
     slug            TEXT NOT NULL DEFAULT '',
     description     TEXT NOT NULL DEFAULT '',
     tags            TEXT[] NOT NULL DEFAULT '{}',
     thumbnail       TEXT NOT NULL DEFAULT '',
     featured        BOOLEAN NOT NULL DEFAULT FALSE,
     content_blocks  JSONB NOT NULL DEFAULT '[]',
     created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
     updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
   );

   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Anyone can read projects" ON projects
     FOR SELECT USING (true);

   CREATE POLICY "Authenticated users can insert" ON projects
     FOR INSERT TO authenticated WITH CHECK (true);

   CREATE POLICY "Authenticated users can update" ON projects
     FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

   CREATE POLICY "Authenticated users can delete" ON projects
     FOR DELETE TO authenticated USING (true);
   ```

   Then create a **public** storage bucket called `project-images`.

5. **Create an admin user**

   Go to Supabase → Authentication → Users → Add User (email + password).

6. **Start the dev server**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          #Reusable UI components
│   ├── admin/           #Admin specific components (AdminGuard)
│   ├── CodeBlock.tsx     #Syntax highlighted code renderer
│   ├── ContentRenderer.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ProjectCard.tsx
├── data/                #Data layer
│   ├── supabaseClient.ts #Supabase client singleton
│   ├── projectStore.ts   #CRUD operations + image upload
│   ├── authStore.ts      #Authentication functions
│   └── types.ts          #TypeScript interfaces
├── pages/               #Route pages
│   ├── admin/            #Admin pages (Dashboard, Editor, Login)
│   ├── LandingPage.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── AboutPage.tsx
├── App.tsx              #Router configuration
├── App.css              #Design system + all styles
└── index.css            #CSS reset + variables
```
