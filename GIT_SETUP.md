# 🚀 GIT SETUP FOR VERCEL DEPLOYMENT

Git is not currently installed. Here are your options:

---

## Option 1: Quick Manual Installation (Recommended)

### Step 1: Download Git Installer
1. Go to **https://git-scm.com/download/win**
2. Click "Click here to download" (64-bit)
3. Run the installer
4. Use default options
5. Finish installation

### Step 2: Restart PowerShell
```powershell
# Close PowerShell completely
# Open new PowerShell window
```

### Step 3: Verify Installation
```powershell
git --version
# Should show: git version 2.xx.x
```

### Step 4: Setup Git Configuration
```powershell
# Configure your name and email (required for commits)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Example:
git config --global user.name "Chandana"
git config --global user.email "chandana809@github.com"
```

---

## Option 2: Use Alternative (If Git Won't Install)

If you can't install Git locally, you can upload directly to GitHub via Web:

### Steps:
1. Go to https://github.com/chandana809/pe
2. Click "Add file" → "Upload files"
3. Drag and drop your `pe` folder
4. Add commit message
5. Click "Commit changes"

---

## Option 3: Continue Without Git (For Now)

You can **deploy to Vercel without local Git** by:

1. **Upload to GitHub via Website**
   - Go to GitHub → Create new repository
   - Upload your files directly
   
2. **Or Use GitHub Desktop**
   - Download: https://desktop.github.com
   - GUI-based, easier than command line
   - Push your code in 3 clicks

---

## After Installation: Deploy to Vercel

Once Git is installed OR code is on GitHub, deploy:

### Deploy Backend to Railway
```powershell
# Go to https://railway.app
# New Project → Deploy from GitHub
# Select yourself/pe repository
# Set root directory: backend
# Done!
```

### Deploy Frontend to Vercel
```powershell
# Go to https://vercel.com
# New Project → Import Git Repository
# Select your repository
# Set root directory: frontend
# Add environment: VITE_API_URL=<railway-backend-url>
# Done!
```

---

## Test After Installation

```powershell
# Verify Git
git --version

# Check GitHub connection
ssh -T git@github.com

# Or check HTTPS
git clone https://github.com/YOUR_USERNAME/test-repo.git
```

---

## What to Do Next

**Choose one:**

1. **Install Git** (5 min) → Push via command line
   - Follow Option 1 above
   - Then run deployment commands

2. **Use GitHub Web UI** (2 min) → Skip Git entirely
   - Go to GitHub
   - Upload files
   - Deploy from GitHub via Vercel

3. **Use GitHub Desktop** (5 min) → GUI alternative
   - Download GitHub Desktop
   - Open your folder
   - Push with clicks, not commands

---

## Recommended Path

1. ✅ Install Git from https://git-scm.com/download/win
2. ✅ Restart PowerShell
3. ✅ Run:
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   git init
   git add .
   git remote add origin https://github.com/chandana809/pe.git
   git branch -M main
   git push -u origin main
   ```
4. ✅ Then deploy via Vercel & Railway

---

## Common Issues

### "Git still not recognized after install"
- Restart PowerShell completely
- Or restart computer
- Or use GitHub Desktop instead

### "Permission denied when pushing"
- Generate GitHub token: https://github.com/settings/tokens
- Use token instead of password
- Or use SSH key setup

### "Remote already exists"
- Run: `git remote remove origin`
- Then add again

---

## Quick Links

| Task | Link |
|------|------|
| Download Git | https://git-scm.com/download/win |
| GitHub Desktop | https://desktop.github.com |
| GitHub Token | https://github.com/settings/tokens |
| SSH Setup | https://docs.github.com/en/authentication/connecting-to-github-with-ssh |

---

**Choose your method above and let me know when ready to deploy!**
