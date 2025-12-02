This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## Project Structure

```
farmonaut-nextjs/
├─ public/                  # Static assets (images, icons, etc.)
│   ├─ logo.svg
│   └─ favicon.ico
│
├─ src/
│   ├─ app/                 # Next.js App Router structure
│   │   ├─ layout.tsx       # Root layout
│   │   ├─ page.tsx         # Home page
│   │   ├─ globals.css      # Tailwind base + custom styles
│   │   └─ head.tsx         # Metadata (optional)
│   │
│   ├─ components/          # Reusable UI components
│   │   ├─ Button.tsx
│   │   ├─ Card.tsx
│   │   ├─ Navbar.tsx
│   │   ├─ Sidebar.tsx
│   │   └─ charts/          # Chart components (D3, Recharts, Chart.js)
│   │       ├─ LineChart.tsx
│   │       └─ BarChart.tsx
│   │
│   ├─ features/            # Domain-specific features
│   │   ├─ farmers/
│   │   │   ├─ FarmerCard.tsx
│   │   │   └─ FarmerForm.tsx
│   │   ├─ fields/
│   │   │   ├─ FieldMap.tsx      # Mapbox / Leaflet
│   │   │   └─ FieldStats.tsx
│   │   └─ dashboard/
│   │       └─ Dashboard.tsx
│   │
│   ├─ hooks/               # Custom React hooks
│   │   └─ useFetch.ts
│   │
│   ├─ lib/                 # Utilities, API clients
│   │   ├─ api.ts            # Axios / fetch wrapper
│   │   └─ helpers.ts
│   │
│   ├─ styles/              # Tailwind overrides, shadcn variables
│   │   ├─ tailwind.css
│   │   └─ theme.css
│   │
│   └─ types/               # TypeScript interfaces
│       └─ index.d.ts
│
├─ .env.local               # Environment variables (API keys)
├─ next.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```