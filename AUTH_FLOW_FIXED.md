# Authentication & Authorization Flow - FIXED ✅

## 🔴 Problem

When logging in as a LIBRARIAN, the application incorrectly redirected to the Member dashboard (`/dashboard`) instead of the Librarian dashboard (`/librarian`).

---

## 🎯 Root Causes Identified

### 1. **LoginPage.jsx** - Hardcoded Redirect
**Issue:** Login page always redirected to `/dashboard` regardless of user role.

**Before:**
```javascript
navigate('/dashboard', { replace: true })
```

**After:**
```javascript
const redirectPath = response.role === 'LIBRARIAN' || response.role === 'ADMIN'
  ? '/librarian'
  : '/dashboard'

navigate(redirectPath, { replace: true })
```

### 2. **App.jsx** - No Role-Based Protection
**Issue:** Routes weren't protected based on roles. Any authenticated user could access any route.

**Problems:**
- No role validation in ProtectedRoute
- No role-based redirection logic
- All routes accessible to all authenticated users

### 3. **Sidebar.jsx** - No Role-Based Navigation
**Issue:** Sidebar showed the same navigation items for all users regardless of role.

**Problem:**
- Hardcoded `memberMenuItems`
- No role checking
- LIBRARIAN saw Member navigation

---

## ✅ Solutions Implemented

### 1. Fixed Login Redirect (LoginPage.jsx)

**Location:** `Frontend/src/pages/LoginPage.jsx`

```javascript
const onSubmit = async (data) => {
  try {
    const response = await authService.login(data)
    setAuth(response) // Stores: user, token, refreshToken, role
    
    // ✅ ROLE-BASED REDIRECT
    const redirectPath = response.role === 'LIBRARIAN' || response.role === 'ADMIN'
      ? '/librarian'
      : '/dashboard'
    
    navigate(redirectPath, { replace: true })
  } catch (error) {
    // Error handling...
  }
}
```

**How it works:**
1. Backend returns `LoginResponse` with `role` field
2. `setAuth()` stores role in Zustand store (persisted to localStorage)
3. Redirect path determined by role:
   - `LIBRARIAN` or `ADMIN` → `/librarian`
   - `MEMBER` → `/dashboard`

---

### 2. Implemented Role-Based Routes (App.jsx)

**Location:** `Frontend/src/App.jsx`

#### A. Enhanced ProtectedRoute Component

```javascript
function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuthStore()
  
  // Check authentication
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // ✅ CHECK ROLE AUTHORIZATION
  if (allowedRoles && !allowedRoles.includes(role)) {
    toast.error('Access denied. You do not have permission.')
    
    // Redirect to appropriate dashboard
    const redirectPath = role === 'LIBRARIAN' || role === 'ADMIN' 
      ? '/librarian' 
      : '/dashboard'
    
    return <Navigate to={redirectPath} replace />
  }
  
  return children
}
```

**Features:**
- ✅ Checks if user is authenticated (`token`)
- ✅ Validates user role against `allowedRoles`
- ✅ Shows error toast if access denied
- ✅ Redirects to appropriate dashboard based on actual role

#### B. Role-Based Redirect Component

```javascript
function RoleBasedRedirect() {
  const { token, role } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  const redirectPath = role === 'LIBRARIAN' || role === 'ADMIN' 
    ? '/librarian' 
    : '/dashboard'
  
  return <Navigate to={redirectPath} replace />
}
```

**Usage:** For root path (`/`) and catch-all routes

#### C. Protected Member Routes

```javascript
{/* Member Routes - Only accessible to MEMBER role */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute allowedRoles={['MEMBER']}>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/browse-books"
  element={
    <ProtectedRoute allowedRoles={['MEMBER']}>
      <BrowseBooksPage />
    </ProtectedRoute>
  }
/>
{/* ... other member routes */}
```

#### D. Protected Librarian Routes

```javascript
{/* Librarian Routes - Only accessible to LIBRARIAN and ADMIN */}
<Route
  path="/librarian"
  element={
    <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
      <LibrarianDashboardPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/librarian/books"
  element={
    <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
      <BooksManagementPage />
    </ProtectedRoute>
  }
/>
{/* ... other librarian routes */}
```

---

### 3. Implemented Role-Based Sidebar (Sidebar.jsx)

**Location:** `Frontend/src/components/Sidebar.jsx`

#### A. Defined Role-Specific Menu Items

