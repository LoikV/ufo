# UFO Tracker

Real-time UFO tracking application with live map visualization.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Material UI, Leaflet
- **State Management**: MobX
- **Testing**: Vitest, React Testing Library
- **Mock Server**: Node.js + Express (SSE streaming)
- **CI/CD**: GitHub Actions

### Installation

Each app is installed separately.

**Frontend:**
```bash
cd apps/frontend
npm install
```

**Mock Server:**
```bash
cd apps/mock-server
npm install
```

### Running Locally

Use two terminals — one per app.

**Terminal 1 — Mock Server:**
```bash
cd apps/mock-server
npm start
```
Server: `http://localhost:4000`

**Terminal 2 — Frontend:**
```bash
cd apps/frontend
npm run dev
```
Client: `http://localhost:3000`

### Default Credentials
- API Key: `ufo-tracker-2026`

## Available Scripts

### Frontend (`apps/frontend`)
```bash
npm run dev          # Dev server
npm run build        # Build
npm run preview      # Preview build
npm test             # Tests (watch)
npm run test:run     # Tests once
npm run lint         # Lint
npm run lint:fix     # Lint with auto-fix
```

### Mock Server (`apps/mock-server`)
```bash
npm start            # Start (port 4000)
npm run dev          # With auto-reload
```

## Testing

From the frontend folder:
```bash
cd apps/frontend
npm run test:run -- --coverage
```

## CI/CD

- **Lint & Type Check**, **Tests**, **Build**: run in `apps/frontend`
- **Deploy**: GitHub Pages (main branch)

Details: [`.github/README.md`](.github/README.md).
