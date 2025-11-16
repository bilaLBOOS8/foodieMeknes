import { Product, Category, Order, CustomerInfo } from '../types'

export class ApiService {
  static async getCategories(): Promise<Category[]> {
    const response = await fetch('/api/categories')
    if (!response.ok) return []
    const result = await response.json()
    return result.data || []
  }

  static async getProducts(): Promise<Product[]> {
    const response = await fetch('/api/products')
    if (!response.ok) return []
    const result = await response.json()
    return result.data || []
  }

  static async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await fetch(`/api/products/category/${categoryId}`)
    if (!response.ok) return []
    const result = await response.json()
    return result.data || []
  }

  static async createOrder(customerInfo: CustomerInfo, items: any[], totalPrice: number): Promise<Order> {
    const body = { customer_info: customerInfo, items, total_price: totalPrice }
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!response.ok) throw new Error('Failed to create order')
    const result = await response.json()
    return result.data
  }

  static async getOrders(): Promise<Order[]> {
    const response = await fetch('/api/orders')
    if (!response.ok) return []
    const result = await response.json()
    return result.data || []
  }

  static async updateOrderStatus(orderId: number, status: string): Promise<void> {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    if (!response.ok) throw new Error('Failed to update order status')
  }

  static async adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch('/api/auth/admin/login', {      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Invalid credentials')
    const result = await response.json()
    return result.data
  }

  static async updateAdminCredentials(current_password: string, new_email?: string, new_password?: string): Promise<void> {
    const response = await fetch('/api/auth/admin/credentials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password, new_email, new_password })
    })
    if (!response.ok) {
      let msg = 'Failed to update credentials'
      try {
        const result = await response.json()
        msg = result?.error || msg
      } catch {}
      throw new Error(msg)
    }
  }

  // CRUD Operations for Categories (Admin)
  static async createCategory(categoryData: any): Promise<Category> {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create category')
    }
    
    const result = await response.json()
    return result.data
  }

  static async updateCategory(categoryId: number, categoryData: any): Promise<Category> {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update category')
    }
    
    const result = await response.json()
    return result.data
  }

  static async deleteCategory(categoryId: number): Promise<void> {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete category')
    }
  }

  // CRUD Operations for Products (Admin)
  static async createProduct(productData: any): Promise<Product> {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create product')
    }
    
    const result = await response.json()
    return result.data
  }

  static async updateProduct(productId: number, productData: any): Promise<Product> {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to update product')
    }
    
    const result = await response.json()
    return result.data
  }

  static async deleteProduct(productId: number): Promise<void> {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete product')
    }
  }

  static async uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: form
    })
    if (!response.ok) throw new Error('Failed to upload image')
    const result = await response.json()
    return result?.data?.url
  }
}