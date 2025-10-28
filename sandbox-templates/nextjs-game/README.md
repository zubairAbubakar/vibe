# E2B Sandbox Template - Next.js Game Development

This is a specialized E2B sandbox template optimized for HTML5 game development with Next.js.

## What's Included

- **Next.js 15.3.3** - Latest Next.js with App Router
- **TypeScript** - Full TypeScript support
- **Tailwind CSS** - For UI elements (menus, HUD, overlays)
- **Shadcn UI** - All components pre-installed for game UI
- **Phaser 3** - Full-featured HTML5 game framework
- **PixiJS** - High-performance 2D WebGL renderer
- **Howler.js** - Cross-browser audio library

## Pre-installed Game Libraries

### Phaser 3

Best for complete games like platformers, shooters, puzzle games, etc.

```typescript
import Phaser from 'phaser';
```

### PixiJS

Best for custom rendering engines and simpler games.

```typescript
import * as PIXI from 'pixi.js';
```

### Howler.js

Audio management for game sound effects and music.

```typescript
import { Howl, Howler } from 'howler';
```

## Building the Template

To build this sandbox template, run:

```bash
cd sandbox-templates/nextjs-game
e2b template build
```

This will create a new sandbox template with all game libraries pre-installed.

## Using the Template

In your code, use the template name:

```typescript
import { Sandbox } from '@e2b/code-interpreter';

// Create sandbox with game libraries pre-installed
const sandbox = await Sandbox.create('vibe-nextjs-game');
```

## Template Features

- 🎮 Phaser 3, PixiJS, and Howler.js pre-installed
- ⚡ Next.js with Turbopack for fast hot-reload
- 🎨 Shadcn UI components for game menus
- 📱 Mobile-first development ready
- 🔧 TypeScript configured
- 🎯 Optimized for game development

## Notes

- The development server starts automatically on port 3000
- Hot reload is enabled for rapid game development
- All game libraries are ready to use without installation
- Agent can still install additional libraries via terminal if needed
