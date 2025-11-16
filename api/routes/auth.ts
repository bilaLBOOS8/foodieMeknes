/**
 * This is a user authentication API route demo.
 * Handle user registration, login, token management, etc.
 */
import { Router, type Request, type Response } from 'express'
import { ApiService } from '../services/api.js'

const router = Router()

/**
 * Admin Login
 * POST /api/auth/admin/login
 */
router.post('/admin/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
      return
    }

    const result = await ApiService.adminLogin(email, password)
    
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    })
  }
})

/**
 * User Login
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement register logic
  res.json({
    success: true,
    message: 'Register endpoint - Coming soon'
  })
})

/**
 * User Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement login logic
  res.json({
    success: true,
    message: 'Login endpoint - Coming soon'
  })
})

/**
 * User Logout
 * POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement logout logic
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

export default router
