import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiClock, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-brand font-bold text-2xl">G</span>
              </div>
              <div>
                <h2 className="font-brand text-2xl font-bold">Gongura Hotel</h2>
                <p className="text-sm text-gray-300">Authentic Andhra Cuisine</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Experience the authentic taste of Andhra cuisine in Madanapalle. 
              Best biryani, curries, and traditional dishes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-gray-300 hover:text-primary transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-primary transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-300">
                  Main Road, Madanapalle<br />
                  Andhra Pradesh, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary" />
                <span className="text-gray-300">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary" />
                <span className="text-gray-300">info@gongurahotel.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3">
                <FiClock className="w-5 h-5 text-primary" />
                <span className="text-gray-300">Monday - Sunday</span>
              </li>
              <li className="text-gray-300 ml-8">6:00 AM - 11:00 PM</li>
            </ul>
            <div className="mt-4 p-4 bg-primary/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🥗 <strong> Lunch:</strong> 12:00 PM - 3:00 PM<br/>
                🍛 <strong>Dinner:</strong> 7:00 PM - 10:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {currentYear} Gongura Hotel. All rights reserved.
            <br className="md:hidden" />
            <span className="md:mx-2">|</span>
            Made with ❤️ in Madanapalle
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

