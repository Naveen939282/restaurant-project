import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../App'
import axios from 'axios'
import { FiHome, FiMenu, FiShoppingBag, FiStar, FiClock, FiCheck, FiX, FiChevronDown } from 'react-icons/fi'

const AdminOrders = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders')
      setOrders(res.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus })
      fetchOrders()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    const colors = { received: 'bg-blue-500', preparing: 'bg-yellow-500', ready: 'bg-orange-500', delivered: 'bg-green-500', cancelled: 'bg-red-500' }
    return colors[status] || 'bg-gray-500'
  }

  const menuItemsNav = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, path: '/admin' },
    { id: 'menu', label: 'Menu Items', icon: <FiMenu />, path: '/admin/menu' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
    { id: 'reviews', label: 'Reviews', icon: <FiStar />, path: '/admin/reviews' },
  ]

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark pt-16">
      <div className="flex">
        <div className="w-64 bg-white dark:bg-darkSecondary min-h-screen fixed left-0 top-16 shadow-lg">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
          </div>
          <nav className="p-4">
            {menuItemsNav.map((item) => (
              <Link key={item.id} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${item.id === 'orders' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {item.icon} <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-64 p-8 w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Order Management</h1>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input w-auto">
              <option value="all">All Orders</option>
              <option value="received">Received</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="h-6 shimmer rounded w-1/4 mb-4"></div>
                  <div className="h-4 shimmer rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()} • {order.customerName} • {order.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-white text-sm capitalize ${getStatusColor(order.status)}`}>{order.status}</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="input w-auto py-1"
                      >
                        <option value="received">Received</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t dark:border-gray-700 pt-4">
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center pt-3 border-t dark:border-gray-700">
                      <div className="text-sm text-gray-500">
                        <p>Payment: {order.paymentMethod === 'cod' ? 'COD' : 'Online'} ({order.paymentStatus})</p>
                        <p>Address: {order.deliveryAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">₹{order.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOrders

