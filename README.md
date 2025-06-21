# KoaCoach Skeleton

This repository contains a minimal React setup for **KoaCoach**, a gamified wellness application. It displays an avatar in the center of the screen. Clicking the avatar triggers a placeholder animation (played as a short video).

## Getting Started

1. Install Node.js (version 18 or higher recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the printed URL in your browser to see the avatar.

## Project Structure

- `public/index.html` – entry point loaded by Vite.
- `src/main.jsx` – bootstraps the React application.
- `src/App.jsx` – main component showing the avatar and handling click animations.
- `src/style.css` – basic styling.

The avatar videos currently reference sample clips from the internet. Replace the URLs in `src/App.jsx` with your own animations when available.

## Customization

- Modify `src/App.jsx` to integrate real animations or connect to your backend.
- Update styling in `src/style.css`.

This skeleton provides a starting point so you can focus on integrating authentication, gamified features and the voice agent later.
