import { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../App'
import { FiSearch, FiPlus, FiMinus, FiShoppingCart, FiX } from 'react-icons/fi'

const Menu = () => {
  const { addToCart, cart, updateQuantity, removeFromCart, cartTotal } = useContext(AppContext)
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const res = await axios.get('/menu?available=true')
      setMenuItems(res.data.menuItems || [])
      const cats = [...new Set(res.data.menuItems?.map(item => item.category) || [])]
      setCategories(['All', ...cats])
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = async () => {
    try {
      let url = '/menu?available=true'
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`
      }
      if (searchQuery) {
        url += `&search=${searchQuery}`
      }
      const res = await axios.get(url)
      setMenuItems(res.data.menuItems || [])
    } catch (error) {
      console.error('Error filtering:', error)
    }
  }

  useEffect(() => {
    filterItems()
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark pt-20">
      <div className="bg-primary text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg opacity-90">Explore our delicious range of Andhra cuisine</p>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-white dark:bg-darkSecondary shadow-md py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 dark:bg-dark focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="md:hidden flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg"
            >
              <FiShoppingCart />
              <span>Cart ({cart.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-4">
                <div className="h-48 shimmer rounded-lg mb-4"></div>
                <div className="h-6 shimmer rounded mb-2"></div>
                <div className="h-4 shimmer rounded w-2/3 mb-2"></div>
                <div className="h-8 shimmer rounded"></div>
              </div>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No items found</p>
            <button onClick={() => { setSelectedCategory('All'); setSearchQuery('')}} className="mt-4 text-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <div key={item._id} className="menu-card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="menu-card-image"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' }}
                />
                <div className="flex items-start justify-between mb-2">
                  <h3 className="menu-card-title">{item.name}</h3>
                  {item.isFeatured && <span className="badge badge-primary">Featured</span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="menu-card-price">₹{item.price}</span>
                  <span className="text-sm text-gray-500">{item.category}</span>
                </div>
                {item.isAvailable ? (
                  <button onClick={() => addToCart(item)} className="w-full btn btn-primary py-2">Add to Cart</button>
                ) : (
                  <button disabled className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed">Unavailable</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-darkSecondary shadow-2xl z-50 transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 p-3 bg-gray-50 dark:bg-dark rounded-lg">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' }} />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-primary font-bold">₹{item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center"><FiMinus className="w-4 h-4" /></button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center"><FiPlus className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700"><FiX className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl">₹{cartTotal}</span>
              </div>
              <a href="/checkout" className="block w-full btn btn-primary text-center" onClick={() => setShowCart(false)}>Proceed to Checkout</a>
            </div>
          )}
        </div>
      </div>

      {showCart && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCart(false)}></div>}
    </div>
  )
}

export default Menu

