import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMenuStore } from '../../stores/menuStore'
import { Category } from '../../types'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

const AdminCategories: React.FC = () => {
  const navigate = useNavigate()
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useMenuStore()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    display_order: '0',
    is_active: true,
    image_url: ''
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        display_order: parseInt(formData.display_order || '0'),
        is_active: formData.is_active,
        image_url: formData.image_url
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, payload)
        toast.success('Category updated successfully!')
      } else {
        await createCategory(payload)
        toast.success('Category created successfully!')
      }

      setShowForm(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '', display_order: '0', is_active: true, image_url: '' })
      fetchCategories()
    } catch (error) {
      toast.error('Failed to save category')
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      display_order: String(category.display_order ?? 0),
      is_active: category.is_active,
      image_url: category.image_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId)
        toast.success('Category deleted successfully!')
        fetchCategories()
      } catch (error) {
        toast.error('Failed to delete category')
        console.error('Error deleting category:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Categories Management</h1>
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/admin/dashboard')} className="px-4 py-2 text-gray-700 hover:text-gray-900">Dashboard</button>
              <button onClick={() => navigate('/admin/menu')} className="px-4 py-2 text-gray-700 hover:text-gray-900">Products</button>
              <button onClick={() => setShowForm(true)} className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                  <button onClick={() => { setShowForm(false); setEditingCategory(null) }} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                      <input type="number" id="display_order" name="display_order" value={formData.display_order} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="flex items-center mt-6">
                      <input type="checkbox" id="is_active" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active</label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="text" id="image_url" name="image_url" value={formData.image_url} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>

                  <div className="flex space-x-3">
                    <button type="button" onClick={() => { setShowForm(false); setEditingCategory(null) }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Category</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
              </div>
            ))
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {cat.image_url && (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-32 object-cover rounded-t-lg" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                  {cat.description && <p className="text-gray-600 text-sm mb-3">{cat.description}</p>}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Order: {cat.display_order}</span>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(cat)} className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center space-x-2">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && categories.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">Start by adding your first category.</p>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCategories