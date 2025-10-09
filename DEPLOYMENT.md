# Deployment Instructions for cPanel

## Files to Upload to cPanel

Upload ONLY these files to your cPanel public_html directory:
- `index.html`
- `404.html`
- `styles.css`
- `script.js`
- `server.js` (only if running Node.js on cPanel)
- `package.json` (only if running Node.js on cPanel)

## DO NOT Upload:
- `node_modules/` folder
- `.git/` folder
- `package-lock.json`
- `.gitignore`
- `.gitattributes`
- `README.md`

## cPanel Antivirus False Positive Issue

If you get a virus warning like "Sanesecurity.Foxhole.JS_Zip_11.UNOFFICIAL", this is a **false positive**. The antivirus scanner is flagging the jsPDF library CDN link or JavaScript patterns.

### Solutions:

1. **Upload files individually** instead of ZIP:
   - Upload each file one by one via cPanel File Manager
   
2. **Whitelist your upload**:
   - Contact your hosting provider to whitelist the upload
   - Most providers can temporarily disable the scanner for your upload

3. **Use FTP instead**:
   - FTP uploads often bypass the antivirus scanner
   - Use FileZilla or another FTP client

4. **Static Site Alternative**:
   - This is a static site with optional Node.js backend
   - You can deploy just the HTML, CSS, and JS files
   - No server.js needed if hosting on static hosting

## Verification

After upload, the site should be accessible at: `yourdomain.com`
The "Download CV" button will work client-side without server dependencies.

