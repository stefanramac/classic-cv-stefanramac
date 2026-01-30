# classic cv - stefan ramač

a personal portfolio and cv website for stefan ramac, devops engineer.

## about

this is a modern, responsive portfolio website built with node.js and express. it features a clean dark theme design with a one-page layout that showcases professional experience, skills, and projects.

the website includes:
- about section with professional summary
- experience timeline loaded dynamically
- skills and technologies overview
- projects showcase
- portfolio section
- downloadable cv (pdf generated client-side)
- admin dashboard for content management
- responsive design for desktop, tablet, and mobile

## tech stack

- backend: node.js, express
- frontend: html, css, javascript
- database: mongodb (via mongoose)
- pdf generation: jspdf (client-side)

## getting started

1. install dependencies:

```bash
npm install
```

2. create a `.env` file with your configuration:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
SESSION_SECRET=your_session_secret
```

3. initialize the database (first time only):

```bash
node init-db.js
```

4. start the server:

```bash
npm start
```

5. open your browser and navigate to `http://localhost:3000`

## routes

- `GET /` - main portfolio page
- `GET /adminlogin` - admin login page
- `GET /dashboard` - admin dashboard (requires authentication)
- `GET /api/info` - api information
- `POST /api/contact` - contact form endpoint
- `GET /*` - 404 page for undefined routes


