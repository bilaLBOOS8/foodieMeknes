import React from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact</h1>
        <p className="text-gray-600 mb-8">Get in touch with us for orders, questions, or feedback.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Phone className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Phone</h2>
            </div>
            <p className="text-gray-700">0644100401</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Email</h2>
            </div>
            <p className="text-gray-700">elbakkalybilal531@gmail.com</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Location</h2>
            </div>
            <p className="text-gray-700">Meknes, Morocco</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact