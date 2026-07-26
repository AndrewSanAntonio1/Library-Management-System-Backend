import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { User, Mail, Phone, Calendar, Shield, Edit2, Save, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({})
  
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.role)
  
  const headerRef = useRef()
  
  useEffect(() => {
    fetchProfile()
  }, [])
  
  const fetchProfile = async () => {
    try {
      setLoading(true)
      // Note: This is a mock - adjust based on your actual API
      const data = {
        username: user,
        email: 'user@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phonenumber: '09123456789',
        role: role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      }
      setProfile(data)
      setFormData(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSave = async () => {
    try {
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceshipBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg drop-shadow-lg">Loading profile...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex overflow-hidden">
      <SpaceshipBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />
      
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          <div ref={headerRef} className="mb-6 sm:mb-8 pt-16 lg:pt-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-xl">
              <User className="text-blue-400 flex-shrink-0 drop-shadow-lg" size={32} />
              My Profile
            </h1>
            <p className="text-blue-200 drop-shadow-lg">Manage your account information</p>
          </div>
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 mb-6 shadow-xl">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user?.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile?.username}</h2>
                <p className="text-gray-600 mb-2">{profile?.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className={`
                    px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5
                    ${role === 'ADMIN' 
                      ? 'bg-red-100 border-2 border-red-300 text-red-700'
                      : role === 'LIBRARIAN'
                      ? 'bg-purple-100 border-2 border-purple-300 text-purple-700'
                      : 'bg-blue-100 border-2 border-blue-300 text-blue-700'
                    }
                  `}>
                    <Shield size={12} />
                    {role}
                  </span>
                  <span className="px-3 py-1 bg-green-100 border-2 border-green-300 text-green-700 text-xs rounded-lg font-medium">
                    {profile?.status}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => editing ? setEditing(false) : setEditing(true)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 border-2 shadow-md
                  ${editing
                    ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200'
                  }
                `}
              >
                {editing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit</>}
              </button>
            </div>
            
            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {editing ? (
                  <Input
                    value={formData.firstname}
                    onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                    icon={User}
                  />
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 text-gray-900">{profile?.firstname}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {editing ? (
                  <Input
                    value={formData.lastname}
                    onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                    icon={User}
                  />
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 text-gray-900">{profile?.lastname}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 text-gray-900 flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {profile?.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {editing ? (
                  <Input
                    value={formData.phonenumber}
                    onChange={(e) => setFormData({...formData, phonenumber: e.target.value})}
                    icon={Phone}
                  />
                ) : (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 text-gray-900 flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    {profile?.phonenumber}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3 text-gray-900 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  {new Date(profile?.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            {editing && (
              <div className="mt-6 flex gap-3">
                <Button onClick={handleSave} icon={Save}>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
          
          {/* Change Password Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
            <p className="text-gray-600 text-sm mb-4">
              Update your password to keep your account secure
            </p>
            <button className="px-4 py-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-700 hover:bg-blue-200 transition-all font-medium shadow-md">
              Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
