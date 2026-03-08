import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../App'
import { FiArrowRight, FiStar, FiClock, FiMapPin, FiPhone, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Home = () => {
  const { addToCart } = useContext(AppContext)
  const [featuredItems, setFeaturedItems] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [menuRes, reviewsRes] = await Promise.all([
        axios.get('/menu/featured'),
        axios.get('/reviews')
      ])
      setFeaturedItems(menuRes.data.menuItems || [])
      setReviews(reviewsRes.data.reviews?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div 
          className="hero-overlay"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="hero-content">
          <h1 className="font-brand text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Gongura Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
            Authentic Andhra Cuisine in Madanapalle
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto animate-slide-up animation-delay-100">
            Experience the rich flavors of traditional Andhra cooking. 
            From aromatic biryanis to authentic curries, we serve happiness on a plate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-200">
            <Link to="/menu" className="btn btn-primary text-lg px-8 py-4">
              Order Now <FiArrowRight className="inline ml-2" />
            </Link>
            <a href="#location" className="btn btn-outline border-white text-white hover:bg-white hover:text-gray-800 text-lg px-8 py-4">
              Visit Us
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white dark:bg-darkSecondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-dark">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quick and fresh delivery within Madanapalle town
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-dark">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Food</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fresh ingredients and authentic recipes
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-dark">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dine-in Available</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comfortable seating with ambient atmosphere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="section bg-gray-50 dark:bg-dark">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Signature Dishes</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most loved dishes, crafted with love and authentic Andhra spices
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="h-48 shimmer rounded-lg mb-4"></div>
                  <div className="h-6 shimmer rounded mb-2"></div>
                  <div className="h-4 shimmer rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.slice(0, 4).map((item) => (
                <div key={item._id} className="menu-card">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="menu-card-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
                    }}
                  />
                  <h3 className="menu-card-title">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="menu-card-price">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="btn btn-primary py-2 px-4 text-sm"
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/menu" className="btn btn-outline">
              View Full Menu <FiArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Items Carousel */}
      <section className="section bg-white dark:bg-darkSecondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Items</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Most ordered dishes by our happy customers
            </p>
          </div>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[280px] card p-4">
                  <div className="h-40 shimmer rounded-lg mb-4"></div>
                  <div className="h-5 shimmer rounded mb-2"></div>
                  <div className="h-4 shimmer rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {featuredItems.map((item) => (
                <div key={item._id} className="min-w-[280px] card p-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
                    }}
                  />
                  <h3 className="font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="btn btn-primary py-1.5 px-3 text-sm"
                      disabled={!item.isAvailable}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section bg-gray-50 dark:bg-dark">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real reviews from our valued customers
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 shimmer rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 shimmer rounded w-24 mb-1"></div>
                      <div className="h-3 shimmer rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-16 shimmer rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review._id} className="card p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FiStar 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="section bg-white dark:bg-darkSecondary">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Us</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're located in the heart of Madanapalle
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="rounded-xl overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48561.81557424918!2d78.455074!3d13.939569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb266d03f6f7a3d%3A0x6b4f2f3a2f3a2f3a!2sMadanapalle%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1634567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Restaurant Location"
              ></iframe>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Main Road, Madanapalle<br />
                    Andhra Pradesh 517325
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Opening Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monday - Sunday: 6:00 AM - 11:00 PM<br />
                    Lunch: 12:00 PM - 3:00 PM<br />
                    Dinner: 7:00 PM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our menu and place your order now!
          </p>
          <Link to="/menu" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4">
            View Menu <FiArrowRight className="inline ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home

