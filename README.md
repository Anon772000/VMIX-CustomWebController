# AudioPlus vMix Control Center

A custom React-based control surface for managing vMix productions with AudioPlus.com.au branding.

## Features

- **Live connection controls** – Quickly adjust host, port and HTTPS preferences with manual and automated refresh.
- **Program & preview monitoring** – Visual cards highlight the current program and preview sources.
- **Quick transition triggers** – One-tap access to Take, Auto and Fade along with instant overlay toggles.
- **Input management grid** – Send any input to preview or cut straight to program with branded input cards.
- **Audio mixing tools** – Adjust per-input levels, toggle audio and monitor buses alongside master control.
- **Responsive, brand-aligned UI** – Dark glassmorphism styling inspired by the AudioPlus identity.

## Getting started

```bash
npm install
npm run dev
```

The development server runs at [http://localhost:5173](http://localhost:5173) by default.

### Production build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Connecting to vMix

1. Ensure the vMix web controller is enabled (`Settings` → `Web Controller`).
2. Enter the vMix machine's IP address and web controller port (default `8088`).
3. Toggle HTTPS if your vMix server is configured with SSL.
4. Press **Refresh now** to fetch the current state or enable auto-refresh for continuous updates.

## Notes

- All API interactions use the native vMix HTTP interface. Functions such as `Cut`, `Auto`, `PreviewInput` and `SetVolume` are triggered directly from the UI.
- XML responses from vMix are parsed in-browser; ensure the controller is served from a trusted origin with appropriate CORS allowances when accessing remote systems.

## Customisation

Update the styles in `src/styles/app.css` or adjust layout components in `src/components` to fit specific production requirements.
