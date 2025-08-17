'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to landing page
    router.push('/landing')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-8"></div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Creator Transformer</h2>
        <p className="text-gray-600">Landing sayfasına yönlendiriliyor...</p>
      </div>
    </div>
  )
}
