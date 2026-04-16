# MotionClone - Desktop App

Motion transfer desktop app: photo + reference video → AI-generated animated video using Replicate API.

## Stack
- **Electron 32+** with **electron-vite** (no Webpack)
- **React 18 + TypeScript 5**
- **TailwindCSS 3.4** (dark theme only)
- **Framer Motion** (entry animations & hover states only)
- **SQLite** via **better-sqlite3**
- **Replicate SDK v2** for motion transfer API

## Architecture

### Main Process (`src/main/`)
- `index.ts` - Electron app entry, window creation, IPC registration
- `services/` - Database, Replicate API client
- `ipc/` - Event handlers (window, settings, replicate, files, app, database)
- `types.ts` - Shared interfaces

### Preload (`src/preload/`)
- `index.ts` - ContextBridge API exposing safe IPC channels
- `index.d.ts` - TypeScript types for `window.api`

### Renderer (`src/renderer/src/`)
- `App.tsx` - Onboarding check, router setup
- `router.tsx` - HashRouter with 3 main routes
- `pages/` - Onboarding, Generate (3-step), History, Settings
- `components/` - UI blocks (Layout, Sidebar, TitleBar, Blob animations, uploads, progress)
- `hooks/` - useSettings, useGeneration, useHistory
- `lib/` - Utilities (cn, formatters, file helpers)
- `globals.css` - Tailwind & scrollbar styles

## Build & Run
```bash
npm install --legacy-peer-deps
npm run build        # Builds main, preload, renderer
npm run build:win    # Windows installer (NSIS)
npm run build:mac    # macOS DMG
npm run build:linux  # Linux AppImage
npm run dev          # Dev server (requires GUI)
```

## Key Behaviors
1. **Onboarding** - First run requires Replicate API key validation
2. **3-Step Generate** - Photo → Video → Review & Generate
3. **IPC** - All Replicate calls via main process (never expose API key to renderer)
4. **Storage** - SQLite for history, electron-store for settings
5. **Colors** - Dark theme only (--background #0a0a0f, --primary #a855f7)

## Known Limitations
- No UI tests (no test runner configured)
- Replicate SDK v2-alpha (may have API changes)
- Auto-updater configured but not tested without published releases
- File paths for inputs/outputs need UI configuration before first use

## Next Steps
- Test dev mode with GUI
- Integrate real Replicate API calls
- Add video download/save logic  
- Polish error messages
- Build & test installers
