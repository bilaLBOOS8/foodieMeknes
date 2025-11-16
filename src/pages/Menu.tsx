import React, { useState } from 'react'
import { ShoppingCart, Filter, X } from 'lucide-react'
import { useMenuStore } from '../stores/menuStore'
import { useCartStore } from '../stores/cartStore'
import { formatPrice } from '../utils'
import { Product } from '../types'

const Menu: React.FC = () => {
  const { categories, products, loading, fetchProducts, fetchProductsByCategory } = useMenuStore()
  const { addItem, items: cartItems } = useCartStore()
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const defaultOptions = [
    { name: 'نوع اللحم', type: 'meat', choices: ['لحم بقر', 'دجاج'], required: true },
    { name: 'نوع الصوص', type: 'sauce', choices: ['مايونيز', 'كاتشب', 'حار', 'بدون'], required: false },
    { name: 'بطاطس', type: 'side', choices: ['نعم', 'لا'], required: false }
  ]

  React.useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory)
    } else {
      fetchProducts()
    }
  }, [selectedCategory])

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product)
    // Initialize customizations with default values
    const defaultCustomizations: Record<string, string> = {}
    const optionsForProduct = (product.options && product.options.length > 0) ? product.options : defaultOptions
    optionsForProduct.forEach(option => {
      if (option.required && option.choices.length > 0) {
        defaultCustomizations[option.name] = option.choices[0]
      }
    })
    setCustomizations(defaultCustomizations)
  }

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct, 1, customizations)
      setSelectedProduct(null)
      setCustomizations({})
    }
  }

  const getCartItemQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.product.id === productId)
    return cartItem?.quantity || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Menu
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our delicious selection of meals made with the freshest ingredients
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const quantity = getCartItemQuantity(product.id)
                  return (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => handleAddToCart(product)}
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          {quantity > 0 && (
                            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                              {quantity} in cart
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.ingredients.slice(0, 3).map((ingredient, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {ingredient}
                            </span>
                          ))}
                          {product.ingredients.length > 3 && (
                            <span className="text-gray-500 text-xs px-2 py-1">
                              +{product.ingredients.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-orange-600">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>اختر الإضافات</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">
                  {selectedCategory
                    ? 'No products available in this category.'
                    : 'No products available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  تخصيص طلبك
                </h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedProduct.description}</p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {(selectedProduct.options && selectedProduct.options.length > 0 ? selectedProduct.options : defaultOptions).map((option) => (
                  <div key={option.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {option.name}
                      {option.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="space-y-2">
                      {option.choices.map((choice) => (
                        <label key={choice} className="flex items-center">
                          <input
                            type="radio"
                            name={option.name}
                            value={choice}
                            checked={customizations[option.name] === choice}
                            onChange={(e) => setCustomizations(prev => ({
                              ...prev,
                              [option.name]: e.target.value
                            }))}
                            className="mr-2"
                            required={option.required}
                          />
                          <span className="text-sm text-gray-700">
                            {choice}
                            {(
                              (option.name === 'With fries' || option.name === 'بطاطس') &&
                              (choice.toLowerCase() === 'yes' || choice === 'نعم')
                            ) ? ` (+${formatPrice(7)})` : ''}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmAddToCart}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  أضف للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu