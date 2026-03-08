import { useState, useEffect, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { AppContext } from '../App'
import axios from 'axios'
import { FiClock, FiPackage, FiCheck, FiX, FiShoppingBag } from 'react-icons/fi'

const Orders = () => {
  const { user } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders/myorders')
      setOrders(res.data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      received: 'bg-blue-500',
      preparing: 'bg-yellow-500',
      ready: 'bg-orange-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getStatusIcon = (status) => {
    const icons = {
      received: <FiClock />,
      preparing: <FiClock />,
      ready: <FiPackage />,
      delivered: <FiCheck />,
      cancelled: <FiX />
    }
    return icons[status] || <FiClock />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24 pb-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center py-16">
            <FiShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Please Login to View Orders</h2>
            <p className="text-gray-500 mb-8">You need to be logged in to view your order history.</p>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24 pb-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-6 shimmer rounded w-1/3 mb-4"></div>
                <div className="h-4 shimmer rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <FiShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start exploring our menu and place your first order!</p>
            <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="card p-6">
                <div className="flex flex-wrap justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-white text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-2 capitalize">{order.status}</span>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center pt-4 border-t dark:border-gray-700">
                    <div className="text-sm text-gray-500">
                      <p>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                      <p>Payment Status: <span className={`capitalize ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>{order.paymentStatus}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{order.items.reduce((a, b) => a + b.quantity, 0)} items</p>
                      <p className="text-xl font-bold text-primary">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders

