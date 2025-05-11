const products = [
  {
    "name": "Wireless Headphones",
    "image": "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "description":
      "Experience immersive sound with our premium wireless headphones. Featuring active noise cancellation, 40-hour battery life, and ultra-comfortable ear cushions for all-day listening.",
    "brand": "SoundMaster",
    "category": "Electronics",
    "price": 149.99,
    "countInStock": 10,
    "rating": 4.5,
    "numReviews": 45,
    "discount": 10,
    "featured": true,
    "features": [
      "Active Noise Cancellation",
      "40-hour battery life",
      "Bluetooth 5.0 connectivity",
      "Built-in microphone for calls",
      "Foldable design for easy storage",
      "Compatible with all devices"
    ],
    "specifications": {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz-20kHz",
      "Impedance": "32 Ohms",
      "Battery Life": "40 hours",
      "Charging Time": "2 hours",
      "Weight": "250g"
    }
  },
  {
    "name": "Smartphone X Pro",
    "image": "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "description":
      "The latest flagship smartphone with cutting-edge features. Powered by a fast processor, featuring a high-resolution display, 5G connectivity, and a professional-grade camera system.",
    "brand": "TechGiant",
    "category": "Electronics",
    "price": 899.99,
    "countInStock": 7,
    "rating": 4.8,
    "numReviews": 102,
    "discount": 0,
    "featured": true,
    "features": [
      "6.7-inch Super AMOLED display",
      "5G connectivity",
      "Pro-grade camera system with 3 lenses",
      "All-day battery with fast charging",
      "Water and dust resistant",
      "Face and fingerprint unlock"
    ],
    "specifications": {
      "Display": "6.7-inch Super AMOLED",
      "Processor": "Octa-core 2.8GHz",
      "RAM": "8GB",
      "Storage": "256GB",
      "Battery": "4500mAh",
      "OS": "Android 13"
    }
  },
  {
    "name": "Designer Watch",
    "image": "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "description":
      "Elegant designer watch with premium craftsmanship. Features a classic leather strap, quartz movement, and water-resistant casing. Perfect for formal occasions or everyday wear.",
    "brand": "Chronos",
    "category": "Accessories",
    "price": 199.99,
    "countInStock": 15,
    "rating": 4.3,
    "numReviews": 38,
    "discount": 15,
    "featured": true,
    "features": [
      "Premium leather strap",
      "Swiss quartz movement",
      "Sapphire crystal glass",
      "Water-resistant to 50m",
      "Date display",
      "Stainless steel case"
    ],
    "specifications": {
      "Case Diameter": "42mm",
      "Band Material": "Genuine Leather",
      "Movement Type": "Swiss Quartz",
      "Water Resistance": "50m",
      "Battery Life": "3 years",
      "Weight": "78g"
    }
  },
  {
    "name": "Coffee Maker Deluxe",
    "image": "https://images.pexels.com/photos/2608388/pexels-photo-2608388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "description":
      "Advanced coffee maker with built-in grinder and multiple brewing options. Programmable timer allows you to wake up to freshly brewed coffee every morning.",
    "brand": "HomeStyle",
    "category": "Home & Kitchen",
    "price": 129.99,
    "countInStock": 12,
    "rating": 4.2,
    "numReviews": 56,
    "discount": 0,
    "featured": true,
    "features": [
      "Built-in conical burr grinder",
      "Programmable timer",
      "Multiple brewing options",
      "10-cup capacity",
      "Reusable filter included",
      "Auto-shutoff feature"
    ],
    "specifications": {
      "Capacity": "10 cups",
      "Power": "1000W",
      "Water Tank": "1.5L",
      "Dimensions": "25 x 20 x 35 cm",
      "Material": "Stainless Steel",
      "Filter Type": "Permanent"
    }
  },
  {
    "name": "Wireless Earbuds",
    "image": "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "description":
      "True wireless earbuds with outstanding sound quality. Features active noise cancellation, touch controls, and a charging case that provides up to 24 hours of total playtime.",
    "brand": "SoundMaster",
    "category": "Electronics",
    "price": 79.99,
    "countInStock": 20,
    "rating": 4.3,
    "numReviews": 89,
    "discount": 0,
    "featured": false,
    "features": [
      "True wireless design",
      "Active noise cancellation",
      "Touch controls",
      "IPX7 waterproof rating",
      "6-hour battery life (24 with case)",
      "USB-C fast charging"
    ],
    "specifications": {
      "Driver Size": "8mm",
      "Frequency Response": "20Hz-20kHz",
      "Battery Life": "6 hours (24 with case)",
      "Charging Time": "1.5 hours",
      "Bluetooth Version": "5.2",
      "Weight": "5g each"
    }
  },
  {
    name: "Bluetooth Speaker",
    image: "https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Portable Bluetooth speaker with 360° sound and deep bass. Waterproof design makes it perfect for outdoor use, while the 12-hour battery life keeps the music going all day.",
    brand: "SoundMaster",
    category: "Electronics",
    price: 99.99,
    countInStock: 8,
    rating: 4.1,
    numReviews: 56,
    discount: 15,
    featured: false,
    features: [
      "360° sound distribution",
      "IPX7 waterproof rating",
      "12-hour battery life",
      "Built-in microphone for calls",
      "Connect multiple speakers",
      "Durable fabric design"
    ],
    specifications: {
      "Power Output": "20W",
      "Battery Capacity": "3600mAh",
      "Frequency Response": "60Hz-20kHz",
      "Bluetooth Range": "30m",
      "Dimensions": "18 x 7 x 7 cm",
      "Weight": "550g"
    }
  },
  {
    name: "Athletic Shoes",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "High-performance athletic shoes designed for comfort and support. Features breathable mesh upper, responsive cushioning, and durable outsole for all-day comfort during workouts.",
    brand: "SportElite",
    category: "Clothing",
    price: 89.99,
    countInStock: 25,
    rating: 4.6,
    numReviews: 73,
    discount: 0,
    featured: false,
    features: [
      "Breathable mesh upper",
      "Responsive cushioning",
      "Durable rubber outsole",
      "Removable insole",
      "Reinforced heel support",
      "Reflective details for visibility"
    ],
    specifications: {
      "Upper Material": "Mesh and synthetic",
      "Sole Material": "Rubber",
      "Cushioning": "EVA foam",
      "Weight": "255g per shoe",
      "Arch Type": "Neutral",
      "Available Sizes": "7-13 US"
    }
  },
  {
    name: "Smart Fitness Watch",
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Advanced fitness tracker with heart rate monitoring, GPS, and multiple sport modes. Track your workouts, sleep, and health metrics with this waterproof smart watch.",
    brand: "TechFit",
    category: "Electronics",
    price: 149.99,
    countInStock: 18,
    rating: 4.4,
    numReviews: 62,
    discount: 10,
    featured: false,
    features: [
      "24/7 heart rate monitoring",
      "Built-in GPS",
      "20+ sport modes",
      "Sleep tracking",
      "5 ATM water resistance",
      "7-day battery life"
    ],
    specifications: {
      "Display": "1.3-inch AMOLED",
      "Battery Life": "Up to 7 days",
      "Water Resistance": "5 ATM",
      "Sensors": "Heart rate, accelerometer, gyroscope, GPS",
      "Connectivity": "Bluetooth 5.0",
      "Compatibility": "iOS 11+ and Android 7.0+"
    }
  }
];

export default products;