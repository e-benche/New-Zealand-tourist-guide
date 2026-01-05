# New-Zealand-tourist-guide

Dette prosjektet er en enkel nettside om New Zealand med flere JavaScript-demonstrasjoner laget for en skoleoppgave.

Innhold:
- `index.html` — hovedside med oversikt og tre prosjektseksjoner: Reiseplanlegger (interaktiv), Quiz (spill) og Favoritter.
- `Galleri.html` — bildegalleri hvor brukere kan legge til favoritter.
- `styles.css` — stil og responsiv design.
- `scripts/` — JavaScript-filer:
	- `travel-planner.js` — interaktiv reiseplanlegger (brukerinput, arrays, lagring i `localStorage`).
	- `quiz-game.js` — quiz-spill (variabler, løkker, funksjoner, array med spørsmål).
	- `favorites.js` — lagring av favoritter i galleri med `localStorage`.
	- `theme.js` — enkel tema-veksler (dark/light) som husker valg.

Krav oppfylt:
- Minst tre JS-prosjekter med variabler, løkker og funksjoner.
- En interaktiv app som tar input (Reiseplanlegger).
- Ett spill (Quiz).
- Lagring/persistens med `localStorage` (favoritter, planer, highscore).
- Responsivt grensesnitt, tilgjengelighetstiltak (fokus, ARIA) og kommentarer i koden.

Hvordan teste lokalt:
1. Åpne `index.html` i en nettleser (dobbelklikk filen).
2. Eller bruk VS Code med Live Server for rask live-reload.

Deploy til GitHub Pages:
1. Opprett et repo på GitHub (hvis ikke allerede).
2. Push alle filer til `main` branch.
3. Gå til `Settings > Pages` og velg `main` branch og `/(root)` som mappe.
4. Siden vil være tilgjengelig på `https://<brukernavn>.github.io/<repo>` etter noen minutter.

Vil du at jeg skal hjelpe med å pushe dette til GitHub og aktivere Pages? Jeg kan også legge til en enkel `.gitignore` og en kort commit-historikk.