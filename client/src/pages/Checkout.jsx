import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppContext } from '../App'
import axios from 'axios'
import { FiCheck, FiCreditCard, FiDollarSign } from 'react-icons/fi'

const Checkout = () => {
  const { user, cart, cartTotal, clearCart } = useContext(AppContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    deliveryAddress: user?.address || '',
    paymentMethod: 'cod',
    notes: ''
  })

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart')
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        phone: user.phone || '',
        deliveryAddress: user.address || ''
      }))
    }
  }, [user, cart, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.paymentMethod === 'online') {
        // Create order first for online payment
        const orderRes = await axios.post('/orders', {
          items: cart,
          totalAmount: cartTotal,
          deliveryCharge: 0,
          ...formData
        })

        // Initialize Razorpay
        const razorpayRes = await axios.post('/payment/create-order', {
          amount: cartTotal,
          orderId: orderRes.data.order._id
        })

        // Load Razorpay script
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.head.appendChild(script)

        script.onload = () => {
          const rzp = new window.Razorpay({
            key_id: 'your_razorpay_key_id',
            amount: razorpayRes.data.amount,
            currency: 'INR',
            name: 'Gongura Hotel',
            description: 'Order Payment',
            order_id: razorpayRes.data.orderId,
            handler: async (response) => {
              try {
                await axios.put(`/orders/${orderRes.data.order._id}/payment`, {
                  paymentStatus: 'paid',
                  paymentId: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
                clearCart()
                navigate('/orders', { state: { orderId: orderRes.data.order._id } })
              } catch (error) {
                console.error('Payment verification failed:', error)
                alert('Payment verification failed')
              }
            },
            prefill: {
              name: formData.customerName,
              phone: formData.phone
            }
          })
          rzp.open()
        }
      } else {
        // Cash on delivery
        await axios.post('/orders', {
          items: cart,
          totalAmount: cartTotal,
          deliveryCharge: 0,
          ...formData
        })
        clearCart()
        navigate('/orders')
      }
    } catch (error) {
      console.error('Order error:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24 pb-12">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">Please Login to Continue</h2>
            <p className="text-gray-500 mb-8">You need to be logged in to place an order.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-outline">Register</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark pt-24 pb-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Details */}
          <div>
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address</label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    required
                    className="input"
                    rows="3"
                    placeholder="Complete delivery address"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input"
                    rows="2"
                    placeholder="Any special instructions"
                  ></textarea>
                </div>

                <h3 className="text-lg font-semibold mt-6 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <FiDollarSign className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${formData.paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <FiCreditCard className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <span className="font-medium">Online Payment</span>
                      <p className="text-sm text-gray-500">Pay now via Razorpay</p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary mt-6"
                >
                  {loading ? 'Processing...' : formData.paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-sm">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

