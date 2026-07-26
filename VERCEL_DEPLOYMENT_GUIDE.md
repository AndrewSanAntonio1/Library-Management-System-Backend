# Vercel Deployment Guide for Library Management System

## 🚀 Quick Deployment Steps

### Step 1: Deploy Frontend to Vercel

#### A. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `Frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

#### B. Add Environment Variables in Vercel

Go to Project Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=Library Management System
VITE_APP_VERSION=1.0.0
```

**Important:** You need to deploy your backend first to get the API URL!

#### C. Deploy

Click "Deploy" and wait for build to complete.

---

### Step 2: Deploy Backend (Choose One Option)

#### Option 1: Railway (Recommended)

**Pros:** Free tier, easy setup, automatic HTTPS, MySQL database included

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repository
6. Railway will auto-detect Spring Boot
7. Add these environment variables:
   ```
   PORT=8080
   SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/projects1_db
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=your-password
   JWT_SECRET_KEY=your-jwt-secret
   ```
8. Railway will provide a public URL: `https://your-app.railway.app`
9. **Copy this URL** and update Vercel environment variable

**Add MySQL Database on Railway:**
1. In same project, click "New"
2. Select "Database" → "MySQL"
3. Railway creates database automatically
4. Copy connection details to your environment variables

#### Option 2: Render

**Pros:** Free tier, easy setup, automatic HTTPS

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. New → Web Service
4. Connect your repository
5. Configure:
   - **Name:** library-management-backend
   - **Root Directory:** `LibraryManagementSystem`
   - **Environment:** Java
   - **Build Command:** `./gradlew build`
   - **Start Command:** `java -jar build/libs/*.jar`
6. Add environment variables (same as Railway)
7. Create
8. Copy public URL

**Add MySQL Database on Render:**
1. New → PostgreSQL (or use external MySQL service)
2. For MySQL, use PlanetScale or Railway

#### Option 3: Ngrok (For Testing Only)

**Use this only for testing Vercel with your local backend!**

```bash
# Terminal 1: Start backend
cd LibraryManagementSystem
./gradlew bootRun

# Terminal 2: Start ngrok
ngrok http 8081

# Copy the https URL from ngrok
# Example: https://abc123.ngrok-free.app
```

**Update Vercel Environment Variable:**
```env
VITE_API_URL=https://abc123.ngrok-free.app/api
```

**Note:** Ngrok URL changes every time you restart it (unless you have paid plan).

---

### Step 3: Update CORS Configuration

#### Backend: SecurityConfig.java

Already updated to allow Vercel:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://*.vercel.app" // ✅ Allows all Vercel deployments
));
```

**For specific Vercel URL only:**

```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://your-app-name.vercel.app",
    "https://*.vercel.app" // Preview deployments
));
```

---

### Step 4: Create Test Accounts

#### Option A: Using SQL (if you have database access)

```sql
-- Use BCrypt hash generator: https://bcrypt-generator.com/
-- Password: Member@123 (with 10 rounds)

INSERT INTO users (username, email, password, firstname, lastname, phone_number, role, user_status, created_at, updated_at)
VALUES 
('member_test', 'member@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye...', 'Test', 'Member', '09123456789', 'MEMBER', 'ACTIVE', NOW(), NOW()),
('librarian_test', 'librarian@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye...', 'Test', 'Librarian', '09987654321', 'LIBRARIAN', 'ACTIVE', NOW(), NOW()),
('admin_test', 'admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye...', 'Test', 'Admin', '09111222333', 'ADMIN', 'ACTIVE', NOW(), NOW());
```

#### Option B: Register via Frontend then Update Role

1. Go to your Vercel app: `https://your-app.vercel.app/register`
2. Register with:
   - Email: `member@test.com`
   - Password: `Member@123`
   - Other required fields
3. Register another user:
   - Email: `librarian@test.com`
   - Password: `Librarian@123`
4. Update role in database:
   ```sql
   UPDATE users SET role = 'LIBRARIAN' WHERE email = 'librarian@test.com';
   ```

---

## 🧪 Testing Your Deployment

### 1. Test Frontend Access

Visit your Vercel URL: `https://your-app.vercel.app`

**Checklist:**
- [ ] Page loads without errors
- [ ] SpaceshipBackground animation works
- [ ] Login page displays correctly
- [ ] Register page displays correctly

### 2. Test API Connection

Open browser DevTools (F12) → Console

**Try login:**
- Email: `member@test.com`
- Password: `Member@123`

**Check Network tab:**
- [ ] POST request to `/api/auth/login`
- [ ] Status: 200 OK (not CORS error, not 404)
- [ ] Response contains: `accessToken`, `role`, `username`

**If you see CORS error:**
- Backend CORS not configured correctly
- Vercel URL not in allowed origins
- Backend not accessible

**If you see 404:**
- Backend not running
- API URL incorrect in Vercel environment variables

### 3. Test Authentication Flow

**Test Member Login:**
- [ ] Login with member@test.com
- [ ] Redirects to `/dashboard`
- [ ] Sidebar shows member menu
- [ ] Can navigate to Browse Books

**Test Librarian Login:**
- [ ] Login with librarian@test.com  
- [ ] Redirects to `/librarian`
- [ ] Sidebar shows librarian menu
- [ ] Can navigate to Books Management

### 4. Test Role-Based Access

