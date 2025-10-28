# React Photos Grid

A simple photo grid application built with React that fetches and displays images from the Pexels API in a masonry layout.

## Features

- Fetches images from the Pexels API
- Displays images in a responsive masonry grid
- Infinite scrolling
- Clicking on an image opens a detailed view

## Tech Stack

- React
- TypeScript
- Vite
- Styled-Components
- React Router

## Getting Started

### Prerequisites

- Node.js (check `.nvmrc` for version)
- Run `nvm install` then `nvm use` to use the secpified node version
- An API key from [Pexels](https://www.pexels.com/api/)

### Installation

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Pexels API key:
    ```
    VITE_PEXELS_API_KEY=YOUR_PEXELS_API_KEY
    VITE_PEXELS_BASE_URL=https://api.pexels.com/v1
    ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run test`: Runs the test suite.

## Folder Structure

```
.
├── public/              # Static assets
├── src/
│   ├── assets/          # Project-specific assets
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API-related services
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Application entry point
│   └── routes.tsx       # Routing configuration
├── .env.example         # Example environment variables
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```
