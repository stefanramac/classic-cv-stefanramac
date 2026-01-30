# Admin Dashboard Guide

## 🎉 Sistem je uspešno implementiran!

Dodat je kompletan admin sistem sa MongoDB integracijom za upravljanje iskustvima na sajtu.

## 📋 Šta je implementirano

### 1. **MongoDB Integracija**
- Povezivanje sa MongoDB Atlas bazom
- Kolekcije:
  - `stefanramac_cv.user` - za admin korisnike
  - `stefanramac_cv.experience` - za radna iskustva

### 2. **Admin Login** (`/adminlogin`)
- Sigurna autentifikacija sa email i password
- Session management
- Automatsko preusmeravanje ako je već ulogovan

### 3. **Admin Dashboard** (`/dashboard`)
- **CRUD operacije za iskustva:**
  - ✅ Dodavanje novih iskustava
  - ✅ Editovanje postojećih iskustava
  - ✅ Brisanje iskustava
- **Polja za iskustvo:**
  - Pozicija (job title)
  - Kompanija
  - Datum početka
  - Datum završetka (ili "Present" checkbox)
  - Opis posla
  - Skills (mogu se dodavati jedan po jedan)

### 4. **Dinamičko učitavanje na početnoj**
- Početna stranica (`/`) sada dinamički učitava iskustva iz baze
- Automatski prikaz svih dodanih/izmenjenih iskustava

## 🔐 Login Kredencijali

```
Email: stefanramac@gmail.com
Password: admin123
```

**⚠️ VAŽNO: Promeni password nakon prvog logovanja!**

## 🚀 Kako pokrenuti

1. **Pokreni server:**
   ```bash
   npm run dev
   # ili
   PORT=3003 nodemon server.js
   ```

2. **Pristupi aplikaciji:**
   - **Početna stranica:** http://localhost:3003/
   - **Admin login:** http://localhost:3003/adminlogin
   - **Dashboard:** http://localhost:3003/dashboard

## 📁 Struktura fajlova

```
├── .env                    # MongoDB connection string (ne uploaduje se na git)
├── server.js              # Express server sa MongoDB i API rutama
├── index.html             # Početna stranica (dinamički učitava iskustva)
├── adminlogin.html        # Login stranica za admin
├── dashboard.html         # Dashboard za upravljanje iskustvima
├── script.js              # Frontend JavaScript (dodato učitavanje iskustava)
├── init-db.js             # Skripta za inicijalizaciju baze (opcionalno)
└── package.json           # Dependencije (mongodb, dotenv, bcryptjs, express-session)
```

## 🔧 API Endpointi

### Javni endpointi:
- `GET /api/experiences` - Lista svih iskustava (za početnu stranu)

### Zaštićeni endpointi (zahtevaju autentifikaciju):
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/auth/check` - Provera da li je korisnik ulogovan
- `POST /api/experiences` - Kreiranje novog iskustva
- `PUT /api/experiences/:id` - Ažuriranje iskustva
- `DELETE /api/experiences/:id` - Brisanje iskustva
- `GET /api/experiences/:id` - Detalji jednog iskustva

## 💡 Kako koristiti Dashboard

1. **Dodavanje novog iskustva:**
   - Popuni formu sa desne strane
   - Unesi poziciju, kompaniju, datume, opis
   - Dodaj skills jedan po jedan (unesi i pritisni "Add" ili Enter)
   - Klikni "Save Experience"

2. **Editovanje iskustva:**
   - U listi iskustava sa leve strane, klikni "Edit" na željenom iskustvu
   - Forma će se popuniti sa trenutnim podacima
   - Izmeni šta je potrebno
   - Klikni "Update Experience"

3. **Brisanje iskustva:**
   - Klikni "Delete" na iskustvu koje želiš da obrišeš
   - Potvrdi brisanje

## 🔒 Bezbednost

- Password se čuva hashovan u bazi (bcrypt)
- Session-based autentifikacija
- Protected routes sa middleware autentifikacijom
- `.env` fajl nije u git repozitorijumu

## 📥 Download CV Funkcionalnost

### Dinamičko Generisanje CV-a
- CV se sada **dinamički generiše** sa podacima iz baze
- Sva iskustva koja dodaš na dashboardu će automatski biti uključena u CV
- Novi redovi (Enter) u description polju se čuvaju i prikazuju u CV-u

### Dodavanje Slike Profila
1. Pripremi svoju profesionalnu fotografiju
2. Sacuvaj je kao `profile-pic.jpeg` 
3. Stavi u folder: `/img/profile-pic.jpeg`
4. Slika će se automatski pojaviti u gornjem desnom uglu CV-a

**Preporuke za sliku:**
- Format: JPEG
- Veličina: 400x400px ili veća
- Odnos: Kvadrat ili portret (3:4)
- Profesionalna fotografija sa dobrim osvetljenjem

## 📝 Napomene

- Sva iskustva koja dodaš ili izmeniš na dashboardu će se odmah prikazati na početnoj stranici **i u CV-u**
- MongoDB connection string je u `.env` fajlu i ne uploaduje se na GitHub
- Init-db.js skripta može se ponovo koristiti ako treba resetovati bazu (briše postojeće podatke)
- CV se generiše u real-time sa trenutnim podacima iz baze

## 🆘 Troubleshooting

**Problem:** Server ne može da se konektuje na MongoDB
- **Rešenje:** Proveri da li je `MONGODB_URI` u `.env` fajlu tačan

**Problem:** Ne mogu da se ulogujem
- **Rešenje:** 
  - Proveri da li je `init-db.js` pokrenut (`node init-db.js`)
  - Koristi kredencijale: `stefanramac@gmail.com` / `admin123`

**Problem:** Iskustva se ne prikazuju na početnoj
- **Rešenje:** 
  - Otvori DevTools Console i proveri greške
  - Proveri da li API endpoint `/api/experiences` vraća podatke

---

**Sretno sa upravljanjem sadržajem! 🚀**

