# Library Management System - Frontend

A modern, beautiful frontend for the Library Management System built with React, Three.js, and GSAP animations.

## 🚀 Features

- **Beautiful UI/UX**: Glass-morphism design with smooth GSAP animations
- **3D Spaceship Background**: Interactive Three.js scene with animated spaceship
- **Authentication**: Complete login and registration flow
- **Form Validation**: React Hook Form with comprehensive validation
- **State Management**: Zustand for clean state management
- **API Integration**: Axios with interceptors for token refresh
- **Toast Notifications**: React Hot Toast for user feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: PropTypes and ESLint configuration

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── SpaceshipBackground.jsx  # Three.js 3D scene
│   │   ├── Input.jsx               # Form input component
│   │   └── Button.jsx              # Button component
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx
│   ├── services/           # API services
│   │   ├── api.js
│   │   └── authService.js
│   ├── store/              # Zustand stores
│   │   └── authStore.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design Principles

### Clean Code
- Component-based architecture
- Separation of concerns
- DRY (Don't Repeat Yourself)
- Consistent naming conventions

### User Experience
- Smooth GSAP animations
- Loading states
- Error handling
- Toast notifications
- Form validation feedback

### Performance
- Code splitting
- Lazy loading
- Optimized re-renders
- Efficient state management

## 🔐 Authentication Flow

1. **Login**: User enters credentials → API validates → Token stored → Redirect to dashboard
2. **Register**: User fills form → Validation → API creates account → Redirect to login
3. **Token Refresh**: Automatic token refresh using refresh token
4. **Logout**: Clear tokens → Redirect to login

## 📡 API Integration

The frontend connects to the backend API with:
- **Base URL**: `http://localhost:8080/api`
- **Login**: POST `/auth/login`
- **Register**: POST `/auth/register`
- **Refresh Token**: POST `/auth/refresh-token`
- **Logout**: POST `/auth/logout`

## 🎭 Animations

### GSAP Animations
- Page entrance animations
- Form element stagger
- Error shake effects
- Exit transitions
- Smooth micro-interactions

### Three.js Scene
- Animated spaceship with floating effect
- Rotating star field
- Dynamic particle system
- Responsive camera positioning

## 🎯 Form Validation

### Login
- Email: Required, valid format
- Password: Required, min 8 characters

### Register
- Username: Required, min 3 characters
- Email: Required, valid format
- First Name: Required
- Last Name: Required
- Phone: Required, Philippine format (09XXXXXXXXX)
- Password: Required, min 8 chars, uppercase, lowercase, number, special char
- Confirm Password: Must match password
- Terms: Required acceptance

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📦 Build

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 🧪 Testing

```bash
npm run lint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### Animations
Modify GSAP timelines in page components.

### 3D Scene
Customize the spaceship and particles in `SpaceshipBackground.jsx`.

## 🔧 Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_API_URL=http://localhost:8080/api
```

## 📝 License

This project is part of the Library Management System.

## 👨‍💻 Development

Built with:
- React 18.3
- Vite 5.1
- Three.js 0.162
- GSAP 3.12
- Tailwind CSS 3.4
- React Router 6.22
- Zustand 4.5
- React Hook Form 7.50
- Axios 1.6

---

**Note**: Ensure the backend server is running before starting the frontend development server.