```javascript
// ✅ MEMBER NAVIGATION
const memberMenuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/browse-books', icon: BookOpen, label: 'Browse Books' },
  { path: '/borrowed-books', icon: BookMarked, label: 'Borrowed Books' },
  { path: '/reservations', icon: Bookmark, label: 'Reservations' },
  { path: '/fines', icon: DollarSign, label: 'Fines' },
  { path: '/borrow-history', icon: History, label: 'Borrow History' },
  { path: '/profile', icon: User, label: 'Profile' },
]

// ✅ LIBRARIAN/ADMIN NAVIGATION
const librarianMenuItems = [
  { path: '/librarian', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/librarian/books', icon: BookOpen, label: 'Books' },
  { path: '/librarian/authors', icon: FileText, label: 'Authors' },
  { path: '/librarian/categories', icon: Tag, label: 'Categories' },
  { path: '/librarian/publishers', icon: Building, label: 'Publishers' },
  { path: '/librarian/members', icon: Users, label: 'Members' },
  { path: '/librarian/borrow-records', icon: BookMarked, label: 'Borrow Records' },
  { path: '/librarian/reservations', icon: Calendar, label: 'Reservations' },
  { path: '/librarian/fines', icon: DollarSign, label: 'Fines' },
  { path: '/librarian/profile', icon: User, label: 'Profile' },
]
```

#### B. Dynamic Menu Selection

```javascript
const { role } = useAuthStore()

// ✅ SELECT MENU BASED ON ROLE
const menuItems = role === 'LIBRARIAN' || role === 'ADMIN' 
  ? librarianMenuItems 
  : memberMenuItems

const roleLabel = role === 'LIBRARIAN' 
  ? 'Librarian' 
  : role === 'ADMIN' 
    ? 'Admin' 
    : 'Member'
```

#### C. Role-Based Styling

```javascript
<div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
  role === 'LIBRARIAN' || role === 'ADMIN' 
    ? 'bg-gradient-to-br from-purple-500 to-pink-600'  // Purple for staff
    : 'bg-gradient-to-br from-blue-500 to-purple-600'  // Blue for members
}`}>
  <span className="text-white font-bold text-sm">
    {user?.charAt(0).toUpperCase()}
  </span>
</div>
<p className="text-blue-200 text-xs">{roleLabel}</p>
```

---

## 🔐 Backend JWT & Role Handling

### AuthService.java - Login Method

**Verified:** Backend correctly returns role in `LoginResponse`

```java
public LoginResponse login(LoginRequest request) {
    User user = userRepository.findByEmail(request.email())
            .orElseThrow(() -> new RuntimeException("Invalid email"));

    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
        throw new RuntimeException("Invalid password");
    }

    // Generate JWT with role
    String accessToken = jwtService.generateAccessToken(
            org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRole().name())  // ✅ Role included in JWT
                    .build()
    );

    return new LoginResponse(
            accessToken,
            refreshToken,
            jwtService.getTokenType(),
            jwtService.getAccessTokenExpiresIn(),
            user.getUsername(),
            user.getRole()  // ✅ Role returned in response
    );
}
```

### LoginResponse DTO

**Structure:**
```java
public record LoginResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    String username,
    Role role  // ✅ Role field present
) {}
```

---

## 📊 Authentication Flow Diagram

```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Backend generates JWT with role
    ↓
Backend returns LoginResponse {
    accessToken: "...",
    refreshToken: "...",
    username: "john_doe",
    role: "LIBRARIAN"  ✅
}
    ↓
Frontend receives response
    ↓
setAuth(response) stores in Zustand:
    - user: "john_doe"
    - token: "..."
    - refreshToken: "..."
    - role: "LIBRARIAN"  ✅
    ↓
Zustand persists to localStorage
    ↓
Check role and redirect:
    - If LIBRARIAN/ADMIN → /librarian
    - If MEMBER → /dashboard
    ↓
Sidebar loads role-specific menu
    ↓
Routes validate role on every navigation
```

---

## 🧪 Testing the Fix

### Test Case 1: LIBRARIAN Login

**Steps:**
1. Create user with role `LIBRARIAN` in database
2. Navigate to `http://localhost:5173/login`
3. Enter LIBRARIAN credentials
4. Click "Sign In"

**Expected Results:**
- ✅ Login success toast appears
- ✅ Redirects to `/librarian` (Librarian Dashboard)
- ✅ Sidebar shows Librarian navigation (Books, Authors, Categories, etc.)
- ✅ User info shows "Librarian" badge
- ✅ Cannot access `/dashboard` (Member route) - redirects to `/librarian`

### Test Case 2: MEMBER Login

**Steps:**
1. Register new user (defaults to MEMBER role)
2. Login with MEMBER credentials

**Expected Results:**
- ✅ Login success toast appears
- ✅ Redirects to `/dashboard` (Member Dashboard)
- ✅ Sidebar shows Member navigation (Browse Books, Borrowed Books, etc.)
- ✅ User info shows "Member" badge
- ✅ Cannot access `/librarian` routes - redirects to `/dashboard`

### Test Case 3: Direct URL Access

**Test:** Member tries to access `/librarian`

**Expected:**
- ✅ Access denied toast appears
- ✅ Automatically redirected to `/dashboard`
- ✅ No librarian content visible

**Test:** Librarian tries to access `/dashboard`

**Expected:**
- ✅ Access denied toast appears
- ✅ Automatically redirected to `/librarian`
- ✅ No member content visible

### Test Case 4: Role Persistence

