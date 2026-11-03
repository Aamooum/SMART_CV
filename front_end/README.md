# SMART CV (frontend)
React + Vite + Tailwind CSS v4.

    npm install
    npm run dev

Sans `VITE_API_URL`, l'analyse est simulée (src/lib/scoring.js).
Avec un backend : POST {VITE_API_URL}/analyze (multipart : `job` JSON + `cvs` PDF)
→ [{ id, name, headline, years, score }].
