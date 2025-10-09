# Classic CV - Stefan Ramač

Modern portfolio website built with Node.js and Express.

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## 📁 File Structure

- `server.js` - Node.js server with Express routes
- `index.html` - Main page
- `404.html` - 404 error page
- `styles.css` - CSS styles
- `script.js` - JavaScript functionality
- `package.json` - Node.js dependencies
- `img/` - Images folder
  - `background.jpg` - Background image
  - `impression.jpg` - Impression image
  - `avatar.jpg` - Profile picture
- `files/` - Documents folder
  - `Stefan_Ramač_-_Software_Engineer.pdf` - Resume/CV

## 🛠 Available Routes

- `GET /` - Main page
- `GET /api/info` - API information
- `POST /api/contact` - Contact form
- `GET /*` - 404 page for all other routes

## 📱 Responsive Design

The website is optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🎨 Features

- Modern, clean design with dark theme
- One-page layout with smooth scrolling navigation
- Dynamic scroll spy functionality
- **Download CV button** - Generates professional PDF CV with all information
- Floating Action Button (FAB) with social links
- Back to Top button
- Animated hint for social links
- Comprehensive sections: About, Experience, Skills, Projects, Portfolio
- Tech tags and project showcases
- Responsive navigation
- Fade-in animations
- Custom 404 error page
- Professional typography with Open Sans font

## 📄 CV Download Feature

The website includes a professional CV download feature that generates a PDF with:
- Complete professional experience with descriptions and technologies
- Education and certifications (including AZ-900)
- Languages with proficiency levels
- Nationality information
- Clickable links to email, LinkedIn, GitHub, and website
- Professional formatting with dark blue color scheme

## 🚀 Deployment to cPanel

### Quick Deployment

Use the provided script to create a clean deployment package:
```bash
./create-deployment.sh
```

This creates `deployment.zip` with only necessary files:
- `index.html`
- `404.html`
- `styles.css`
- `script.js`

### ⚠️ Antivirus False Positive

If cPanel shows a virus warning like "Sanesecurity.Foxhole.JS_Zip_11.UNOFFICIAL", this is a **false positive**. The scanner is flagging the jsPDF library or JavaScript patterns.

**Solutions:**
1. **Upload files individually** - Use cPanel File Manager to upload each file separately
2. **Use FTP** - FTP uploads often bypass the antivirus scanner (use FileZilla)
3. **Contact hosting support** - Ask them to whitelist your upload
4. **Try deployment.zip** - Already created without problematic files

### Alternative: Manual Upload

1. Go to cPanel File Manager
2. Navigate to `public_html`
3. Upload these files one by one:
   - `index.html`
   - `404.html` 
   - `styles.css`
   - `script.js`
4. Set proper permissions (644 for files)

**Note:** The site works as a static website. You don't need Node.js/Express on cPanel unless you want to use the API routes. The CV download feature works client-side without server dependencies.
