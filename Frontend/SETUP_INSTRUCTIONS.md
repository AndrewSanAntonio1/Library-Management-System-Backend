# 🚀 Quick Setup Instructions

## Prerequisites
- ✅ Node.js 18+ installed
- ✅ npm or yarn installed
- ✅ Backend running on `http://localhost:8080`

---

## Step 1: Install Dependencies

Open terminal in the `Frontend` folder and run:

```bash
npm install
```

This will install all required packages:
- react & react-dom (18.3.1)
- react-router-dom (6.22.0)
- three (0.162.0)
- @react-three/fiber (8.15.19)
- @react-three/drei (9.99.5)
- gsap (3.12.5)
- axios (1.6.7)
- zustand (4.5.1)
- react-hook-form (7.50.1)
- react-hot-toast (2.4.1)
- lucide-react (0.344.0)
- tailwindcss, postcss, autoprefixer

---

## Step 2: Start Development Server

```bash
npm run dev
```

The application will start on: **http://localhost:3000**

---

## Step 3: Verify Backend Connection

1. Ensure your Spring Boot backend is running:
   ```bash
   cd LibraryManagementSystem
   ./gradlew bootRun
   ```

2. Backend should be accessible at: **http://localhost:8080**

3. Test the connection by trying to register a new user

---

## Step 4: Test the Application

### Register a New User
1. Go to: http://localhost:3000/register
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - First Name: `Test`
   - Last Name: `User`
   - Phone: `09123456789`
   - Password: `Test@1234`
   - Confirm Password: `Test@1234`
   - Check the Terms box
3. Click "Create Account"
4. You should see a success message and be redirected to login

### Login
1. Go to: http://localhost:3000/login
2. Enter:
   - Email: `test@example.com`
   - Password: `Test@1234`
3. Click "Sign In"
4. You should be redirected to the dashboard

---

## Troubleshooting

### Issue: Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Port 3000 already in use
```bash
# Change port in vite.config.js
server: {
  port: 3001,  // Change to any available port
}
```

### Issue: Backend connection error
- Verify backend is running on port 8080
- Check `vite.config.js` proxy configuration
- Check for CORS errors in browser console

### Issue: Three.js performance problems
- Reduce particle count in `SpaceshipBackground.jsx`
- Lower star count
- Disable auto-rotate on low-end devices

---

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

To preview production build:
```bash
npm run preview
```

---

## Environment Variables (Optional)

Create a `.env` file in the Frontend folder:

```env
VITE_API_URL=http://localhost:8080/api
```

Then use in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api'
```

---

## Scripts Available

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Folder Structure After Setup

```
Frontend/
├── node_modules/           # Installed dependencies
├── public/                 # Static assets
├── src/
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── store/            # State management
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. ✅ Test registration
4. ✅ Test login
5. 📖 Read [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for details
6. 🧪 Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing

---

**🎉 You're all set! Enjoy your beautiful Library Management System!**
