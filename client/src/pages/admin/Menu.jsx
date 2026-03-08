import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../App'
import axios from 'axios'
import { FiHome, FiMenu, FiShoppingBag, FiStar, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const categories = ['Andhra Meals', 'Biryani', 'Tiffins', 'Starters', 'Curries', 'Beverages', 'Desserts']

const AdminMenu = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'Andhra Meals', image: '', isAvailable: true, isFeatured: false
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchMenu()
  }, [user])

  const fetchMenu = async () => {
    try {
      const res = await axios.get('/menu')
      setMenuItems(res.data.menuItems || [])
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { ...formData, price: parseFloat(formData.price) }
      if (editingItem) {
        await axios.put(`/menu/${editingItem._id}`, data)
      } else {
        await axios.post('/menu', data)
      }
      fetchMenu()
      closeModal()
    } catch (error) {
      console.error('Error saving menu item:', error)
      alert('Failed to save item')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await axios.delete(`/menu/${id}`)
      fetchMenu()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({ name: item.name, description: item.description, price: item.price.toString(), category: item.category, image: item.image, isAvailable: item.isAvailable, isFeatured: item.isFeatured })
    } else {
      setEditingItem(null)
      setFormData({ name: '', description: '', price: '', category: 'Andhra Meals', image: '', isAvailable: true, isFeatured: false })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const menuItemsNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, path: '/admin' },
    { id: 'menu', label: 'Menu Items', icon: <FiMenu />, path: '/admin/menu' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
    { id: 'reviews', label: 'Reviews', icon: <FiStar />, path: '/admin/reviews' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark pt-16">
      <div className="flex">
        <div className="w-64 bg-white dark:bg-darkSecondary min-h-screen fixed left-0 top-16 shadow-lg">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="p-4">
            {menuItemsNav.map((item) => (
              <Link key={item.id} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${item.id === 'menu' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {item.icon} <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-64 p-8 w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
              <FiPlus /> Add Item
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-darkSecondary p-4 rounded-xl shadow">
                  <div className="h-40 shimmer rounded mb-4"></div>
                  <div className="h-5 shimmer rounded w-2/3 mb-2"></div>
                  <div className="h-4 shimmer rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div key={item._id} className="bg-white dark:bg-darkSecondary rounded-xl shadow overflow-hidden">
                  <img src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'} alt={item.name} className="w-full h-40 object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' }} />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.isFeatured && <span className="badge badge-primary text-xs">Featured</span>}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <p className="text-primary font-bold text-lg mb-3">₹{item.price}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openModal(item)} className="flex-1 btn btn-secondary py-2 text-sm flex items-center justify-center gap-1"><FiEdit2 /> Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><FiTrash2 /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-darkSecondary rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input" placeholder="Item name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="input" rows="2" placeholder="Item description"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required className="input" placeholder="0" min="0" step="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input type="url" name="image" value={formData.image} onChange={handleChange} className="input" placeholder="https://..." />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} className="w-4 h-4" />
                  <span>Available</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4" />
                  <span>Featured</span>
                </label>
              </div>
              <button type="submit" className="w-full btn btn-primary">{editingItem ? 'Update Item' : 'Add Item'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMenu

