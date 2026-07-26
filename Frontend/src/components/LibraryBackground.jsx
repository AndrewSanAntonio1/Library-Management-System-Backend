// SIMPLE LIGHT STATIC BACKGROUND - NO ANIMATIONS
export default function LibraryBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Simple light gradient background - STATIC, NO animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      
      {/* Optional subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(59, 130, 246, 0.1) 50px, rgba(59, 130, 246, 0.1) 51px),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(139, 92, 246, 0.1) 50px, rgba(139, 92, 246, 0.1) 51px)
          `
        }}
      />
    </div>
  )
}
