# Start Servers - Quick Guide

## 🚀 One-Time Setup

### 1. Database Setup (MySQL)

**Start MySQL:**
```bash
# macOS/Linux
sudo service mysql start

# Windows
net start MySQL
```

**Create Database:**
```sql
CREATE DATABASE IF NOT EXISTS projects1_db;
USE projects1_db;
```

---

## ▶️ Start Backend (Terminal 1)

```bash
cd LibraryManagementSystem
./gradlew bootRun
```

**Wait for:**
```
Started LibraryManagementSystemApplication in X.XXX seconds
Tomcat started on port(s): 8081 (http)
```

**Verify backend is running:**
```bash
curl http://localhost:8081/api/books
```

Should return: `[]` (empty array if no books)

---

## ▶️ Start Frontend (Terminal 2)

```bash
cd Frontend
npm run dev
```

**Wait for:**
```
VITE v5.1.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

**Open browser:** `http://localhost:5173`

---

## ✅ Verify Everything Works

### Test 1: Registration
1. Navigate to: `http://localhost:5173/register`
2. Fill form:
   - Username: `testuser123`
   - Email: `test@example.com`
   - Password: `Test@1234`
   - First Name: `Test`
   - Last Name: `User`
   - Phone: `09123456789`
   - Select role: `Member`
   - Check terms
3. Click "Create Account"
4. ✅ Should see success toast and redirect to login

### Test 2: Login
1. Navigate to: `http://localhost:5173/login`
2. Enter credentials from registration
3. Click "Sign In"
4. ✅ Should redirect to dashboard

### Test 3: Browse Books
1. Navigate to: `http://localhost:5173/browse-books`
2. ✅ Should load without errors (empty if no books)

---

## 🛑 Stop Servers

**Backend:**
- Press `Ctrl+C` in Terminal 1

**Frontend:**
- Press `Ctrl+C` in Terminal 2

---

## 🐛 Troubleshooting

### Backend won't start

**Error: Port 8081 already in use**
```bash
# Find process using port 8081
lsof -i :8081  # macOS/Linux
netstat -ano | findstr :8081  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Error: Database connection failed**
```bash
# Check MySQL is running
sudo service mysql status  # macOS/Linux
sc query MySQL  # Windows

# Check database exists
mysql -u root -p
> SHOW DATABASES;
> CREATE DATABASE IF NOT EXISTS projects1_db;
```

---

### Frontend won't start

**Error: Port 5173 already in use**
```bash
# Find and kill process on port 5173
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

**Error: Module not found**
```bash
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

---

### ECONNREFUSED Error

**If you see:**
```
[vite] http proxy error: /api/auth/register
Error: connect ECONNREFUSED 127.0.0.1:8081
```

**Solutions:**
1. Backend not running → Start backend first
2. Wrong port → Check `vite.config.js` has `target: 'http://localhost:8081'`
3. Firewall blocking → Allow port 8081

---

## 📊 Port Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5173 | http://localhost:5173 |
| Backend (Spring Boot) | 8081 | http://localhost:8081 |
| Database (MySQL) | 3306 | localhost:3306 |

---

## 🎯 Quick Health Check

**Backend health:**
```bash
curl http://localhost:8081/api/books
```
✅ Returns JSON → Backend is healthy

**Frontend health:**
```bash
curl http://localhost:5173
```
✅ Returns HTML → Frontend is serving

---

## 📝 Configuration Files

**Backend Port:** `LibraryManagementSystem/src/main/resources/application.properties`
```properties
server.port=8081
```

**Frontend Proxy:** `Frontend/vite.config.js`
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8081',
    changeOrigin: true,
    secure: false,
  }
}
```

**Database:** `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/projects1_db
spring.datasource.username=root
spring.datasource.password=admin
```

---

## 🚀 Ready to Go!

Now you're ready to develop:
1. ✅ Backend running on port 8081
2. ✅ Frontend running on port 5173
3. ✅ Database connected
4. ✅ CORS enabled
5. ✅ Proxy configured correctly
6. ✅ No ECONNREFUSED errors

**Happy coding! 🎉**
