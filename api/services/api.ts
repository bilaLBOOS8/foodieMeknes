import { supabase } from '../lib/supabase.js'
import { SUPABASE_TABLES } from '../lib/supabase.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'store.json')

type Store = {
  categories: any[]
  products: any[]
  orders: any[]
}

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: Store = { categories: [], products: [], orders: [] }
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8')
    }
  } catch {}
}

function loadStore(): Store {
  ensureDataFile()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    }
  } catch {
    return { categories: [], products: [], orders: [] }
  }
}

function saveStore(store: Store) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8')
  } catch {}
}

let store = loadStore()

export class ApiService {
  static async getCategories() {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (error) throw error
      return data || []
    }
    return store.categories
  }

  static async getProducts() {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .select('*')
        .eq('is_available', true)
        .order('name')
      
      if (error) throw error
      return data || []
    }
    return store.products
  }

  static async getProductsByCategory(categoryId: number) {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('name')
      
      if (error) throw error
      return data || []
    }
    return store.products.filter(p => p.category_id === categoryId && p.is_available)
  }

  static async createOrder(customerInfo: any, items: any[], totalPrice: number) {
    if (supabase) {
      const orderData = {
        order_number: `FM${Date.now().toString(36).toUpperCase()}`,
        customer_info: customerInfo,
        items: items,
        total_price: totalPrice,
        status: 'pending',
        payment_method: 'cash',
        payment_details: {}
      }

      const { data, error } = await supabase
        .from(SUPABASE_TABLES.ORDERS)
        .insert(orderData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
    // In-memory fallback for development
    const cartItems = items.map((item) => {
      const product = store.products.find(p => p.id === item.product_id)
      const unitPrice = product ? product.price : item.unit_price
      return {
        product: product || {
          id: item.product_id,
          name: 'Unknown Product',
          description: '',
          price: unitPrice,
          image_url: '',
          category_id: 0,
          ingredients: [],
          options: [],
          is_available: true,
          preparation_time: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        quantity: item.quantity,
        customizations: item.customizations || {},
        unit_price: unitPrice,
        subtotal: unitPrice * item.quantity,
      }
    })

    const newOrder = {
      id: (store.orders[0]?.id || 0) + 1,
      order_number: `FM${Date.now().toString(36).toUpperCase()}`,
      customer_info: customerInfo,
      items: cartItems,
      total_price: cartItems.reduce((sum, it) => sum + it.subtotal, 0),
      status: 'pending',
      payment_method: 'cash',
      payment_details: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    store.orders.unshift(newOrder)
    saveStore(store)
    return newOrder
  }

  static async getOrders() {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.ORDERS)
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    }
    return store.orders
  }

  static async updateOrderStatus(orderId: number, status: string) {
    if (supabase) {
      const { error } = await supabase
        .from(SUPABASE_TABLES.ORDERS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
      
      if (error) throw error
    } else {
      const idx = store.orders.findIndex(o => o.id === orderId)
      if (idx !== -1) {
        store.orders[idx].status = status
        store.orders[idx].updated_at = new Date().toISOString()
        saveStore(store)
      }
    }
  }

  static async adminLogin(email: string, password: string) {
    // This would typically use Supabase Auth
    // For now, we'll use a simple check
    if (email === 'elbakkalybilal531@gmail.com' && password === 'admin123') {
      return {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          email: 'elbakkalybilal531@gmail.com',
          name: 'Admin User',
          role: 'super_admin'
        }
      }
    }
    throw new Error('Invalid credentials')
  }

  // CRUD Operations for Categories
  static async createCategory(categoryData: any) {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .insert(categoryData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
    // In-memory fallback
    const category = {
      id: Date.now(),
      ...categoryData,
      image_url: categoryData.image_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    store.categories.push(category)
    saveStore(store)
    return category
  }

  static async updateCategory(categoryId: number, categoryData: any) {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .update(categoryData)
        .eq('id', categoryId)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
    // In-memory fallback
    const idx = store.categories.findIndex(c => c.id === categoryId)
    if (idx !== -1) {
      store.categories[idx] = {
        ...store.categories[idx],
        ...categoryData,
        updated_at: new Date().toISOString()
      }
      saveStore(store)
      return store.categories[idx]
    }
    return null
  }

  static async deleteCategory(categoryId: number) {
    if (supabase) {
      const { error } = await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .delete()
        .eq('id', categoryId)
      
      if (error) throw error
    }
    // In-memory fallback
    const idx = store.categories.findIndex(c => c.id === categoryId)
    if (idx !== -1) {
      store.categories.splice(idx, 1)
      saveStore(store)
    }
  }

  // CRUD Operations for Products
  static async createProduct(productData: any) {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .insert(productData)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
    // In-memory fallback
    const product = {
      id: Date.now(),
      ...productData,
      image_url: productData.image_url || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    store.products.push(product)
    saveStore(store)
    return product
  }

  static async updateProduct(productId: number, productData: any) {
    if (supabase) {
      const { data, error } = await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .update(productData)
        .eq('id', productId)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
    // In-memory fallback
    const idx = store.products.findIndex(p => p.id === productId)
    if (idx !== -1) {
      store.products[idx] = {
        ...store.products[idx],
        ...productData,
        updated_at: new Date().toISOString()
      }
      saveStore(store)
      return store.products[idx]
    }
    return null
  }

  static async deleteProduct(productId: number) {
    if (supabase) {
      const { error } = await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .delete()
        .eq('id', productId)
      
      if (error) throw error
    }
    // In-memory fallback
    const idx = store.products.findIndex(p => p.id === productId)
    if (idx !== -1) {
      store.products.splice(idx, 1)
      saveStore(store)
    }
  }
}

// ensure data file exists at module load
ensureDataFile()
