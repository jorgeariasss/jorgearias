# MotionClone

Desktop application that transforms photos into animated videos using AI motion transfer via Replicate API.

## Features

- **3-Step Generation Flow**: Select photo → Select video → Review and generate
- **Motion Transfer**: Uses Replicate's `mimic-motion` model for realistic motion transfer
- **Local Storage**: SQLite database for generation history
- **Dark Theme UI**: Modern Electron app with TailwindCSS
- **Cross-Platform**: Builds for Windows (NSIS), macOS (DMG), and Linux (AppImage)

## System Requirements

- Node.js 18+
- npm 8+
- 500MB free disk space

## Getting Started

### Installation

```bash
git clone https://github.com/crisaenz10/motionclone.git
cd motionclone
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

Starts the Electron app in development mode with hot reload.

### Building

Build for your platform:

```bash
npm run build:win   # Windows NSIS installer
npm run build:mac   # macOS DMG
npm run build:linux # Linux AppImage
```

Output files appear in the `dist/` directory.

## First Run Setup

1. **API Key**: On first launch, you'll need a Replicate API key
2. **Get Key**: Visit [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
3. **Enter Key**: Paste it in the Onboarding screen
4. **Start Generating**: Use the 3-step flow to create motion videos

## How It Works

1. **Select Photo**: Upload a clear photo (PNG/JPG/WEBP, max 10MB)
2. **Select Video**: Upload a reference video (MP4/MOV/WEBM, max 50MB, up to 10s)
3. **Choose Quality**:
   - **Fast**: 1-2 minutes, ~$0.05
   - **High**: 3-5 minutes, ~$0.15
4. **Generate**: The app sends your files to Replicate API and downloads the result

## Architecture

- **Main Process** (`src/main/`): Electron backend, IPC handlers, Replicate API client
- **Preload** (`src/preload/`): Secure context bridge for renderer-main communication
- **Renderer** (`src/renderer/src/`): React app with pages and components
- **Database**: SQLite for generation history
- **Settings**: electron-store for API key and preferences

## Project Structure

```
motionclone/
├── src/
│   ├── main/              # Main process (Node.js)
│   │   ├── ipc/          # IPC event handlers
│   │   ├── services/     # Replicate client, database
│   │   └── index.ts      # App entry point
│   ├── preload/          # IPC bridge
│   ├── renderer/         # React app
│   │   └── src/
│   │       ├── pages/    # Onboarding, Generate, History, Settings
│   │       ├── components/
│   │       ├── hooks/    # Custom React hooks
│   │       └── lib/      # Utilities
│   └── electron-vite.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Development Commands

```bash
npm run dev         # Dev server with hot reload
npm run build       # Build all (main, preload, renderer)
npm run build:win   # Windows build
npm run build:mac   # macOS build
npm run build:linux # Linux build
npm run publish     # Build & publish (requires GitHub release setup)
```

## Security Notes

- API keys are stored **locally** on your machine only
- Never shared with third parties
- Stored via `electron-store` in user data directory
- Main process handles all API calls (never exposed to renderer)

## Troubleshooting

**"API key invalid"**
- Verify key at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
- Keys should start with `r8_` or similar prefix

**"Video too long"**
- Maximum video duration is 10 seconds
- Re-trim your video and try again

**"Large file error"**
- Image: Max 10MB
- Video: Max 50MB

## Contributing

Bug reports and feature requests welcome on [GitHub Issues](https://github.com/crisaenz10/motionclone/issues).

## License

MIT

## Credits

Built with:
- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [Replicate API](https://replicate.com/)
- [TailwindCSS](https://tailwindcss.com/)
