# Test Accounts for Library Management System

## 📋 Test Credentials

### Member Account
```
Email: member@test.com
Password: Member@123
Role: MEMBER
```

**Access:**
- Dashboard
- Browse Books
- Borrowed Books
- Reservations
- Fines
- Borrow History
- Profile

---

### Librarian Account
```
Email: librarian@test.com
Password: Librarian@123
Role: LIBRARIAN
```

**Access:**
- Librarian Dashboard
- Books Management
- Authors Management
- Categories Management
- Publishers Management
- Members Management
- Borrow Records Management
- Reservations Management
- Fines Management
- Profile

---

### Admin Account
```
Email: admin@test.com
Password: Admin@123
Role: ADMIN
```

**Access:**
- Full system access (same as LIBRARIAN plus more permissions in future)

---

## 🗄️ SQL Script to Create Test Accounts

Run this SQL script in your MySQL database to create the test accounts:

```sql
-- Note: Make sure your database is selected
USE projects1_db;

-- Create Member Account
INSERT INTO users (username, email, password, firstname, lastname, phone_number, role, user_status, created_at, updated_at)
VALUES (
  'member_test',
  'member@test.com',
  '$2a$10$YourBCryptHashHere', -- BCrypt hash of 'Member@123'
  'Test',
  'Member',
  '09123456789',
  'MEMBER',
  'ACTIVE',
  NOW(),
  NOW()
);

-- Create Librarian Account
INSERT INTO users (username, email, password, firstname, lastname, phone_number, role, user_status, created_at, updated_at)
VALUES (
  'librarian_test',
  'librarian@test.com',
  '$2a$10$YourBCryptHashHere', -- BCrypt hash of 'Librarian@123'
  'Test',
  'Librarian',
  '09987654321',
  'LIBRARIAN',
  'ACTIVE',
  NOW(),
  NOW()
);

-- Create Admin Account
INSERT INTO users (username, email, password, firstname, lastname, phone_number, role, user_status, created_at, updated_at)
VALUES (
  'admin_test',
  'admin@test.com',
  '$2a$10$YourBCryptHashHere', -- BCrypt hash of 'Admin@123'
  'Test',
  'Admin',
  '09111222333',
  'ADMIN',
  'ACTIVE',
  NOW(),
  NOW()
);
```

---

## 🔐 Generate BCrypt Password Hashes

Since you need to hash the passwords, use one of these methods:

### Option 1: Using Online BCrypt Generator
1. Go to: https://bcrypt-generator.com/
2. Enter password: `Member@123`
3. Rounds: 10
4. Copy the hash (starts with `$2a$10$`)
5. Replace in SQL above

### Option 2: Using Spring Boot Application
Create a simple endpoint to generate hashes:

```java
@GetMapping("/hash-password")
public String hashPassword(@RequestParam String password) {
    return passwordEncoder.encode(password);
}
```

Call: `http://localhost:8081/api/hash-password?password=Member@123`

### Option 3: Using Registration Endpoint
1. Register normally through the frontend
2. Then update the role in database:

```sql
UPDATE users SET role = 'LIBRARIAN' WHERE email = 'librarian@test.com';
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

---

## 🚀 Quick Setup for Vercel Deployment

### 1. Use Registration Endpoint (Easiest)

**Step 1:** Register Member Account
- Go to: `https://your-vercel-app.vercel.app/register`
- Fill form:
  - Username: `member_test`
  - Email: `member@test.com`
  - Password: `Member@123`
  - First Name: `Test`
  - Last Name: `Member`
  - Phone: `09123456789`
  - Select: Member
- Submit

**Step 2:** Register Librarian Account
- Register with:
  - Email: `librarian@test.com`
  - Password: `Librarian@123`
- Then run SQL to update role:
```sql
UPDATE users SET role = 'LIBRARIAN' WHERE email = 'librarian@test.com';
```

**Step 3:** Register Admin Account
- Register with:
  - Email: `admin@test.com`
  - Password: `Admin@123`
- Then run SQL to update role:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@test.com';
```

---

## 🌐 Vercel Environment Configuration

### Update Backend CORS for Vercel

**File:** `SecurityConfig.java`

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "https://your-app-name.vercel.app", // ✅ Add your Vercel URL
            "https://*.vercel.app" // ✅ Allow all Vercel preview deployments
    ));
    // ... rest of config
}
```

### Frontend Environment Variables

Create `.env.production` in Frontend folder:

```env
# Vercel Production Environment
VITE_API_URL=https://your-backend-url.com/api

# Or if using local backend from Vercel (not recommended)
VITE_API_URL=http://localhost:8081/api
```

