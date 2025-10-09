const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware za statičke fajlove
app.use(express.static(path.join(__dirname)));

// Ruta za glavnu stranicu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta za API endpoint (opciono - možete dodati više API ruta)
app.get('/api/info', (req, res) => {
    res.json({
        name: 'Stefan Ramač',
        profession: 'Web Developer',
        message: 'Dobrodošli na moj portfolio sajt!'
    });
});

// Ruta za kontakt formu (POST)
app.post('/api/contact', express.json(), (req, res) => {
    const { name, message } = req.body;
    
    // Ovde možete dodati logiku za slanje emaila ili čuvanje u bazu
    console.log('Nova poruka:', { name, message, timestamp: new Date() });
    
    res.json({
        success: true,
        message: 'Poruka je uspešno poslata!'
    });
});

// Catch-all ruta za 404 greške
app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
    console.log('Dostupne rute:');
    console.log('  GET  /           - Glavna stranica');
    console.log('  GET  /api/info   - API informacije');
    console.log('  POST /api/contact - Kontakt forma');
    console.log('  GET  /*          - 404 stranica za sve ostale rute');
});
