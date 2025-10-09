# Classic CV - Stefan Ramač

Jednostavan portfolio sajt napravljen sa Node.js i Express.

## 🚀 Pokretanje

1. Instalirajte dependencies:
```bash
npm install
```

2. Pokrenite server:
```bash
npm start
```

3. Otvorite browser i idite na `http://localhost:3000`

## 📁 Struktura fajlova

- `server.js` - Node.js server sa Express rutama
- `index.html` - Glavna stranica
- `404.html` - Stranica za 404 greške
- `styles.css` - CSS stilovi
- `package.json` - Node.js dependencies
- `img/` - Folder sa slikama
  - `background.jpg` - Pozadinska slika
  - `impression.jpg` - Slika za dojam
  - `avatar.jpg` - Profilna slika

## 🛠 Dostupne rute

- `GET /` - Glavna stranica
- `GET /api/info` - API informacije
- `POST /api/contact` - Kontakt forma
- `GET /*` - 404 stranica za sve ostale rute

## 📱 Responsive dizajn

Sajt je prilagođen za:
- Desktop računare
- Tablete
- Mobilne uređaje

## 🎨 Karakteristike

- Moderni, čist dizajn
- Pozadinska slika
- Open Sans font
- Animacije i hover efekti
- Responsive layout
- 404 error handling
