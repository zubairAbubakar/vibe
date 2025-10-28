# 🎮 Vibe - AI-Powered Code & Game Development Platform

<div align="center">

**Build web applications and HTML5 games with AI assistance in isolated sandboxes**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.2-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![tRPC](https://img.shields.io/badge/tRPC-11.5.1-2596BE?style=flat&logo=trpc)](https://trpc.io/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Game Development](#-game-development) • [Documentation](#-documentation)

</div>

---

## 🌟 Features

### 🤖 **AI-Powered Code Generation**

- Multi-agent system powered by **@inngest/agent-kit** and **OpenAI**
- Intelligent code generation with context awareness
- Automatic iteration and refinement (up to 25 iterations for complex projects)
- **Memory system** - AI remembers previous conversations and project context

### 🎮 **HTML5 Game Development**

- **Automatic game detection** - Recognizes game-related requests
- Pre-configured sandbox with game libraries:
  - **Phaser 3** - Full-featured game framework
  - **PixiJS** - High-performance 2D WebGL renderer
  - **Howler.js** - Cross-browser audio library
- Specialized game prompts for better results
- Extended iteration limits (25 vs 15) for game complexity

### 🔒 **Isolated Sandbox Execution**

- Secure code execution with **E2B Code Interpreter**
- Multiple sandbox templates (standard & game development)
- Configurable timeouts and resource limits
- File system access and management

### 🔄 **Async Workflow Processing**

- Powered by **Inngest** for reliable background jobs
- Real-time progress tracking
- Automatic retries and error handling
- Event-driven architecture

### 🎨 **Modern UI/UX**

- Built with **shadcn/ui** and **Radix UI** components
- **Dark mode** support with next-themes
- Responsive design with **Tailwind CSS 4**
- Real-time updates with React Query

### 🔐 **Authentication & User Management**

- Secure authentication with **Clerk**
- User session management
- Protected routes and API endpoints

### 🗄️ **Database & API**

- **PostgreSQL** database with **Prisma ORM**
- Type-safe APIs with **tRPC**
- Automatic type generation and validation with **Zod**

---

## 🛠️ Tech Stack

| Category           | Technologies                                        |
| ------------------ | --------------------------------------------------- |
| **Framework**      | Next.js 15.5.3 (App Router), React 19, TypeScript 5 |
| **Styling**        | Tailwind CSS 4, shadcn/ui, Radix UI                 |
| **API Layer**      | tRPC 11.5.1, React Query (TanStack Query)           |
| **Database**       | PostgreSQL, Prisma 6.16.2                           |
| **Authentication** | Clerk                                               |
| **AI & Agents**    | @inngest/agent-kit, OpenAI, Inngest                 |
| **Code Execution** | E2B Code Interpreter                                |
| **Game Libraries** | Phaser 3, PixiJS, Howler.js                         |
| **Form Handling**  | React Hook Form, Zod validation                     |
| **Dev Tools**      | ESLint, Turbopack, tsx                              |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or later
- **npm**, **yarn**, **pnpm**, or **bun**
- **PostgreSQL** database
- **Docker Desktop** (for building E2B templates)

### Required API Keys

You'll need to sign up and get API keys from:

1. **Clerk** - [https://clerk.com](https://clerk.com) (Authentication)
2. **E2B** - [https://e2b.dev](https://e2b.dev) (Code Interpreter Sandboxes)
3. **OpenAI** - [https://platform.openai.com](https://platform.openai.com) (AI Models)
4. **Inngest** - [https://www.inngest.com](https://www.inngest.com) (Workflow Engine)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vibe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/vibe"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

   # E2B Code Interpreter
   E2B_API_KEY="e2b_..."

   # OpenAI
   OPENAI_API_KEY="sk-..."

   # Inngest
   INNGEST_EVENT_KEY="..."
   INNGEST_SIGNING_KEY="signkey-..."
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Build E2B Sandbox Templates**

   Start Docker Desktop, then build the templates:

   ```bash
   # Build standard Next.js template
   cd sandbox-templates/nextjs
   e2b template build

   # Build game development template
   cd ../nextjs-game
   e2b template build
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 Game Development

Vibe includes specialized support for HTML5 game development with automatic detection and optimized workflows.

### Creating Games

Simply describe your game idea naturally:

- "create a simple pong game"
- "build a flappy bird clone"
- "make a platformer game with jumping mechanics"
- "build a match-3 puzzle game"

The system will automatically:

- ✅ Detect it's a game request
- ✅ Use the game-specific sandbox (Phaser, PixiJS, Howler pre-installed)
- ✅ Apply specialized game development prompts
- ✅ Increase iteration limit to 25 for complex game logic

### Game Libraries Available

| Library       | Version | Purpose                            |
| ------------- | ------- | ---------------------------------- |
| **Phaser 3**  | Latest  | Full-featured HTML5 game framework |
| **PixiJS**    | Latest  | High-performance 2D WebGL renderer |
| **Howler.js** | Latest  | Cross-browser audio library        |

### Example Game Requests

```
User: "Create a space shooter game with enemy waves"
→ Uses game template, 25 iterations, game-specific prompts

User: "Build a snake game with score tracking"
→ Automatic game detection, optimized for game development

User: "Make a racing game with obstacles"
→ Game template with Phaser pre-loaded
```

📚 **More Details**: See [GAME_IMPLEMENTATION.md](./GAME_IMPLEMENTATION.md) for technical documentation.

---

## 📁 Project Structure

```
vibe/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   └── ui/                # shadcn/ui components
│   ├── inngest/               # Inngest functions & workflows
│   │   ├── functions.ts       # Agent functions
│   │   └── utils.ts          # Helper utilities
│   ├── lib/                   # Utilities and configurations
│   ├── prompts.ts             # AI prompts (standard & game)
│   ├── server/                # tRPC server & routers
│   └── generated/
│       └── prisma/            # Generated Prisma Client
├── prisma/
│   └── schema.prisma          # Database schema
├── sandbox-templates/
│   ├── nextjs/               # Standard Next.js template
│   └── nextjs-game/          # Game development template
├── public/                    # Static assets
└── .github/
    └── workflows/            # CI/CD workflows
```

---

## 🔧 Available Scripts

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start development server with Turbopack |
| `npm run build`          | Build production bundle                 |
| `npm start`              | Start production server                 |
| `npm run lint`           | Run ESLint                              |
| `npx prisma studio`      | Open Prisma Studio (database GUI)       |
| `npx prisma migrate dev` | Create and apply migrations             |
| `npx prisma generate`    | Generate Prisma Client                  |

---

## 🤖 Auto-Generated PR Descriptions

This repository features automated PR description generation! When you create a pull request:

- **Smart Analysis**: Automatically categorizes your changes (Frontend, API, Database, etc.)
- **Conventional Commits**: Recognizes and formats conventional commit messages
- **Dynamic Checklists**: Generates relevant testing and deployment checklists
- **Respectful**: Only auto-generates if PR description is empty or minimal

### Quick Start:

1. Use conventional commits: `feat: add feature` or `fix: resolve bug`
2. Create your PR - description will be auto-generated
3. Review and edit as needed

📚 [Full Documentation](.github/AUTO_PR_DOCUMENTATION.md) | ⚙️ [Configuration](.github/auto-pr-config.yml)

---

## 📚 Documentation

- **[Game Implementation Guide](./GAME_IMPLEMENTATION.md)** - Technical details of game development features
- **[Auto PR Documentation](.github/AUTO_PR_DOCUMENTATION.md)** - PR automation details
- **[Prisma Schema](./prisma/schema.prisma)** - Database structure
- **[E2B Templates](./sandbox-templates/)** - Sandbox configurations

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add environment variables
4. Deploy!

Vercel automatically detects Next.js and configures optimal settings.

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- Database connection string (`DATABASE_URL`)
- All API keys (Clerk, E2B, OpenAI, Inngest)
- Clerk URLs for your production domain

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [E2B](https://e2b.dev/) - Secure code execution sandboxes
- [Inngest](https://www.inngest.com/) - Durable workflow engine
- [Clerk](https://clerk.com/) - User authentication
- [Phaser](https://phaser.io/) - HTML5 game framework

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and AI**

</div>
