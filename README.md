# UFO Tracker

Real-time UFO (drone) tracking: live map, positions from an SSE stream, and automatic status by how long a drone has been silent.

**How it works:** The frontend connects to the server over SSE and receives position updates (id, lat, lng, heading). Each drone is shown as a marker. If a drone stops sending updates, it is first marked **lost** (inactive, grey icon), then **removed** from the map after a longer silence.

### Status timings

| Event | After no updates for |
|-------|----------------------|
| **Lost** (inactive, grey marker) | 1 minute |
| **Removed** (disappears from map) | 5 minutes |

Cleanup runs every 10 seconds, so the actual transition can be up to ~10 s after the threshold.

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