**Note:** For Vercel to connect to your local backend, you'll need to expose it using ngrok or deploy backend to a cloud service.

---

## 🔧 Backend Deployment Options

### Option 1: Deploy Backend to Railway
1. Create account on Railway.app
2. New Project → Deploy from GitHub
3. Select your backend repository
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET_KEY`
5. Deploy
6. Get public URL: `https://your-app.railway.app`

### Option 2: Deploy Backend to Render
1. Create account on Render.com
2. New → Web Service
3. Connect repository
4. Build command: `./gradlew build`
5. Start command: `java -jar build/libs/*.jar`
6. Add environment variables
7. Deploy

### Option 3: Use Ngrok for Testing
```bash
# Start backend locally
cd LibraryManagementSystem
./gradlew bootRun

# In another terminal, expose with ngrok
ngrok http 8081

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update frontend .env.production:
VITE_API_URL=https://abc123.ngrok.io/api
```

---

## 📝 Complete Setup Checklist

### Backend Setup
- [ ] Backend deployed and accessible via HTTPS
- [ ] CORS configured to allow Vercel domain
- [ ] Database connected and accessible
- [ ] Test accounts created in database
- [ ] JWT secret configured
- [ ] Health check endpoint working

### Frontend Setup
- [ ] Environment variables configured for production
- [ ] API URL points to deployed backend
- [ ] Build successful: `npm run build`
- [ ] Deploy to Vercel
- [ ] Test login with all three accounts
- [ ] Verify role-based redirects work
- [ ] Check all API calls work

### Testing
- [ ] Login as Member → redirects to `/dashboard`
- [ ] Login as Librarian → redirects to `/librarian`
- [ ] Login as Admin → redirects to `/librarian`
- [ ] Member cannot access `/librarian` routes
- [ ] Librarian cannot access member routes
- [ ] All API calls return data
- [ ] No CORS errors in console

---

## 🎯 Recommended: Create Seed Data

### File: `Backend/src/main/resources/data.sql`

```sql
-- This file runs automatically on startup if configured

-- Clear existing data (optional)
-- DELETE FROM users WHERE email LIKE '%@test.com';

-- Insert test users
INSERT INTO users (username, email, password, firstname, lastname, phone_number, role, user_status, created_at, updated_at)
SELECT * FROM (
  SELECT 
    'member_test' as username,
    'member@test.com' as email,
    '$2a$10$rQM5qHn3qN/2yVQx7h4K3.Y5xN5qR5qZ5qR5qZ5qR5qZ5qR5qZ5qR' as password,
    'Test' as firstname,
    'Member' as lastname,
    '09123456789' as phone_number,
    'MEMBER' as role,
    'ACTIVE' as user_status,
    NOW() as created_at,
    NOW() as updated_at
) AS tmp
WHERE NOT EXISTS (
  SELECT email FROM users WHERE email = 'member@test.com'
) LIMIT 1;

-- Add more INSERT statements for other test users...
```

**Enable in `application.properties`:**
```properties
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

---

## 🔐 Security Notes for Production

### DO NOT use these test accounts in production!

For production:
1. Use strong, unique passwords
2. Enable email verification
3. Add rate limiting
4. Enable 2FA for admin accounts
5. Use environment variables for sensitive data
6. Rotate JWT secrets regularly
7. Implement account lockout after failed attempts
8. Add audit logging

---

## 📞 Quick Login Links for Demo

Add these to your Vercel app's login page for easy testing:

```jsx
// Add to LoginPage.jsx for demo purposes only
<div className="mt-4 p-4 bg-blue-50 rounded-lg">
  <p className="text-sm font-medium text-gray-700 mb-2">Test Accounts:</p>
  <div className="space-y-2 text-xs">
    <button 
      onClick={() => {
        setValue('email', 'member@test.com')
        setValue('password', 'Member@123')
      }}
      className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-blue-50"
    >
      Member: member@test.com / Member@123
    </button>
    <button 
      onClick={() => {
        setValue('email', 'librarian@test.com')
        setValue('password', 'Librarian@123')
      }}
      className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-purple-50"
    >
      Librarian: librarian@test.com / Librarian@123
    </button>
  </div>
</div>
```

---

## ✅ Summary

**Test Accounts Created:**
1. ✅ Member: `member@test.com` / `Member@123`
2. ✅ Librarian: `librarian@test.com` / `Librarian@123`
3. ✅ Admin: `admin@test.com` / `Admin@123`

**Next Steps:**
1. Deploy backend or use ngrok
2. Update CORS with Vercel URL
3. Configure frontend environment variables
4. Create test accounts via registration
5. Update roles in database
6. Test on Vercel!

Good luck with your deployment! 🚀