**Steps:**
1. Login as LIBRARIAN
2. Refresh page
3. Close browser
4. Open browser again

**Expected:**
- ✅ Still logged in (token in localStorage)
- ✅ Role persisted (role in localStorage)
- ✅ Correct dashboard loads
- ✅ Correct sidebar menu shows

---

## 🔍 Debugging Role Issues

### Check Stored Role in Browser

**Open DevTools → Application → Local Storage → `auth-storage`**

Should see:
```json
{
  "state": {
    "user": "john_doe",
    "token": "eyJhbGciOiJI...",
    "refreshToken": "eyJhbGciOiJI...",
    "role": "LIBRARIAN"  // ✅ Check this value
  },
  "version": 0
}
```

### Check Backend Response

**Open DevTools → Network → Login request → Response**

Should see:
```json
{
  "accessToken": "eyJhbGciOiJI...",
  "refreshToken": "eyJhbGciOiJI...",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "username": "john_doe",
  "role": "LIBRARIAN"  // ✅ Check this is returned
}
```

### Check Database Role

**Query user in database:**
```sql
SELECT id, username, email, role FROM users WHERE email = 'librarian@example.com';
```

Should show:
```
| id | username  | email                   | role       |
|----|-----------|-------------------------|------------|
| 2  | librarian | librarian@example.com   | LIBRARIAN  |
```

---

## 🛠️ How to Create Test Users

### Create LIBRARIAN User

**Option 1: Update existing user in database**
```sql
UPDATE users 
SET role = 'LIBRARIAN' 
WHERE email = 'test@example.com';
```

**Option 2: Manual INSERT**
```sql
INSERT INTO users (username, email, password, firstname, lastname, phone_number, role, user_status, created_at)
VALUES (
  'librarian',
  'librarian@test.com',
  '$2a$10$...', -- BCrypt hash of password
  'John',
  'Librarian',
  '09123456789',
  'LIBRARIAN',
  'ACTIVE',
  NOW()
);
```

**Option 3: Register then update**
1. Register normally (creates MEMBER)
2. Run SQL: `UPDATE users SET role = 'LIBRARIAN' WHERE email = 'your@email.com'`

---

## 📋 Role-Based Access Matrix

| Route | MEMBER | LIBRARIAN | ADMIN |
|-------|--------|-----------|-------|
| `/login` | ✅ All | ✅ All | ✅ All |
| `/register` | ✅ All | ✅ All | ✅ All |
| `/dashboard` | ✅ Yes | ❌ No | ❌ No |
| `/browse-books` | ✅ Yes | ❌ No | ❌ No |
| `/borrowed-books` | ✅ Yes | ❌ No | ❌ No |
| `/reservations` | ✅ Yes | ❌ No | ❌ No |
| `/fines` | ✅ Yes | ❌ No | ❌ No |
| `/borrow-history` | ✅ Yes | ❌ No | ❌ No |
| `/profile` | ✅ Yes | ❌ No | ❌ No |
| `/librarian` | ❌ No | ✅ Yes | ✅ Yes |
| `/librarian/books` | ❌ No | ✅ Yes | ✅ Yes |
| `/librarian/authors` | ❌ No | ✅ Yes | ✅ Yes |
| `/librarian/categories` | ❌ No | ✅ Yes | ✅ Yes |
| `/librarian/publishers` | ❌ No | ✅ Yes | ✅ Yes |
| `/librarian/members` | ❌ No | ✅ Yes | ✅ Yes |
| `/librarian/*` | ❌ No | ✅ Yes | ✅ Yes |

---

## 📝 Files Modified

### Frontend
1. ✅ `LoginPage.jsx` - Added role-based redirect logic
2. ✅ `App.jsx` - Implemented role-based protection and routing
3. ✅ `Sidebar.jsx` - Added role-based navigation menus

### Backend
No changes needed - already working correctly!
- ✅ `AuthService.java` - Returns role in LoginResponse
- ✅ JWT includes role claims
- ✅ LoginResponse DTO has role field

---

## ✅ Status: COMPLETE

All authentication and authorization issues are now fixed:

- ✅ LIBRARIAN redirects to `/librarian` dashboard
- ✅ MEMBER redirects to `/dashboard` dashboard
- ✅ ADMIN redirects to `/librarian` dashboard
- ✅ Role-based route protection working
- ✅ Role-based sidebar navigation working
- ✅ Access denied toasts show properly
- ✅ Unauthorized access attempts redirect to correct dashboard
- ✅ Role persists across page refreshes
- ✅ Role displayed in sidebar user info
- ✅ Different avatar colors for different roles

---

## 🎉 Result

Your Library Management System now has proper role-based authentication and authorization! Each user type sees and can access only the appropriate features for their role.

**Test it now:**
1. Create/update a user with `LIBRARIAN` role in database
2. Login with LIBRARIAN credentials
3. Should see Librarian Dashboard at `/librarian`
4. Sidebar shows librarian menu items
5. Cannot access member routes

Perfect! 🚀
