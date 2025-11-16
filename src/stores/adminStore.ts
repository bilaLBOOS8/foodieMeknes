import { create } from 'zustand'
import { AdminState, AdminUser } from '../types'
import { ApiService } from '../services/api'

interface AdminStore extends AdminState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true })
    try {
      const result = await ApiService.adminLogin(email, password)
      set({
        user: result.user,
        isAuthenticated: true,
        loading: false
      })
      localStorage.setItem('admin_token', result.token)
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
    localStorage.removeItem('admin_token')
  },

  checkAuth: () => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      // In a real app, you'd validate the token with the backend
      set({
        user: {
          id: 1,
          email: 'elbakkalybilal531@gmail.com',
          name: 'Admin User',
          role: 'super_admin',
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        isAuthenticated: true,
        loading: false
      })
    } else {
      set({ loading: false })
    }
  }
}))