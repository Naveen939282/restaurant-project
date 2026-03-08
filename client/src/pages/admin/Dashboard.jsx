import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../App'
import axios from 'axios'
import { FiHome, FiMenu, FiShoppingBag, FiStar, FiLogOut, FiUsers, FiDollarSign, FiPackage, FiTrendingUp } from 'react-icons/fi'

const Dashboard = () => {
  const { user, logout } = useContext(AppContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const res = await axios.get('/orders/stats/summary')
      setStats(res.data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome />, path: '/admin' },
    { id: 'menu', label: 'Menu Items', icon: <FiMenu />, path: '/admin/menu' },
    { id: 'orders', label: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
    { id: 'reviews', label: 'Reviews', icon: <FiStar />, path: '/admin/reviews' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark pt-16">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-darkSecondary min-h-screen fixed left-0 top-16 shadow-lg">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
            <p className="text-sm text-gray-500">Gongura Hotel</p>
          </div>
          
          <nav className="p-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiHome />
              <span>View Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8 w-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user?.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="h-4 shimmer rounded w-1/2 mb-4"></div>
                  <div className="h-8 shimmer rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-green-500 text-sm flex items-center"><FiTrendingUp className="w-4 h-4 mr-1" />+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold">{stats?.totalOrders || 0}</h3>
                  <p className="text-gray-500">Total Orders</p>
                </div>

                <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FiDollarSign className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
                  <p className="text-gray-500">Total Revenue</p>
                </div>

                <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{stats?.todayOrders || 0}</h3>
                  <p className="text-gray-500">Today's Orders</p>
                </div>

                <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiTrendingUp className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">₹{stats?.monthlyRevenue?.toLocaleString() || 0}</h3>
                  <p className="text-gray-500">Monthly Revenue</p>
                </div>
              </div>

              {/* Orders by Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
                  <div className="space-y-3">
                    {stats?.ordersByStatus?.map((item) => (
                      <div key={item._id} className="flex justify-between items-center">
                        <span className="capitalize">{item._id}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(item.count / stats.totalOrders) * 100}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-4">Orders This Week</h3>
                  <div className="flex justify-between items-end h-40">
                    {stats?.last7Days?.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div className="w-full flex items-end justify-center">
                          <div
                            className="w-8 bg-primary rounded-t transition-all"
                            style={{ height: `${Math.max((day.count / Math.max(...stats.last7Days.map(d => d.count), 1)) * 100, 10)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-2 text-gray-500">{day.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Items */}
              <div className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
                <div className="space-y-3">
                  {stats?.popularItems?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">{i + 1}</span>
                        <span className="font-medium">{item._id}</span>
                      </div>
                      <span className="text-primary font-semibold">{item.count} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

