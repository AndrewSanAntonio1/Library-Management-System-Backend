# Librarian Module - Complete Implementation Guide

## 📋 Overview

This document provides the complete implementation plan for the Librarian module with all CRUD operations, role-based access, and professional UI.

---

## ✅ What's Already Created

### Services (API Integration)
- ✅ `memberService.js` - Member CRUD operations
- ✅ `authorService.js` - Author CRUD operations
- ✅ `categoryService.js` - Category CRUD operations
- ✅ `publisherService.js` - Publisher CRUD operations
- ✅ `bookService.js` - Already exists
- ✅ `borrowService.js` - Already exists
- ✅ `reservationService.js` - Already exists
- ✅ `fineService.js` - Already exists

### Pages
- ✅ `LibrarianDashboardPage.jsx` - Complete with stats and recent activity

---

## 🚀 Implementation Plan

### Phase 1: Reusable Components (Priority: HIGH)

Create these shared components first:

#### 1. **DataTable Component**
**File:** `Frontend/src/components/librarian/DataTable.jsx`

**Features:**
- Sortable columns
- Search/filter
- Pagination
- Action buttons (Edit, Delete)
- Responsive design

**Props:**
```javascript
{
  columns: [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'actions', label: 'Actions', render: (row) => <ActionButtons /> }
  ],
  data: [],
  onEdit: (row) => {},
  onDelete: (row) => {},
  loading: false
}
```

#### 2. **Modal Component**
**File:** `Frontend/src/components/librarian/Modal.jsx`

**Features:**
- Animated open/close with GSAP
- Backdrop click to close
- Escape key to close
- Scrollable content

#### 3. **Form Components**
**Files:**
- `Frontend/src/components/librarian/FormInput.jsx`
- `Frontend/src/components/librarian/FormSelect.jsx`
- `Frontend/src/components/librarian/FormTextarea.jsx`

#### 4. **ConfirmDialog Component**
**File:** `Frontend/src/components/librarian/ConfirmDialog.jsx`

**Usage:** Delete confirmations

---

### Phase 2: Books Management (Priority: HIGH)

#### Page: `BooksManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/BooksManagementPage.jsx`

**Features:**
- ✅ View all books in DataTable
- ✅ Add new book (modal form)
- ✅ Edit book (modal form)
- ✅ Delete book (with confirmation)
- ✅ Search by title, ISBN, author
- ✅ Filter by category, availability

**Form Fields:**
```javascript
{
  isbn: string (required),
  title: string (required),
  description: textarea,
  publicationYear: number (required),
  totalCopies: number (required),
  availableCopies: number (required),
  authorId: select (required) - dropdown from authors,
  categoryId: select (required) - dropdown from categories,
  publisherId: select (required) - dropdown from publishers
}
```

**API Endpoints:**
```
GET    /api/books
POST   /api/books
GET    /api/books/:id
PUT    /api/books/:id
DELETE /api/books/:id
```

**Key Code Structure:**
```javascript
const [books, setBooks] = useState([])
const [authors, setAuthors] = useState([])
const [categories, setCategories] = useState([])
const [publishers, setPublishers] = useState([])
const [showModal, setShowModal] = useState(false)
const [editingBook, setEditingBook] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  const [booksData, authorsData, categoriesData, publishersData] = 
    await Promise.all([
      bookService.getAllBooks(),
      authorService.getAllAuthors(),
      categoryService.getAllCategories(),
      publisherService.getAllPublishers()
    ])
  // Set state
}

const handleAdd = () => {
  setEditingBook(null)
  setShowModal(true)
}

const handleEdit = (book) => {
  setEditingBook(book)
  setShowModal(true)
}

const handleDelete = async (id) => {
  if (confirm('Delete this book?')) {
    await bookService.deleteBook(id)
    toast.success('Book deleted')
    fetchData()
  }
}

const handleSubmit = async (formData) => {
  if (editingBook) {
    await bookService.updateBook(editingBook.id, formData)
    toast.success('Book updated')
  } else {
    await bookService.createBook(formData)
    toast.success('Book added')
  }
  setShowModal(false)
  fetchData()
}
```

