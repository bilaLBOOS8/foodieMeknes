import { create } from 'zustand'
import { CartState, CartItem, Product } from '../types'
import { calculateCartTotal, calculateItemExtras } from '../utils'

interface CartStore extends CartState {
  addItem: (product: Product, quantity?: number, customizations?: Record<string, string>) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  updateCustomizations: (productId: number, customizations: Record<string, string>) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addItem: (product, quantity = 1, customizations = {}) => {
    const { items } = get()
    const existingItem = items.find(item => item.product.id === product.id)
    
    if (existingItem) {
      const updatedItems = items.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              subtotal: (item.unit_price + calculateItemExtras(item.customizations)) * (item.quantity + quantity)
            }
          : item
      )
      set({
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      })
    } else {
      const extra = calculateItemExtras(customizations)
      const newItem: CartItem = {
        product,
        quantity,
        customizations,
        unit_price: product.price,
        subtotal: (product.price + extra) * quantity
      }
      const updatedItems = [...items, newItem]
      set({
        items: updatedItems,
        total: calculateCartTotal(updatedItems),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      })
    }
  },

  removeItem: (productId) => {
    const { items } = get()
    const updatedItems = items.filter(item => item.product.id !== productId)
    set({
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    
    const { items } = get()
    const updatedItems = items.map(item =>
      item.product.id === productId
        ? { ...item, quantity, subtotal: (item.unit_price + calculateItemExtras(item.customizations)) * quantity }
        : item
    )
    set({
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    })
  },

  updateCustomizations: (productId, customizations) => {
    const { items } = get()
    const updatedItems = items.map(item =>
      item.product.id === productId
        ? { ...item, customizations, subtotal: (item.unit_price + calculateItemExtras(customizations)) * item.quantity }
        : item
    )
    set({
      items: updatedItems,
      total: calculateCartTotal(updatedItems),
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    })
  },

  clearCart: () => {
    set({ items: [], total: 0, itemCount: 0 })
  }
}))