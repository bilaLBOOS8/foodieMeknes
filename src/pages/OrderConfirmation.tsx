import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Home, ShoppingBag } from 'lucide-react'

const OrderConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll start preparing it right away.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-900 mb-2">Order Details</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Order Number: <span className="font-medium">FM241115ABC</span></p>
              <p>Estimated Delivery: <span className="font-medium">15-30 minutes</span></p>
              <p>Payment Method: <span className="font-medium">Cash on Delivery</span></p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-left bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• We'll confirm your order shortly</li>
              <li>• Our chef will start preparing your meal</li>
              <li>• You'll receive updates on your order status</li>
              <li>• Our delivery driver will bring your food</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/menu"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order More
            </Link>
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Questions about your order? Call us at{' '}
              <span className="font-semibold text-orange-600">+212 6 12 34 56 78</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation