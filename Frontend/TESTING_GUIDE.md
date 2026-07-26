# 🧪 Frontend Testing Guide

## Quick Start Testing

### 1. Start Backend Server
```bash
cd LibraryManagementSystem
./gradlew bootRun
# Backend should be running on http://localhost:8080
```

### 2. Start Frontend Server
```bash
cd Frontend
npm install  # First time only
npm run dev
# Frontend running on http://localhost:3000
```

### 3. Test Registration Flow

#### Valid Registration
```
URL: http://localhost:3000/register

Test Data:
- Username: johndoe
- Email: john@example.com
- First Name: John
- Last Name: Doe
- Phone Number: 09123456789
- Password: Test@1234
- Confirm Password: Test@1234
- [✓] Terms checkbox

Expected Result:
✅ Success toast notification
✅ Smooth animation exit
✅ Redirect to login page
```

#### Invalid Registration (Test Validation)

**Test 1: Weak Password**
```
Password: test123
Expected: ❌ "Password must contain uppercase, lowercase, number, and special character"
```

**Test 2: Invalid Phone**
```
Phone: 1234567890
Expected: ❌ "Invalid Philippine phone number"
```

**Test 3: Email Mismatch**
```
Email: notanemail
Expected: ❌ "Please enter a valid email address"
```

**Test 4: Password Mismatch**
```
Password: Test@1234
Confirm: Different@123
Expected: ❌ "Passwords do not match"
```

### 4. Test Login Flow

#### Valid Login
```
URL: http://localhost:3000/login

Test Data:
- Email: john@example.com
- Password: Test@1234

Expected Result:
✅ "Welcome back, johndoe! 🚀" toast
✅ Redirect to /dashboard
✅ Token stored in localStorage
```

#### Invalid Login
```
Wrong Password:
- Email: john@example.com
- Password: WrongPassword123!

Expected Result:
❌ Error toast
❌ Form shake animation
❌ Stay on login page
```

### 5. Test Protected Routes

```
1. Open http://localhost:3000/dashboard without logging in
Expected: ⚠️ Redirect to /login

2. Login, then navigate to /dashboard
Expected: ✅ Access granted

3. Refresh page while logged in
Expected: ✅ Still logged in (token persisted)

4. Logout (if implemented), try /dashboard
Expected: ⚠️ Redirect to /login
```

---

## Browser DevTools Testing

### Check Network Requests

**Registration:**
```
POST http://localhost:8080/api/auth/register
Status: 201 Created
Response: { id, username, email, ... }
```

**Login:**
```
POST http://localhost:8080/api/auth/login
Status: 200 OK
Response: { accessToken, refreshToken, ... }
```

### Check localStorage

```javascript
// Open Console (F12)
localStorage.getItem('auth-storage')

Expected:
{
  "state": {
    "user": "johndoe",
    "token": "eyJhbGc...",
    "refreshToken": "dGhpc...",
    "role": "MEMBER"
  }
}
```

---

## Animation Testing

### 1. Page Load Animation
```
✓ Icon rotates and scales in (bounce effect)
✓ Title fades in from top
✓ Form scales and fades in
✓ Form fields slide in with stagger
```

### 2. Error Animation
```
✓ Form shakes left-right on validation error
✓ Error message fades in with icon
✓ Input border turns red
```

### 3. Success Animation
```
✓ Form scales down and fades out
✓ Smooth transition to next page
✓ Toast notification appears
```

### 4. Three.js Scene
```
✓ Spaceship floats smoothly
✓ Engine glow pulsates
✓ Stars rotate slowly
✓ Particles drift in space
✓ Auto-rotate camera
```

---

## Responsive Testing

### Mobile (375px - 640px)
```
✓ Spaceship centered and smaller
✓ Single column form
✓ Touch-friendly buttons (44px height)
✓ Readable text sizes
```

### Tablet (768px - 1024px)
```
✓ Two-column name fields
✓ Spaceship visible on side
✓ Comfortable spacing
```

### Desktop (1280px+)
```
✓ Spaceship on right side
✓ Maximum form width 640px
✓ Centered content
✓ Full animation effects
```

---

## Performance Testing

### Metrics to Check

**Lighthouse Score (Chrome DevTools):**
```
Target Scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 85
```

**Three.js Performance:**
```
Check FPS (F12 > Performance)
Target: 60 FPS on modern devices
Target: 30+ FPS on low-end devices
```

---

## Common Test Scenarios

### ✅ Happy Path
1. Visit register page
2. Fill form with valid data
3. Submit → Success
4. Redirected to login
5. Enter credentials
6. Submit → Success
7. Redirected to dashboard
8. Refresh page → Still logged in

### ❌ Error Paths

**Validation Errors:**
1. Submit empty form → All fields show errors
2. Enter invalid email → Email error
3. Enter weak password → Password error
4. Mismatch passwords → Confirm password error

**Network Errors:**
1. Stop backend server
2. Try to login
3. Expected: Network error toast

**Duplicate Registration:**
1. Register with email
2. Try same email again
3. Expected: "User already exists" error

---

## Accessibility Testing

### Keyboard Navigation
```
✓ Tab through all form fields
✓ Enter to submit form
✓ Space to toggle checkbox
✓ Escape to close modals (if any)
```

### Screen Reader
```
✓ All inputs have labels
✓ Error messages announced
✓ Button states announced
✓ Icons have alt text
```

---

## API Error Handling

### Test Backend Responses

**400 Bad Request:**
```json
{
  "message": "Validation failed",
  "errors": ["Email is required", "Password is required"]
}
Expected: Show all error messages
```

**401 Unauthorized:**
```json
{
  "message": "Invalid credentials"
}
Expected: Show error toast, stay on login
```

**409 Conflict:**
```json
{
  "message": "Email already exists"
}
Expected: Show error, highlight email field
```

**500 Server Error:**
```json
{
  "message": "Internal server error"
}
Expected: Show generic error, log to console
```

---

## Debug Mode

### Enable Verbose Logging

Add to `src/main.jsx`:
```javascript
if (import.meta.env.DEV) {
  console.log('🚀 Development Mode')
  console.log('Backend URL:', import.meta.env.VITE_API_URL || 'http://localhost:8080')
}
```

Add to auth service:
```javascript
try {
  console.log('📤 Sending login request:', { email })
  const response = await api.post('/auth/login', credentials)
  console.log('✅ Login successful:', response.data)
  return response.data
} catch (error) {
  console.error('❌ Login failed:', error.response?.data)
  throw error
}
```

---

## Automated Testing (Future)

### Jest + React Testing Library

```javascript
// Example test structure
describe('LoginPage', () => {
  it('should render login form', () => {})
  it('should show validation errors', () => {})
  it('should submit form successfully', () => {})
  it('should handle API errors', () => {})
})
```

### Cypress E2E Tests

```javascript
// Example E2E test
describe('User Registration', () => {
  it('completes registration flow', () => {
    cy.visit('/register')
    cy.get('[name="username"]').type('johndoe')
    cy.get('[name="email"]').type('john@test.com')
    // ... fill form
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/login')
  })
})
```

---

## Test Checklist

### Before Production Release

- [ ] All form validations working
- [ ] API error handling correct
- [ ] Animations smooth (no jank)
- [ ] Mobile responsive
- [ ] Three.js scene performant
- [ ] Token refresh working
- [ ] Protected routes secure
- [ ] localStorage persistence
- [ ] Logout functionality
- [ ] Password visibility toggle
- [ ] Accessibility compliant
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] No console errors
- [ ] Lighthouse scores > 90

---

## Bug Report Template

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Node: 18.17.0
- Backend Status: Running/Stopped
```

---

## Performance Benchmarks

### Target Metrics

**Page Load:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total Load Time: < 5s

**Animation:**
- Entry animations: < 1s
- Form transitions: < 0.5s
- Three.js FPS: 60fps (desktop), 30fps (mobile)

**Bundle Size:**
- Initial JS: < 500KB (gzipped)
- Three.js chunks: Lazy loaded
- Total assets: < 2MB

---

**Happy Testing! 🚀**