---

### Phase 3: Authors Management

#### Page: `AuthorsManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/AuthorsManagementPage.jsx`

**Form Fields:**
```javascript
{
  name: string (required),
  bio: textarea
}
```

**Similar structure to Books but simpler**

---

### Phase 4: Categories Management

#### Page: `CategoriesManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/CategoriesManagementPage.jsx`

**Form Fields:**
```javascript
{
  name: string (required),
  description: textarea
}
```

---

### Phase 5: Publishers Management

#### Page: `PublishersManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/PublishersManagementPage.jsx`

**Form Fields:**
```javascript
{
  name: string (required),
  address: string,
  contact: string
}
```

---

### Phase 6: Members Management

#### Page: `MembersManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/MembersManagementPage.jsx`

**Form Fields:**
```javascript
{
  firstname: string (required),
  lastname: string (required),
  email: email (required),
  phoneNumber: string (required, Philippine format),
  address: string
}
```

**Note:** Members are different from Users. Check your backend DTO structure.

---

### Phase 7: Borrow Records Management

#### Page: `BorrowRecordsManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/BorrowRecordsManagementPage.jsx`

**Features:**
- Create new borrow record
- Update record (for returns)
- View all records
- Filter by status (BORROWED, RETURNED, OVERDUE)
- Search by member or book

**Form Fields:**
```javascript
{
  bookId: select (required),
  memberId: select (required),
  borrowDate: date (required),
  dueDate: date (required),
  returnDate: date (optional),
  status: select (BORROWED, RETURNED, OVERDUE)
}
```

**Special Features:**
- Process Return button (updates returnDate and status)
- Calculate if overdue
- Auto-create fine if overdue

---

### Phase 8: Reservations Management

#### Page: `ReservationsManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/ReservationsManagementPage.jsx`

**Form Fields:**
```javascript
{
  bookId: select (required),
  memberId: select (required),
  reservationDate: date (required),
  expiryDate: date (required),
  status: select (ACTIVE, CANCELLED, FULFILLED)
}
```

---

### Phase 9: Fines Management

#### Page: `FinesManagementPage.jsx`

**Location:** `Frontend/src/pages/librarian/FinesManagementPage.jsx`

**Form Fields:**
```javascript
{
  borrowRecordId: select (required),
  memberId: select (required),
  amount: number (required),
  reason: string,
  status: select (PAID, UNPAID),
  paymentDate: date (optional)
}
```

**Special Features:**
- Mark as Paid button
- Calculate total unpaid fines
- Filter by status

---

### Phase 10: Profile Page (Librarian)

#### Page: `LibrarianProfilePage.jsx`

**Location:** `Frontend/src/pages/librarian/LibrarianProfilePage.jsx`

**Features:**
- View profile information
- Edit profile (firstname, lastname, phoneNumber)
- Change password
- Logout button

---

## 🎨 UI/UX Guidelines

### Color Scheme
```css
Primary (Blue): #3B82F6
Success (Green): #10B981
Warning (Orange): #F59E0B
Danger (Red): #EF4444
Purple: #8B5CF6
Indigo: #6366F1
```

### Component Patterns

#### Action Buttons
```jsx
<div className="flex gap-2">
  <button
    onClick={() => handleEdit(row)}
    className="px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200 transition-all flex items-center gap-1.5 text-sm font-medium"
  >
    <Edit size={14} />
    Edit
  </button>
  <button
    onClick={() => handleDelete(row.id)}
    className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 transition-all flex items-center gap-1.5 text-sm font-medium"
  >
    <Trash2 size={14} />
    Delete
  </button>
</div>
```

