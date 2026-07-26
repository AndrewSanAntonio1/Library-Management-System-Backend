# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd Frontend
npm install
```

## Step 2: Start Backend

Make sure your Spring Boot backend is running on `http://localhost:8080`

```bash
cd ../LibraryManagementSystem
./gradlew bootRun
```

## Step 3: Start Frontend

In a new terminal:

```bash
cd Frontend
npm run dev
```

## Step 4: Open Browser

Navigate to `http://localhost:3000`

## 🎯 Test Credentials

After registration, use your created credentials to login.

### Default Test Account (if seeded)
- Email: `admin@library.com`
- Password: `Admin@123`

## 🐛 Troubleshooting

### Backend Connection Issues

If you see CORS errors or connection refused:

1. Ensure backend is running on port 8080
2. Check if CORS is configured in backend
3. Verify the proxy settings in `vite.config.js`

### Port Already in Use

If port 3000 is taken:

```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## 📋 Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Backend running on port 8080
- [ ] Database connected (MySQL)
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] No port conflicts
- [ ] Browser DevTools shows no CORS errors

## 🎨 Features to Test

1. **Registration**
   - Try valid registration
   - Test form validations
   - Check password requirements
   - Verify Philippine phone format

2. **Login**
   - Login with created account
   - Test "Remember me"
   - Check error messages

3. **Dashboard**
   - Verify user info displays
   - Check role-based UI
   - Test logout functionality

4. **Animations**
   - Watch page transitions
   - Check spaceship animation
   - Observe form animations

## 🌟 Next Steps

After successful setup:

1. Explore the 3D spaceship background
2. Test all form validations
3. Check responsive design on mobile
4. Review console for any errors
5. Start building additional features!

## 📚 Resources

- [React Documentation](https://react.dev)
- [Three.js Docs](https://threejs.org/docs)
- [GSAP Documentation](https://greensock.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy Coding! 🎉**
