# 🚀 Deployment Guide - U.S. Incarceration Research Hub

## Quick Start Options

### Option 1: Replit (Recommended - Easiest)

#### Step-by-Step:

1. **Go to Replit**
   - Visit [replit.com](https://replit.com)
   - Sign up or log in

2. **Create New Repl**
   - Click "+ Create Repl"
   - Select "HTML, CSS, JS" template
   - Name it: `us-incarceration-research`
   - Click "Create Repl"

3. **Upload Files**
   - Delete the default files (index.html, style.css, script.js)
   - Click the three dots menu → "Upload folder"
   - Upload the entire `us-incarceration-research-site` folder
   - Wait for upload to complete

4. **Run the Site**
   - Click the green "Run" button at the top
   - Your site will be live instantly!
   - URL format: `https://us-incarceration-research.[your-username].repl.co`

5. **Share Your Site**
   - Click "Share" button in top right
   - Copy the public URL
   - Share with anyone!

#### Replit Features:
- ✅ Free hosting
- ✅ Auto-deployment on save
- ✅ Custom domain support (paid plan)
- ✅ Always-on (paid plan)
- ✅ Built-in code editor

---

### Option 2: GitHub Pages (Free, Custom Domain)

#### Step-by-Step:

1. **Create GitHub Repository**
   ```bash
   # On your local machine or Replit shell
   cd us-incarceration-research-site
   git init
   git add .
   git commit -m "Initial commit: U.S. Incarceration Research Hub"
   ```

2. **Push to GitHub**
   - Create new repository on github.com
   - Name it: `us-incarceration-research`
   - Don't initialize with README
   - Run:
   ```bash
   git remote add origin https://github.com/[username]/us-incarceration-research.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: Deploy from branch
   - Branch: `main` / `root`
   - Click "Save"

4. **Access Your Site**
   - URL: `https://[username].github.io/us-incarceration-research/`
   - Takes 2-5 minutes to deploy

#### GitHub Pages Features:
- ✅ Completely free
- ✅ Custom domain support
- ✅ HTTPS by default
- ✅ Version control
- ✅ Professional hosting

---

### Option 3: Netlify (Professional, Fast)

#### Step-by-Step:

1. **Sign Up**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub/Email

2. **Deploy via Drag & Drop**
   - Click "Add new site" → "Deploy manually"
   - Drag the entire `us-incarceration-research-site` folder
   - Drop it in the upload area
   - Wait for deployment (30 seconds)

3. **Get Your URL**
   - Netlify generates: `https://random-name-123.netlify.app`
   - Click "Site settings" → "Change site name"
   - Choose: `us-incarceration-research`
   - New URL: `https://us-incarceration-research.netlify.app`

4. **Optional: Custom Domain**
   - Click "Domain settings"
   - Add your custom domain
   - Follow DNS instructions

#### Netlify Features:
- ✅ Free tier (100GB bandwidth)
- ✅ Instant deployment
- ✅ Custom domains
- ✅ HTTPS automatic
- ✅ Global CDN
- ✅ Form handling
- ✅ Analytics (paid)

---

### Option 4: Vercel (Next.js Optimized)

#### Step-by-Step:

1. **Sign Up**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/Email

2. **Deploy**
   - Click "Add New" → "Project"
   - Import from GitHub (or drag & drop)
   - Select repository
   - Framework: None (static site)
   - Click "Deploy"

3. **Access Site**
   - URL: `https://us-incarceration-research.vercel.app`
   - Custom domain available

#### Vercel Features:
- ✅ Free hosting
- ✅ Global CDN
- ✅ Instant deployments
- ✅ Preview deployments
- ✅ Analytics
- ✅ Edge functions

---

### Option 5: Local Development

#### Using Python:

```bash
cd us-incarceration-research-site
python3 server.py
```
Visit: `http://localhost:8000`

#### Using Node.js:

```bash
cd us-incarceration-research-site
npx serve
```
Visit: `http://localhost:3000`

#### Using PHP:

```bash
cd us-incarceration-research-site
php -S localhost:8000
```
Visit: `http://localhost:8000`

---

## 🔧 Configuration for Each Platform

### Replit Configuration

File: `.replit`
```toml
run = "python3 -m http.server 8000"
entrypoint = "index.html"

[deployment]
deploymentTarget = "static"
publicDir = "/"
```

### Netlify Configuration

File: `netlify.toml` (create if needed)
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel Configuration

File: `vercel.json` (create if needed)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ]
}
```

---

## 📊 Performance Optimization

### Before Deployment:

1. **Optimize Images** (if you add any)
   - Use WebP format
   - Compress to <100KB
   - Use lazy loading

2. **Minify Files** (optional)
   ```bash
   # Install tools
   npm install -g html-minifier clean-css-cli uglify-js
   
   # Minify
   html-minifier --collapse-whitespace --remove-comments index.html -o index.min.html
   cleancss -o styles.min.css styles.css
   uglifyjs script.js -o script.min.js
   ```

3. **Enable Caching**
   - Most platforms do this automatically
   - Set cache headers for static assets

---

## 🔒 Security Considerations

1. **HTTPS**
   - All recommended platforms provide free HTTPS
   - Never deploy without SSL

2. **Content Security Policy**
   - Add CSP headers if needed
   - Restrict external scripts

3. **Data Privacy**
   - All data is public research
   - No user data collected
   - No cookies required

---

## 🌐 Custom Domain Setup

### For Any Platform:

1. **Buy Domain**
   - Namecheap, GoDaddy, Google Domains
   - Example: `incarcerationdata.org`

2. **Configure DNS**
   - Add A record or CNAME
   - Point to your hosting platform
   - Wait for propagation (1-48 hours)

3. **Enable HTTPS**
   - Most platforms auto-configure SSL
   - Use Let's Encrypt if manual

### Example DNS Records:

**For Netlify:**
```
Type: CNAME
Name: www
Value: us-incarceration-research.netlify.app
```

**For GitHub Pages:**
```
Type: A
Name: @
Value: 185.199.108.153
```

---

## 📈 Monitoring & Analytics

### Add Google Analytics (Optional):

1. Create GA4 property
2. Get tracking ID
3. Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🐛 Troubleshooting

### Common Issues:

**1. CSS Not Loading**
- Check file paths (case-sensitive on Linux servers)
- Verify files uploaded correctly
- Clear browser cache

**2. Charts Not Showing**
- Check browser console for errors
- Verify Chart.js CDN is accessible
- Ensure CSV files are in `/data/` folder

**3. 404 Errors**
- Check file paths in HTML
- Verify all files uploaded
- Check server configuration

**4. Slow Loading**
- Enable CDN (most platforms do automatically)
- Compress images
- Minify CSS/JS

### Getting Help:

- **Replit:** Community forums
- **GitHub Pages:** GitHub Discussions
- **Netlify:** Support chat (free tier)
- **Vercel:** Community Discord

---

## ✅ Deployment Checklist

Before going live:

- [ ] All files uploaded
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] All links working
- [ ] All downloads working
- [ ] Charts displaying correctly
- [ ] Data loading properly
- [ ] No console errors
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] Analytics added (if desired)
- [ ] Social media meta tags added (if desired)

---

## 🎉 Post-Deployment

### Share Your Site:

1. **Social Media**
   - Twitter/X
   - LinkedIn
   - Reddit (r/dataisbeautiful, r/politics)
   - Facebook

2. **Academic Communities**
   - ResearchGate
   - Academia.edu
   - University forums

3. **Advocacy Groups**
   - Criminal justice reform organizations
   - Policy research institutes
   - Journalism outlets

### Maintain Your Site:

1. **Update Data**
   - Check for new statistics quarterly
   - Update CSV files as needed
   - Regenerate reports

2. **Monitor Performance**
   - Check uptime
   - Review analytics
   - Fix broken links

3. **Gather Feedback**
   - Add contact form
   - Monitor comments
   - Iterate based on usage

---

## 📞 Support

For deployment issues:
- Check platform documentation
- Search community forums
- Open GitHub issue (if open-sourced)

---

**Good luck with your deployment! 🚀**

**Remember:** The goal is to make this critical data accessible to researchers, policymakers, journalists, and the public. Every deployment brings us closer to evidence-based criminal justice reform.
