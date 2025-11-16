import express from 'express'
import { ApiService } from '../services/api.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// Configure multer storage for uploads
const uploadsDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'uploads')
try { if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true }) } catch {}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')
    cb(null, `${timestamp}_${safeName}`)
  }
})
const upload = multer({ storage })

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await ApiService.getCategories()
    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    })
  }
})

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await ApiService.getProducts()
    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    })
  }
})

// Get products by category
router.get('/products/category/:categoryId', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)
    const products = await ApiService.getProductsByCategory(categoryId)
    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products by category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category'
    })
  }
})

// Create new order
router.post('/orders', async (req, res) => {
  try {
    const { customer_info, items, total_price } = req.body
    
    if (!customer_info || !items || !total_price) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    const order = await ApiService.createOrder(customer_info, items, total_price)
    
    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    })
  }
})

// Get all orders (admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await ApiService.getOrders()
    res.json({
      success: true,
      data: orders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    })
  }
})

// Update order status
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId)
    const { status } = req.body
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      })
    }

    await ApiService.updateOrderStatus(orderId, status)
    
    res.json({
      success: true,
      message: 'Order status updated successfully'
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    })
  }
})

// CRUD Operations for Categories (Admin)
router.post('/categories', async (req, res) => {
  try {
    const { name, description, display_order } = req.body
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      })
    }

    const category = await ApiService.createCategory({
      name,
      description: description || '',
      display_order: display_order || 0,
      is_active: true
    })
    
    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    })
  }
})

router.put('/categories/:categoryId', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)
    const { name, description, display_order, is_active } = req.body
    
    const category = await ApiService.updateCategory(categoryId, {
      name,
      description,
      display_order,
      is_active
    })
    
    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    })
  }
})

router.delete('/categories/:categoryId', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId)
    
    await ApiService.deleteCategory(categoryId)
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    })
  }
})

// Upload product image
router.post('/uploads', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file uploaded' })
      return
    }
    const urlPath = `/api/uploads/${req.file.filename}`
    res.json({ success: true, data: { url: urlPath } })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ success: false, error: 'Failed to upload file' })
  }
})

// CRUD Operations for Products (Admin)
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, category_id, ingredients, options, preparation_time, is_available, image_url } = req.body
    
    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and category are required'
      })
    }

    const product = await ApiService.createProduct({
      name,
      description: description || '',
      price: parseFloat(price),
      category_id: parseInt(category_id),
      ingredients: ingredients || [],
      options: options || [],
      preparation_time: preparation_time || 15,
      is_available: is_available !== undefined ? is_available : true,
      image_url: image_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Delicious%20food%20plate&image_size=square',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    })
  }
})

router.put('/products/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const { name, description, price, category_id, ingredients, options, preparation_time, is_available, image_url } = req.body
    
    const product = await ApiService.updateProduct(productId, {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      category_id: category_id ? parseInt(category_id) : undefined,
      ingredients,
      options,
      preparation_time,
      is_available,
      image_url,
      updated_at: new Date().toISOString()
    })
    
    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    })
  }
})

router.delete('/products/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    
    await ApiService.deleteProduct(productId)
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    })
  }
})

export default router