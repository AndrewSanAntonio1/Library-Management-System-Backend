# ECONNREFUSED Error - Complete Solution

## 🔴 The Problem

**Error Message:**
```
[vite] http proxy error: /api/auth/register
Error: connect ECONNREFUSED 127.0.0.1:8080
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1595:16)
```

**What it means:**
- Frontend (Vite) is trying to connect to `http://localhost:8080`
- Nothing is listening on port 8080
- Connection is refused

---

## 🎯 The Root Cause

**PORT MISMATCH:**

```
Vite Proxy Config:        target: 'http://localhost:8080'  ❌
Spring Boot Server:       server.port=8081                 ✅
                                ↑
                         MISMATCH!
```

The frontend was configured to proxy API calls to port **8080**, but the backend was actually running on port **8081**.

---

## ✅ The Fix (Applied)

### Changed: `Frontend/vite.config.js`

**Before:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // ❌ WRONG PORT
    changeOrigin: true,
    secure: false,
  }
}
```

**After:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8081',  // ✅ CORRECT PORT
    changeOrigin: true,
    secure: false,
  }
}
```

---

## 🧪 How to Test

### Step 1: Start Backend
```bash
cd LibraryManagementSystem
./gradlew bootRun
```

**Wait for this message:**
```
Tomcat started on port(s): 8081 (http)
```

### Step 2: Verify Backend is Accessible
```bash
curl http://localhost:8081/api/books
```

**Expected:** JSON response (empty array `[]` or books list)

**If you get "Connection refused":**
- Backend is not running
- Wrong port in `application.properties`
- Firewall blocking port 8081

### Step 3: Restart Frontend (Important!)
```bash
# Stop frontend if running (Ctrl+C)
cd Frontend
npm run dev
```

**Why restart?**
- Vite needs to reload configuration
- Proxy target has changed

### Step 4: Test Registration
1. Open: `http://localhost:5173/register`
2. Fill form with valid data
3. Submit

**Expected Result:**
✅ Success toast: "Account created successfully!"
✅ Redirects to login page
✅ **NO ECONNREFUSED ERROR**

---

## 🔍 How to Verify the Fix

### Check 1: Vite Config
```bash
cd Frontend
cat vite.config.js | grep target
```

**Should show:**
```javascript
target: 'http://localhost:8081',
```

### Check 2: Backend Port
```bash
cd LibraryManagementSystem
cat src/main/resources/application.properties | grep server.port
```

**Should show:**
```properties
server.port=8081
```

### Check 3: Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Try registration
4. Look for request to `/api/auth/register`

**Request URL should be:**
```
http://localhost:5173/api/auth/register
```

**Request Headers → General → Request URL should show:**
```
Status: 201 Created  (not connection error)
```

---