#### Status Badges
```jsx
<span className={`
  px-3 py-1 rounded-full text-xs font-semibold
  ${status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-300' : ''}
  ${status === 'BORROWED' ? 'bg-blue-100 text-blue-700 border border-blue-300' : ''}
  ${status === 'OVERDUE' ? 'bg-red-100 text-red-700 border border-red-300' : ''}
`}>
  {status}
</span>
```

---

## 🔐 Role-Based Access Control

### Implementation in Routes

**File:** `Frontend/src/App.jsx`

```javascript
import { useAuthStore } from './store/authStore'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, token } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// In routes:
<Route 
  path="/librarian/*" 
  element={
    <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
      <LibrarianRoutes />
    </ProtectedRoute>
  } 
/>
```

### Librarian Routes Component

**File:** `Frontend/src/routes/LibrarianRoutes.jsx`

```javascript
import { Routes, Route } from 'react-router-dom'
import LibrarianDashboardPage from '../pages/librarian/LibrarianDashboardPage'
import BooksManagementPage from '../pages/librarian/BooksManagementPage'
// ... import other pages

export default function LibrarianRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LibrarianDashboardPage />} />
      <Route path="/books" element={<BooksManagementPage />} />
      <Route path="/authors" element={<AuthorsManagementPage />} />
      <Route path="/categories" element={<CategoriesManagementPage />} />
      <Route path="/publishers" element={<PublishersManagementPage />} />
      <Route path="/members" element={<MembersManagementPage />} />
      <Route path="/borrow-records" element={<BorrowRecordsManagementPage />} />
      <Route path="/reservations" element={<ReservationsManagementPage />} />
      <Route path="/fines" element={<FinesManagementPage />} />
      <Route path="/profile" element={<LibrarianProfilePage />} />
    </Routes>
  )
}
```

---

## 🧭 Sidebar Navigation for Librarian

**Update:** `Frontend/src/components/Sidebar.jsx`

Add role-based navigation:

```javascript
const { role } = useAuthStore()

const librarianNavigation = [
  { name: 'Dashboard', path: '/librarian', icon: LayoutDashboard },
  { name: 'Books', path: '/librarian/books', icon: BookOpen },
  { name: 'Authors', path: '/librarian/authors', icon: User },
  { name: 'Categories', path: '/librarian/categories', icon: Tag },
  { name: 'Publishers', path: '/librarian/publishers', icon: Building },
  { name: 'Members', path: '/librarian/members', icon: Users },
  { name: 'Borrow Records', path: '/librarian/borrow-records', icon: BookMarked },
  { name: 'Reservations', path: '/librarian/reservations', icon: Calendar },
  { name: 'Fines', path: '/librarian/fines', icon: DollarSign },
  { name: 'Profile', path: '/librarian/profile', icon: User },
]

const memberNavigation = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Browse Books', path: '/browse-books', icon: BookOpen },
  { name: 'Borrowed Books', path: '/borrowed-books', icon: BookMarked },
  { name: 'Reservations', path: '/reservations', icon: Calendar },
  { name: 'Fines', path: '/fines', icon: DollarSign },
  { name: 'History', path: '/borrow-history', icon: History },
  { name: 'Profile', path: '/profile', icon: User },
]

const navigation = role === 'LIBRARIAN' || role === 'ADMIN' 
  ? librarianNavigation 
  : memberNavigation
```

---

## 📝 Example: Complete Books Management Page

```javascript
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { bookService } from '../../services/bookService'
import { authorService } from '../../services/authorService'
import { categoryService } from '../../services/categoryService'
import { publisherService } from '../../services/publisherService'
import SpaceshipBackground from '../../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../../components/Sidebar'
import toast from 'react-hot-toast'

export default function BooksManagementPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])
  const [publishers, setPublishers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    description: '',
    publicationYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    authorId: '',
    categoryId: '',
    publisherId: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [booksData, authorsData, categoriesData, publishersData] = 
        await Promise.all([
          bookService.getAllBooks(),
          authorService.getAllAuthors(),
          categoryService.getAllCategories(),
          publisherService.getAllPublishers(),
        ])

      setBooks(Array.isArray(booksData) ? booksData : [])
      setAuthors(Array.isArray(authorsData) ? authorsData : [])
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setPublishers(Array.isArray(publishersData) ? publishersData : [])
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingBook(null)
    setFormData({
      isbn: '',
      title: '',
      description: '',
      publicationYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      authorId: '',
      categoryId: '',
      publisherId: '',
    })
    setShowModal(true)
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setFormData({
      isbn: book.isbn,
      title: book.title,
      description: book.description || '',
      publicationYear: book.publicationYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      authorId: book.authorId,
      categoryId: book.categoryId,
      publisherId: book.publisherId,
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      await bookService.deleteBook(id)
      toast.success('Book deleted successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete book')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, formData)
        toast.success('Book updated successfully')
      } else {
        await bookService.createBook(formData)
        toast.success('Book added successfully')
      }
      setShowModal(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex overflow-hidden">
      <SpaceshipBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          {/* Header */}
          <div className="mb-6 pt-16 lg:pt-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-white drop-shadow-xl">
                Books Management
              </h1>
              <button
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-lg"
              >
                <Plus size={20} />
                Add Book
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books by title or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ISBN
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Copies
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No books found
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.isbn}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {book.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.publicationYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {book.totalCopies}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            book.availableCopies > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {book.availableCopies}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(book)}
                              className="px-3 py-1.5 rounded-lg bg-blue-100 border border-blue-300 text-blue-700 hover:bg-blue-200 transition-all flex items-center gap-1.5"
                            >
                              <Edit size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-100 border border-red-300 text-red-700 hover:bg-red-200 transition-all flex items-center gap-1.5"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal - Add/Edit Book */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Form fields here - ISBN, Title, Description, Year, Copies, Dropdowns for Author/Category/Publisher */}
                  {/* ... */}
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all"
                    >
                      {editingBook ? 'Update' : 'Add'} Book
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
```

---

## 🧪 Testing Checklist

For each CRUD page:

- [ ] Can view all items
- [ ] Can search/filter items
- [ ] Can add new item
- [ ] Can edit existing item
- [ ] Can delete item with confirmation
- [ ] Form validation works
- [ ] Error messages display properly
- [ ] Success toasts show
- [ ] Loading states work
- [ ] Responsive on mobile
- [ ] Data refreshes after operations

---

## 📦 Files to Create

### Pages (10 files)
1. ✅ `LibrarianDashboardPage.jsx`
2. `BooksManagementPage.jsx`
3. `AuthorsManagementPage.jsx`
4. `CategoriesManagementPage.jsx`
5. `PublishersManagementPage.jsx`
6. `MembersManagementPage.jsx`
7. `BorrowRecordsManagementPage.jsx`
8. `ReservationsManagementPage.jsx`
9. `FinesManagementPage.jsx`
10. `LibrarianProfilePage.jsx`

### Components (5 files)
1. `DataTable.jsx`
2. `Modal.jsx`
3. `FormInput.jsx`
4. `FormSelect.jsx`
5. `ConfirmDialog.jsx`

### Routes (1 file)
1. `LibrarianRoutes.jsx`

### Updated Files
1. `App.jsx` - Add librarian routes
2. `Sidebar.jsx` - Add role-based navigation

---

## 🎯 Priority Order

1. **HIGH**: Dashboard (✅ Done), Books Management, Members Management
2. **MEDIUM**: Authors, Categories, Publishers, Borrow Records
3. **LOW**: Reservations, Fines, Reports

---

## 💡 Tips

1. **Reuse Components**: Create DataTable once, reuse everywhere
2. **Consistent Patterns**: Use same modal/form pattern for all CRUD
3. **Error Handling**: Always try-catch async operations
4. **Loading States**: Show spinners during API calls
5. **Success Feedback**: Toast messages for user actions
6. **Confirmations**: Always confirm delete operations
7. **Validation**: Validate forms before submission
8. **Responsive**: Test on mobile devices

---

## 🚀 Next Steps

1. Create reusable components (DataTable, Modal, Forms)
2. Build Books Management page (most complex, good template)
3. Copy pattern to other management pages
4. Add role-based routing
5. Update sidebar navigation
6. Test all CRUD operations
7. Add reports (optional)

---

This implementation will give you a professional, complete librarian module with all the features requested!
