import { useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../App'
import axios from 'axios'
import { FiHome, FiMenu, FiShoppingBag, FiStar, FiCheck, FiX, FiTrash2 } from 'react-icons/fi'

const AdminReviews = () => {
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchReviews()
  }, [user])

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews/all')
      setReviews(res.data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApproval = async (reviewId, isApproved) => {
    try {
      await axios.put(`/reviews/${reviewId}/approve`, { isApproved })
      fetchReviews()
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Failed to update review')
    }
  }

  const deleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      await axios.delete(`/reviews/${reviewId}`)
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
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
              <Link key={item.id} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${item.id === 'reviews' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                {item.icon} <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-64 p-8 w-full">
          <h1 className="text-2xl font-bold mb-8">Reviews Management</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="h-6 shimmer rounded w-1/4 mb-4"></div>
                  <div className="h-4 shimmer rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <FiStar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-darkSecondary p-6 rounded-xl shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{review.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{review.name}</h3>
                          <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.isApproved ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Approved</span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Pending</span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">{review.comment}</p>

                  <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                    {review.isApproved ? (
                      <button onClick={() => updateApproval(review._id, false)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        <FiX /> Reject
                      </button>
                    ) : (
                      <button onClick={() => updateApproval(review._id, true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        <FiCheck /> Approve
                      </button>
                    )}
                    <button onClick={() => deleteReview(review._id)} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      <FiTrash2 /> Delete
                    </button>
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

export default AdminReviews