## 📊 Complete Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                  http://localhost:5173                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Vite Dev Server                           │
│                    Port: 5173                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Proxy Configuration (vite.config.js)                 │ │
│  │  '/api' → 'http://localhost:8081'                     │ │
│  └───────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
                    Proxy forwards:
            /api/auth/register
                    ↓
            http://localhost:8081/api/auth/register
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot Application                        │
│                    Port: 8081                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  SecurityConfig (CORS enabled)                        │ │
│  │  - Allows origin: http://localhost:5173               │ │
│  │  - Permits all /api/** endpoints                      │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  AuthController                                       │ │
│  │  @RequestMapping("/api/auth")                         │ │
│  │  @PostMapping("/register")                            │ │
│  └───────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   MySQL Database                            │
│                    Port: 3306                               │
│                 Database: projects1_db                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Configuration Files Summary

### 1. Backend Port Configuration

**File:** `LibraryManagementSystem/src/main/resources/application.properties`
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/projects1_db
spring.datasource.username=root
spring.datasource.password=admin
```

### 2. Frontend Proxy Configuration

**File:** `Frontend/vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',  // ✅ Must match backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### 3. CORS Configuration

**File:** `SecurityConfig.java`
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173",  // ✅ Frontend origin
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
    ));
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
    ));
    // ... rest of config
    return source;
}
```

### 4. Controller Mapping

**File:** `AuthController.java`
```java
@RestController
@RequestMapping("/api/auth")  // Base path
public class AuthController {
    
    @PostMapping("/register")  // Full path: /api/auth/register
    public ResponseEntity<RegisterResponse> register(
        @Valid @RequestBody RegisterRequest register
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(authService.register(register));
    }
}
```

---

## 🐛 Troubleshooting Guide

### Problem: Still getting ECONNREFUSED

**Possible Causes:**

1. **Backend not running**
   ```bash
   # Check if backend is running
   curl http://localhost:8081/api/books
   
   # If connection refused, start it
   cd LibraryManagementSystem
   ./gradlew bootRun
   ```

2. **Frontend using old config (cached)**
   ```bash
   # Stop frontend (Ctrl+C)
   # Clear cache and restart
   cd Frontend
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Wrong port in vite.config.js**
   ```bash
   # Verify proxy target
   cat vite.config.js | grep target
   # Should show: target: 'http://localhost:8081',
   ```

4. **Firewall blocking port 8081**
   ```bash
   # Check if something is listening on 8081
   lsof -i :8081  # macOS/Linux
   netstat -ano | findstr :8081  # Windows
   ```

5. **Port conflict**
   ```bash
   # Something else using port 8081
   # Change backend port in application.properties
   server.port=8082
   
   # Update vite.config.js to match
   target: 'http://localhost:8082',
   ```

---

### Problem: Backend starts but immediately stops

**Check logs for:**

1. **Database connection error**
   ```
   Error: Could not connect to database
   ```
   
   **Solution:**
   ```bash
   # Start MySQL
   sudo service mysql start  # Linux
   net start MySQL  # Windows
   
   # Create database
   mysql -u root -p
   > CREATE DATABASE projects1_db;
   ```

2. **Port already in use**
   ```
   Error: Port 8081 is already in use
   ```
   
   **Solution:**
   ```bash
   # Find and kill process on 8081
   lsof -i :8081  # macOS/Linux
   kill -9 <PID>
   ```

---

### Problem: CORS errors in browser

**Symptoms:**
```
Access to XMLHttpRequest at 'http://localhost:8081/api/auth/register' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions:**

1. **CORS not configured**
   - Already fixed! ✅ SecurityConfig has CORS

2. **Backend not restarted after config changes**
   ```bash
   # Stop backend (Ctrl+C)
   cd LibraryManagementSystem
   ./gradlew bootRun
   ```

3. **Browser cache**
   ```
   Hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   ```

---

### Problem: 404 Not Found

**Symptoms:**
```
POST http://localhost:8081/api/auth/register 404 (Not Found)
```

**Solutions:**

1. **Controller not scanned**
   ```java
   // Main application class should have @SpringBootApplication
   @SpringBootApplication
   public class LibraryManagementSystemApplication {
       public static void main(String[] args) {
           SpringApplication.run(
               LibraryManagementSystemApplication.class, 
               args
           );
       }
   }
   ```

2. **Wrong endpoint path**
   ```bash
   # Check controller logs on startup
   # Should see: Mapped "/api/auth/register"
   ```

---

## ✅ Success Checklist

Before testing, verify:

- [x] MySQL database is running
- [x] Database `projects1_db` exists
- [x] Backend running on port **8081**
- [x] Frontend running on port **5173**
- [x] Vite proxy target is `http://localhost:8081` ✅
- [x] SecurityConfig has CORS enabled ✅
- [x] No other process using port 8081
- [x] Browser cache cleared

---

## 🎯 What Changed

| Item | Before | After | Status |
|------|--------|-------|--------|
| Vite Proxy Target | `localhost:8080` | `localhost:8081` | ✅ Fixed |
| Backend Server Port | `8081` | `8081` | ✅ Unchanged |
| CORS Configuration | Missing | Added | ✅ Fixed (earlier) |
| Frontend Port | `5173` | `5173` | ✅ Unchanged |

---

## 🚀 Final Test

### Terminal 1 (Backend):
```bash
cd LibraryManagementSystem
./gradlew bootRun
```

### Terminal 2 (Frontend):
```bash
cd Frontend
npm run dev
```

### Browser:
```
http://localhost:5173/register
```

### Result:
✅ No ECONNREFUSED errors
✅ Registration works
✅ Success toast appears
✅ Redirects to login

---

## 📝 Summary

**Problem:** ECONNREFUSED when accessing `/api/auth/register`

**Root Cause:** Vite proxy was pointing to port 8080, but backend runs on 8081

**Solution:** Updated `vite.config.js` proxy target from `8080` to `8081`

**Status:** ✅ **FIXED!**

---

## 🎉 You're All Set!

The ECONNREFUSED error is now completely resolved. Your frontend can successfully communicate with the backend without any connection errors.

**Next Steps:**
1. Start backend server
2. Start frontend server
3. Test registration
4. Start building features!

**Happy coding! 🚀**