**As Member:**
- [ ] Try to access `/librarian` → Should redirect to `/dashboard`
- [ ] See "Access denied" toast

**As Librarian:**
- [ ] Try to access `/dashboard` → Should redirect to `/librarian`
- [ ] See "Access denied" toast

---

## 🔧 Troubleshooting

### Issue 1: "Failed to fetch" or CORS Error

**Symptoms:**
```
Access to fetch at 'https://backend.com/api/auth/login' from origin 'https://app.vercel.app' 
has been blocked by CORS policy
```

**Solutions:**
1. ✅ Check backend CORS configuration includes Vercel URL
2. ✅ Restart backend after updating CORS
3. ✅ Verify backend is accessible (test in Postman)
4. ✅ Check environment variable `VITE_API_URL` in Vercel

### Issue 2: "404 Not Found" on API Calls

**Symptoms:**
```
POST https://backend.com/api/auth/login 404 (Not Found)
```

**Solutions:**
1. ✅ Verify backend is running
2. ✅ Check API URL in Vercel environment variables
3. ✅ Test backend directly: `curl https://backend.com/api/books`
4. ✅ Ensure backend deployed successfully

### Issue 3: Login Works but Dashboard is Empty

**Symptoms:**
- Login successful
- Redirects correctly
- But no data loads (empty lists)

**Solutions:**
1. ✅ Check backend has test data
2. ✅ Verify API calls in Network tab
3. ✅ Check JWT token is being sent in requests
4. ✅ Verify backend endpoints return data

### Issue 4: Environment Variables Not Working

**Symptoms:**
- API calls go to `http://localhost:8081`
- Even though you set `VITE_API_URL`

**Solutions:**
1. ✅ Redeploy Vercel after adding environment variables
2. ✅ Ensure variable names start with `VITE_`
3. ✅ Check variable is set in Vercel dashboard
4. ✅ Clear browser cache and hard refresh

### Issue 5: Build Fails on Vercel

**Symptoms:**
```
Error: Cannot find module 'xyz'
npm ERR! code ELIFECYCLE
```

**Solutions:**
1. ✅ Check `package.json` dependencies are correct
2. ✅ Run `npm install` locally to verify
3. ✅ Ensure `Frontend` is set as root directory in Vercel
4. ✅ Check build logs for specific error

---

## 📝 Vercel Configuration Files

### Frontend/vercel.json

Already created! Contains:
- SPA routing configuration (redirects to index.html)
- CORS headers for API calls

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Frontend/.env.production

Create this file locally (don't commit to Git):

```env
VITE_API_URL=https://your-backend.railway.app/api
```

Or set in Vercel dashboard under Environment Variables.

---

## 🔐 Security Checklist for Production

### Frontend (Vercel)
- [ ] Remove test account quick-fill buttons from login page
- [ ] Set up custom domain with HTTPS
- [ ] Enable Vercel password protection (if needed)
- [ ] Configure proper environment variables
- [ ] Enable Vercel Analytics (optional)

### Backend
- [ ] Use strong JWT secret (not default)
- [ ] Enable HTTPS only (no HTTP)
- [ ] Set proper CORS origins (not `*`)
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Set up database backups
- [ ] Use strong database password
- [ ] Limit allowed origins to your Vercel domain

### Database
- [ ] Use strong passwords
- [ ] Enable SSL connections
- [ ] Set up automatic backups
- [ ] Limit access by IP if possible
- [ ] Use environment variables for credentials

---

## 📊 Deployment Architecture

```
User Browser
    ↓
Vercel (Frontend)
    - React SPA
    - Vite build
    - Environment: VITE_API_URL
    ↓
HTTPS Request to Backend
    ↓
Railway/Render (Backend)
    - Spring Boot API
    - Port: 8080/8081
    - CORS enabled for Vercel
    ↓
MySQL Database
    - Railway/PlanetScale
    - User data, books, etc.
```

---

## ✅ Final Checklist

### Backend Deployment
- [ ] Backend deployed and running
- [ ] Public URL accessible: `https://backend.com`
- [ ] CORS configured for Vercel domain
- [ ] Database connected and accessible
- [ ] Environment variables configured
- [ ] Test accounts created
- [ ] Health check: `curl https://backend.com/api/books`

### Frontend Deployment
- [ ] Pushed code to GitHub
- [ ] Connected to Vercel
- [ ] Root directory: `Frontend`
- [ ] Build command: `npm run build`
- [ ] Environment variables set: `VITE_API_URL`
- [ ] Deployed successfully
- [ ] Can access: `https://app.vercel.app`
- [ ] No build errors

### Testing
- [ ] Can access login page
- [ ] Can register new account
- [ ] Can login as Member
- [ ] Can login as Librarian
- [ ] Role-based redirects work
- [ ] Sidebar shows correct menu
- [ ] API calls work (no CORS errors)
- [ ] Data loads correctly
- [ ] Authentication persists on refresh

---

## 🎯 Test Credentials

Once deployed, share these credentials for testing:

```
Member Account:
Email: member@test.com
Password: Member@123

Librarian Account:
Email: librarian@test.com
Password: Librarian@123

Admin Account:
Email: admin@test.com
Password: Admin@123
```

---

## 🚀 You're Ready!

Your Library Management System is now deployed on Vercel!

**Share your app:**
- URL: `https://your-app.vercel.app`
- Test accounts available
- Role-based access working
- Professional UI with animations

Good luck! 🎉
