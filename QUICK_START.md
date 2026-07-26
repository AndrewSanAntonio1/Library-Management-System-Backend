# ⚡ Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites
- ✅ Node.js 18+
- ✅ Java 17+ (for backend)
- ✅ Gradle (included in project)

---

## 📦 Step 1: Start Backend (Terminal 1)

```bash
cd LibraryManagementSystem
./gradlew bootRun
```

**Wait for:** `Started LibraryManagementSystemApplication in X.XXX seconds`

Backend running on: `http://localhost:8080`

---

## 🎨 Step 2: Start Frontend (Terminal 2)

```bash
cd Frontend
npm install       # First time only
npm run dev
```

Frontend running on: `http://localhost:3000`

---

## 🧪 Step 3: Test It Out

### Register New User
1. Open: `http://localhost:3000/register`
2. Fill form:
   ```
   Username:        testuser
   Email:           test@example.com
   First Name:      Test
   Last Name:       User
   Phone:           09123456789
   Password:        Test@1234
   Confirm:         Test@1234
   [✓] Terms
   ```
3. Click **Create Account**
4. See success notification → Redirects to login

### Login
1. Enter credentials:
   ```
   Email:    test@example.com
   Password: Test@1234
   ```
2. Click **Sign In**
3. Welcome message → Dashboard

---

## 🎯 What You'll See

### Visual Features
- ✨ Animated 3D spaceship floating in space
- ⭐ 7000 twinkling stars
- 🌌 Space particles and nebula clouds
- 🚀 Pulsating engine glow
- 🎬 Smooth GSAP animations
- 💎 Glass-morphism design

### Interactive Features
- 🔐 Password visibility toggle
- ✅ Real-time form validation
- 🔔 Toast notifications
- 📱 Fully responsive
- ⌨️ Keyboard navigation
- ♿ Accessibility compliant

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [IMPLEMENTATION_GUIDE.md](Frontend/IMPLEMENTATION_GUIDE.md) | Complete technical documentation |
| [TESTING_GUIDE.md](Frontend/TESTING_GUIDE.md) | Testing procedures & scenarios |
| [FEATURES_SHOWCASE.md](Frontend/FEATURES_SHOWCASE.md) | Visual design & animations |
| [SETUP_INSTRUCTIONS.md](Frontend/SETUP_INSTRUCTIONS.md) | Detailed setup guide |

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Change port in application.properties
server.port=8081
```

**Problem:** Database connection error
```bash
# Check application.properties
# Ensure H2/PostgreSQL is configured
```

### Frontend Issues

**Problem:** Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Problem:** Port 3000 in use
```bash
# Edit vite.config.js
server: { port: 3001 }
```

**Problem:** Can't connect to backend
```
✓ Backend running on port 8080?
✓ Check vite.config.js proxy
✓ Look for CORS errors in console
```

---

## 🎨 Customize

### Change Colors
Edit `Frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#yourcolor',
  }
}
```

### Adjust Spaceship
Edit `Frontend/src/components/SpaceshipBackground.jsx`:
```javascript
// Reduce particles for better performance
const count = 500  // instead of 1500

// Change spaceship position
position={[5, 0, 0]}  // move right
```

### Modify Animations
Edit page files, change GSAP settings:
```javascript
gsap.from(element, {
  duration: 1,     // Animation speed
  delay: 0.5,      // Start delay
  ease: 'power3'   // Easing function
})
```

---

## 📊 Project Structure

```
Library-Management-System/
├── LibraryManagementSystem/    # Backend (Spring Boot)
│   ├── src/main/java/...
│   └── build.gradle
│
├── Frontend/                    # Frontend (React)
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API layer
│   │   └── store/             # State management
│   └── package.json
│
└── Documentation files
```

---

## 🎯 Next Steps

After setup is working:

1. ✅ Explore the documentation
2. ✅ Test all features
3. ✅ Try mobile responsive design
4. ✅ Check accessibility (keyboard nav)
5. ✅ Read TESTING_GUIDE.md
6. ✅ Plan your dashboard features

---

## 💡 Pro Tips

### Development
```bash
# Backend hot reload (Spring DevTools enabled)
# Frontend hot reload (Vite default)
# Edit files → See changes instantly
```

### Debugging
```javascript
// Enable dev mode logging
console.log('Auth state:', useAuthStore.getState())
console.log('API response:', response.data)
```

### Performance
```javascript
// Check FPS (Press F12 → Performance)
// Target: 60fps desktop, 30fps mobile
// Reduce particles if needed
```

---

## 📞 Need Help?

### Common Commands

**Backend:**
```bash
./gradlew clean build      # Build project
./gradlew bootRun         # Run application
./gradlew test           # Run tests
```

**Frontend:**
```bash
npm run dev              # Development mode
npm run build           # Production build
npm run preview         # Preview build
npm run lint           # Check code quality
```

### Check Everything Works

**Backend Health:**
```bash
curl http://localhost:8080/api/auth/login
# Should return 400 (missing credentials) = working
```

**Frontend Health:**
```
Open http://localhost:3000
# See spaceship and login form = working
```

---

## 🏆 Success Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can login successfully
- [ ] See spaceship animation
- [ ] Forms validate correctly
- [ ] Toast notifications appear
- [ ] Responsive on mobile
- [ ] No console errors

---

## 🚀 You're Ready!

Everything should be working now. Enjoy your beautiful Library Management System!

**Happy Coding! 🎉**

---

**Quick Links:**
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Register: http://localhost:3000/register
- Login: http://localhost:3000/login
