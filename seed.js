// =====================================================
// SEED SCRIPT - Populate Initial Data
// =====================================================

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Review = require('./models/Review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gongura_hotel';

// Sample menu items data
const menuItems = [
  // Andhra Meals
  {
    name: 'Andhra Spl Meal',
    description: 'Authentic Andhra traditional meal with rice, sambar, curries, pickle, papad and sweet',
    price: 250,
    category: 'Andhra Meals',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 3,
    prepTime: 25,
    tags: ['vegetarian', 'thali', 'authentic']
  },
  {
    name: 'Veg Thali',
    description: 'Complete vegetarian thali with variety of curries, rice, roti and desserts',
    price: 200,
    category: 'Andhra Meals',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    prepTime: 20,
    tags: ['vegetarian', 'thali']
  },
  {
    name: 'Non-Veg Thali',
    description: 'Full thali with chicken curry, egg, rice, roti and sides',
    price: 300,
    category: 'Andhra Meals',
    image: 'https://images.unsplash.com/photo-1603894584373-2ae398?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 3,
    prepTime: 25,
    tags: ['non-veg', 'thali']
  },

  // Biryani
  {
    name: 'Chicken Dum Biryani',
    description: 'Traditional Hyderabad-style chicken biryani with aromatic basmati rice and spices',
    price: 350,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 4,
    prepTime: 35,
    tags: ['non-veg', 'biryani', 'popular']
  },
  {
    name: 'Mutton Biryani',
    description: 'Premium mutton biryani with tender pieces cooked in dum style',
    price: 450,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 4,
    prepTime: 40,
    tags: ['non-veg', 'biryani', 'premium']
  },
  {
    name: 'Veg Biryani',
    description: 'Flavorful vegetable biryani with mixed veggies and aromatic spices',
    price: 250,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1593008846237-10949a163c11?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    prepTime: 30,
    tags: ['vegetarian', 'biryani']
  },
  {
    name: 'Egg Biryani',
    description: 'Fragrant biryani topped with boiled eggs and caramelized onions',
    price: 280,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1626838152964-1e3268497438?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 3,
    prepTime: 30,
    tags: ['egg', 'biryani']
  },

  // Tiffins
  {
    name: 'Idli Sambar',
    description: 'Soft idlis served with hot sambar and variety of chutneys',
    price: 80,
    category: 'Tiffins',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    prepTime: 15,
    tags: ['vegetarian', 'breakfast', 'south-indian']
  },
  {
    name: 'Dosa',
    description: 'Crispy rice and lentil crepe served with sambar and chutney',
    price: 100,
    category: 'Tiffins',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    prepTime: 15,
    tags: ['vegetarian', 'breakfast', 'south-indian']
  },
  {
    name: 'Puri with Bhaji',
    description: 'Fluffy puris with spicy potato bhaji and chutney',
    price: 120,
    category: 'Tiffins',
    image: 'https://images.unsplash.com/photo-1626132647523-66dbeac34534?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 3,
    prepTime: 20,
    tags: ['vegetarian', 'breakfast']
  },
  {
    name: 'Upma',
    description: 'Savory semolina cooked with vegetables and spices',
    price: 70,
    category: 'Tiffins',
    image: 'https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    prepTime: 15,
    tags: ['vegetarian', 'breakfast']
  },
  {
    name: 'Pongal',
    description: 'Traditional South Indian rice and lentil dish with pepper and cashews',
    price: 90,
    category: 'Tiffins',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    prepTime: 15,
    tags: ['vegetarian', 'breakfast']
  },

  // Starters
  {
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken appetizer with curry leaves and ginger',
    price: 250,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 5,
    prepTime: 20,
    tags: ['non-veg', 'starter', 'popular']
  },
  {
    name: 'Chicken Lollipop',
    description: 'Crispy chicken lollipops with spicy sauce',
    price: 280,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 4,
    prepTime: 25,
    tags: ['non-veg', 'starter']
  },
  {
    name: 'Veg Manchurian',
    description: 'Crispy vegetable balls in spicy manchurian sauce',
    price: 180,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1619250906677-c902a5936e0f?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 3,
    prepTime: 20,
    tags: ['vegetarian', 'starter', 'chinese']
  },
  {
    name: 'Gobi 65',
    description: 'Spicy cauliflower bites with aromatic spices',
    price: 160,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 4,
    prepTime: 18,
    tags: ['vegetarian', 'starter']
  },
  {
    name: 'Paneer 65',
    description: 'Crispy paneer cubes with spicy coating',
    price: 200,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 4,
    prepTime: 18,
    tags: ['vegetarian', 'starter', 'paneer']
  },
  {
    name: 'Fish Fry',
    description: 'Crispy fried fish with Andhra-style masala',
    price: 300,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 4,
    prepTime: 20,
    tags: ['non-veg', 'starter', 'fish']
  },

  // Curries
  {
    name: 'Chicken Curry',
    description: 'Authentic Andhra chicken curry with Gongura leaves',
    price: 280,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 4,
    prepTime: 30,
    tags: ['non-veg', 'curry', 'popular']
  },
  {
    name: 'Mutton Curry',
    description: 'Tender mutton cooked in spicy gravy with traditional spices',
    price: 380,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 5,
    prepTime: 40,
    tags: ['non-veg', 'curry', 'premium']
  },
  {
    name: 'Fish Curry',
    description: 'Fresh fish in tangy curry with authentic Andhra spices',
    price: 320,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 4,
    prepTime: 25,
    tags: ['non-veg', 'curry', 'fish']
  },
  {
    name: 'Palak Paneer',
    description: 'Creamy spinach curry with cottage cheese cubes',
    price: 220,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    prepTime: 25,
    tags: ['vegetarian', 'curry', 'paneer']
  },
  {
    name: 'Dal Tadka',
    description: 'Tempered lentils with garlic and spices',
    price: 150,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    prepTime: 20,
    tags: ['vegetarian', 'curry', 'lentils']
  },
  {
    name: 'Gongura Chicken',
    description: 'Signature dish - chicken with sour gongura leaves',
    price: 300,
    category: 'Curries',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 4,
    prepTime: 30,
    tags: ['non-veg', 'curry', 'signature']
  },

  // Beverages
  {
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk',
    price: 30,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 2,
    prepTime: 5,
    tags: ['drinks', 'tea', 'hot']
  },
  {
    name: 'Coffee',
    description: 'Hot filtered coffee with authentic South Indian taste',
    price: 40,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 1,
    prepTime: 5,
    tags: ['drinks', 'coffee', 'hot']
  },
  {
    name: 'Badam Milk',
    description: 'Cool almond milk with cardamom and saffron',
    price: 60,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1567252924529-d324e0a13086?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 1,
    prepTime: 5,
    tags: ['drinks', 'cold', 'milk']
  },
  {
    name: 'Buttermilk',
    description: 'Refreshing spiced buttermilk (Chaas)',
    price: 40,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 2,
    prepTime: 3,
    tags: ['drinks', 'cold', 'summer']
  },
  {
    name: 'Fresh Lime Water',
    description: 'Fresh lime soda with salt and sugar',
    price: 35,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 1,
    prepTime: 3,
    tags: ['drinks', 'cold', 'summer']
  },

  // Desserts
  {
    name: 'Gulab Jamun',
    description: 'Soft doughnuts soaked in rose-flavored sugar syrup',
    price: 60,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400',
    isAvailable: true,
    isFeatured: true,
    spiceLevel: 1,
    prepTime: 10,
    tags: ['dessert', 'sweet', 'popular']
  },
  {
    name: 'Rasgulla',
    description: 'Spongy cottage cheese balls in light syrup',
    price: 70,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 1,
    prepTime: 10,
    tags: ['dessert', 'sweet']
  },
  {
    name: 'Jalebi',
    description: 'Crispy fried batter soaked in saffron syrup',
    price: 80,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 1,
    prepTime: 10,
    tags: ['dessert', 'sweet', 'crispy']
  },
  {
    name: 'Ice Cream',
    description: 'Choice of vanilla, chocolate, strawberry or mango',
    price: 80,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400',
    isAvailable: true,
    isFeatured: false,
    spiceLevel: 1,
    prepTime: 5,
    tags: ['dessert', 'cold']
  }
];

// Sample reviews
const reviews = [
  {
    name: 'Ravi Kumar',
    rating: 5,
    comment: 'Best biryani in Madanapalle! The chicken dum biryani is absolutely delicious. Will definitely order again.',
    isApproved: true
  },
  {
    name: 'Sridevi',
    rating: 5,
    comment: 'Authentic Andhra taste. The Gongura chicken is their signature dish - highly recommended!',
    isApproved: true
  },
  {
    name: 'Mahesh',
    rating: 4,
    comment: 'Great food and quick delivery. The idlis were soft and sambar was tasty.',
    isApproved: true
  },
  {
    name: 'Lakshmi',
    rating: 5,
    comment: 'Family loved the veg thali. Very authentic and fresh.',
    isApproved: true
  },
  {
    name: 'Prasad',
    rating: 4,
    comment: 'Good service and tasty food. The chicken 65 starter was crispy and flavorful.',
    isApproved: true
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('🔄 Creating admin user...');
    const adminUser = await User.create({
      name: 'Gongura Hotel Admin',
      email: process.env.ADMIN_EMAIL || 'admin@gongurahotel.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      address: 'Madanapalle, Andhra Pradesh'
    });
    console.log('✅ Admin user created');

    // Create sample user
    console.log('🔄 Creating sample user...');
    const sampleUser = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      phone: '+91 9876543211',
      address: 'Madanapalle'
    });
    console.log('✅ Sample user created');

    // Create menu items
    console.log('🔄 Creating menu items...');
    const createdItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Created ${createdItems.length} menu items`);

    // Create reviews
    console.log('🔄 Creating reviews...');
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@gongurahotel.com / admin123');
    console.log('   User:  user@test.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

