import { FiMessageCircle } from 'react-icons/fi'

const WhatsAppButton = () => {
  const phoneNumber = '919876543210' // Replace with actual number
  const message = 'Hello Gongura Hotel, I would like to place an order.'
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 float-animation"
      aria-label="Order via WhatsApp"
    >
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
        <FiMessageCircle className="w-8 h-8 text-white" />
      </div>
    </a>
  )
}

export default WhatsAppButton

