import { create } from 'zustand'
import { MenuState, Category, Product } from '../types'

interface MenuStore extends MenuState {
  fetchCategories: () => Promise<void>
  fetchProducts: () => Promise<void>
  fetchProductsByCategory: (categoryId: number) => Promise<void>
  createCategory: (categoryData: any) => Promise<void>
  updateCategory: (categoryId: number, categoryData: any) => Promise<void>
  deleteCategory: (categoryId: number) => Promise<void>
  createProduct: (productData: any) => Promise<void>
  updateProduct: (productId: number, productData: any) => Promise<void>
  deleteProduct: (productId: number) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useMenuStore = create<MenuStore>((set, get) => ({
  categories: [],
  products: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const data = await ApiService.getCategories()
      set({ categories: data || [] })
    } catch (error) {
      console.error('Error fetching categories:', error)
      set({ error: 'Failed to load categories' })
    } finally {
      set({ loading: false })
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const data = await ApiService.getProducts()
      set({ products: data || [] })
    } catch (error) {
      console.error('Error fetching products:', error)
      set({ error: 'Failed to load products' })
    } finally {
      set({ loading: false })
    }
  },

  fetchProductsByCategory: async (categoryId: number) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const data = await ApiService.getProductsByCategory(categoryId)
      set({ products: data || [] })
    } catch (error) {
      console.error('Error fetching products by category:', error)
      set({ error: 'Failed to load products by category' })
    } finally {
      set({ loading: false })
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // CRUD Operations for Categories
  createCategory: async (categoryData: any) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const newCategory = await ApiService.createCategory(categoryData)
      
      set((state) => ({
        categories: [...state.categories, newCategory]
      }))
    } catch (error) {
      set({ error: 'Failed to create category' })
      console.error('Error creating category:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateCategory: async (categoryId: number, categoryData: any) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const updatedCategory = await ApiService.updateCategory(categoryId, categoryData)
      
      set((state) => ({
        categories: state.categories.map(cat => 
          cat.id === categoryId ? updatedCategory : cat
        )
      }))
    } catch (error) {
      set({ error: 'Failed to update category' })
      console.error('Error updating category:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  deleteCategory: async (categoryId: number) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      await ApiService.deleteCategory(categoryId)
      
      set((state) => ({
        categories: state.categories.filter(cat => cat.id !== categoryId)
      }))
    } catch (error) {
      set({ error: 'Failed to delete category' })
      console.error('Error deleting category:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // CRUD Operations for Products
  createProduct: async (productData: any) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const newProduct = await ApiService.createProduct(productData)
      
      set((state) => ({
        products: [...state.products, newProduct]
      }))
    } catch (error) {
      set({ error: 'Failed to create product' })
      console.error('Error creating product:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateProduct: async (productId: number, productData: any) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      const updatedProduct = await ApiService.updateProduct(productId, productData)
      
      set((state) => ({
        products: state.products.map(prod => 
          prod.id === productId ? updatedProduct : prod
        )
      }))
    } catch (error) {
      set({ error: 'Failed to update product' })
      console.error('Error updating product:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  deleteProduct: async (productId: number) => {
    set({ loading: true, error: null })
    try {
      const { ApiService } = await import('../services/api')
      await ApiService.deleteProduct(productId)
      
      set((state) => ({
        products: state.products.filter(prod => prod.id !== productId)
      }))
    } catch (error) {
      set({ error: 'Failed to delete product' })
      console.error('Error deleting product:', error)
      throw error
    } finally {
      set({ loading: false })
    }
  }
}))

// Mock data for development
const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Burgers',
    description: 'Fresh grilled burgers with premium ingredients',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=juicy%20beef%20burger%20with%20lettuce%20tomato%20cheese&image_size=square',
    display_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Sandwiches',
    description: 'Delicious sandwiches and wraps',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20chicken%20sandwich%20with%20vegetables&image_size=square',
    display_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Drinks',
    description: 'Refreshing beverages',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=refreshing%20orange%20juice%20glass&image_size=square',
    display_order: 3,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Desserts',
    description: 'Sweet treats to complete your meal',
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=delicious%20chocolate%20cake%20dessert&image_size=square',
    display_order: 4,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
    price: 45.00,
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=classic%20beef%20burger%20with%20lettuce%20tomato%20onion&image_size=square',
    category_id: 1,
    ingredients: ['Beef', 'Lettuce', 'Tomato', 'Onion', 'Special Sauce'],
    options: [
      { name: 'Type of meat', type: 'meat', choices: ['Beef', 'Chicken', 'Fish'], required: true },
      { name: 'Sauce', type: 'sauce', choices: ['Mayo', 'Ketchup', 'Special', 'No sauce'], required: false },
      { name: 'With fries', type: 'side', choices: ['Yes', 'No'], required: false }
    ],
    is_available: true,
    preparation_time: 15,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Cheese Burger',
    description: 'Beef patty with melted cheese, lettuce, tomato, and pickles',
    price: 50.00,
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cheese%20burger%20with%20melted%20cheese%20lettuce%20tomato&image_size=square',
    category_id: 1,
    ingredients: ['Beef', 'Cheese', 'Lettuce', 'Tomato', 'Pickles'],
    options: [
      { name: 'Type of meat', type: 'meat', choices: ['Beef', 'Chicken'], required: true },
      { name: 'Extra cheese', type: 'other', choices: ['Yes', 'No'], required: false },
      { name: 'With fries', type: 'side', choices: ['Yes', 'No'], required: false }
    ],
    is_available: true,
    preparation_time: 15,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Chicken Panini',
    description: 'Grilled chicken with pesto sauce, sun-dried tomatoes, and mozzarella',
    price: 40.00,
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=grilled%20chicken%20panini%20with%20pesto%20sauce&image_size=square',
    category_id: 2,
    ingredients: ['Chicken', 'Pesto', 'Sun-dried Tomatoes', 'Mozzarella'],
    options: [
      { name: 'Bread type', type: 'other', choices: ['White', 'Whole Wheat', 'Ciabatta'], required: true },
      { name: 'Toasted', type: 'other', choices: ['Yes', 'No'], required: false }
    ],
    is_available: true,
    preparation_time: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Tacos',
    description: 'Three soft tacos with seasoned beef, lettuce, cheese, and salsa',
    price: 35.00,
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=mexican%20tacos%20with%20beef%20lettuce%20cheese%20salsa&image_size=square',
    category_id: 2,
    ingredients: ['Beef', 'Lettuce', 'Cheese', 'Salsa', 'Tortillas'],
    options: [
      { name: 'Meat type', type: 'meat', choices: ['Beef', 'Chicken', 'Fish'], required: true },
      { name: 'Spicy level', type: 'sauce', choices: ['Mild', 'Medium', 'Hot'], required: true }
    ],
    is_available: true,
    preparation_time: 10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 15.00,
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=golden%20crispy%20french%20fries%20with%20salt&image_size=square',
    category_id: 3,
    ingredients: ['Potatoes', 'Sea Salt', 'Oil'],
    options: [
      { name: 'Size', type: 'other', choices: ['Small', 'Medium', 'Large'], required: true },
      { name: 'Extra salt', type: 'other', choices: ['Yes', 'No'], required: false }
    ],
    is_available: true,
    preparation_time: 8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 12.00,
    image_url: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20orange%20juice%20in%20glass&image_size=square',
    category_id: 3,
    ingredients: ['Fresh Oranges'],
    options: [
      { name: 'Size', type: 'other', choices: ['Small', 'Large'], required: true },
      { name: 'Ice', type: 'other', choices: ['Yes', 'No'], required: false }
    ],
    is_available: true,
    preparation_time: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]