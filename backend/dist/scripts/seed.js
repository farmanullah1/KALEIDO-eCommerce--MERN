import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';
import { Cart } from '../src/models/Cart.js';
import { Order } from '../src/models/Order.js';
dotenv.config();
const products = [
    // Electronics
    {
        name: 'Quantum Sonic Headphones',
        slug: 'quantum-sonic-headphones',
        description: 'Immerse yourself in pure sound with active noise cancellation and spatial audio technology.',
        price: 299.99,
        comparePrice: 349.99,
        category: 'electronics',
        subcategory: 'Audio',
        brand: 'KALEIDO Tech',
        stock: 45,
        images: [
            'https://picsum.photos/seed/quantum-sonic/600/600',
            'https://picsum.photos/seed/quantum-sonic-2/600/600',
            'https://picsum.photos/seed/quantum-sonic-3/600/600'
        ],
        rating: { average: 4.8, count: 120 },
        isFeatured: true,
        tags: ['wireless', 'noise-cancelling', 'premium']
    },
    {
        name: 'Nebula Smartwatch V2',
        slug: 'nebula-smartwatch-v2',
        description: 'Track your vitals in style with the AMOLED display and 14-day battery life.',
        price: 199.99,
        category: 'electronics',
        subcategory: 'Wearables',
        brand: 'KALEIDO Tech',
        stock: 80,
        images: [
            'https://picsum.photos/seed/nebula-watch/600/600',
            'https://picsum.photos/seed/nebula-watch-2/600/600',
            'https://picsum.photos/seed/nebula-watch-3/600/600'
        ],
        rating: { average: 4.5, count: 85 },
        isFeatured: true,
        tags: ['fitness', 'smart', 'waterproof']
    },
    {
        name: 'Titan Pro Laptop',
        slug: 'titan-pro-laptop',
        description: 'The ultimate power machine for creators and professionals with M2-equivalent speed.',
        price: 1299.99,
        comparePrice: 1499.99,
        category: 'electronics',
        subcategory: 'Computers',
        brand: 'Titan',
        stock: 12,
        images: [
            'https://picsum.photos/seed/titan-laptop/600/600',
            'https://picsum.photos/seed/titan-laptop-2/600/600',
            'https://picsum.photos/seed/titan-laptop-3/600/600'
        ],
        rating: { average: 4.9, count: 42 },
        isFeatured: true,
        tags: ['performance', 'workstation', 'sleek']
    },
    {
        name: 'Aura Mechanical Keyboard',
        slug: 'aura-keyboard',
        description: 'Tactile, responsive, and fully customizable RGB lighting for the perfect typing experience.',
        price: 129.99,
        category: 'electronics',
        subcategory: 'Accessories',
        brand: 'Aura',
        stock: 55,
        images: [
            'https://picsum.photos/seed/aura-kb/600/600',
            'https://picsum.photos/seed/aura-kb-2/600/600',
            'https://picsum.photos/seed/aura-kb-3/600/600'
        ],
        rating: { average: 4.7, count: 210 },
        isFeatured: false,
        tags: ['gaming', 'rgb', 'mechanical']
    },
    {
        name: 'Zenith Smartphone',
        slug: 'zenith-phone',
        description: 'Capture the world in 8K with the most advanced camera system ever built into a phone.',
        price: 899.99,
        category: 'electronics',
        subcategory: 'Phones',
        brand: 'Zenith',
        stock: 30,
        images: [
            'https://picsum.photos/seed/zenith-phone/600/600',
            'https://picsum.photos/seed/zenith-phone-2/600/600',
            'https://picsum.photos/seed/zenith-phone-3/600/600'
        ],
        rating: { average: 4.6, count: 156 },
        isFeatured: false,
        tags: ['5G', '8K', 'fast-charging']
    },
    {
        name: 'Lumina Tablet Pro',
        slug: 'lumina-tablet',
        description: 'Thin, light, and powerful. The perfect companion for digital artists.',
        price: 599.99,
        category: 'electronics',
        subcategory: 'Tablets',
        brand: 'Lumina',
        stock: 0,
        images: [
            'https://picsum.photos/seed/lumina-tablet/600/600',
            'https://picsum.photos/seed/lumina-tablet-2/600/600',
            'https://picsum.photos/seed/lumina-tablet-3/600/600'
        ],
        rating: { average: 4.4, count: 98 },
        isFeatured: false,
        tags: ['tablet', 'creative', 'pro']
    },
    // Fashion
    {
        name: 'Cyberpunk Techwear Jacket',
        slug: 'cyberpunk-jacket',
        description: 'Water-resistant, multiple utility pockets, and built-in LED piping for the night city.',
        price: 189.99,
        comparePrice: 249.99,
        category: 'fashion',
        subcategory: 'Outerwear',
        brand: 'Neo Tokyo',
        stock: 25,
        images: [
            'https://picsum.photos/seed/tech-jacket/600/600',
            'https://picsum.photos/seed/tech-jacket-2/600/600',
            'https://picsum.photos/seed/tech-jacket-3/600/600'
        ],
        rating: { average: 4.9, count: 64 },
        isFeatured: true,
        tags: ['streetwear', 'techwear', 'led']
    },
    {
        name: 'Velocity Sneakers',
        slug: 'velocity-sneakers',
        description: 'Cloud-like comfort with a futuristic silhouette that turns heads.',
        price: 145.00,
        category: 'fashion',
        subcategory: 'Footwear',
        brand: 'Velocity',
        stock: 110,
        images: [
            'https://picsum.photos/seed/sneakers/600/600',
            'https://picsum.photos/seed/sneakers-2/600/600',
            'https://picsum.photos/seed/sneakers-3/600/600'
        ],
        rating: { average: 4.7, count: 430 },
        isFeatured: false,
        tags: ['comfort', 'style', 'running']
    },
    {
        name: 'Holographic Tote Bag',
        slug: 'holographic-tote',
        description: 'Shifts colors with every move. Spacious enough for all your essentials.',
        price: 55.00,
        category: 'fashion',
        subcategory: 'Accessories',
        brand: 'Prism',
        stock: 150,
        images: [
            'https://picsum.photos/seed/tote-bag/600/600',
            'https://picsum.photos/seed/tote-bag-2/600/600',
            'https://picsum.photos/seed/tote-bag-3/600/600'
        ],
        rating: { average: 4.8, count: 112 },
        isFeatured: false,
        tags: ['bag', 'holographic', 'fashion']
    },
    {
        name: 'Neon Dusk Sunglasses',
        slug: 'neon-dusk-sunglasses',
        description: 'Polarized lenses with a unique gradient tint and lightweight frames.',
        price: 79.00,
        category: 'fashion',
        subcategory: 'Eyewear',
        brand: 'Prism',
        stock: 90,
        images: [
            'https://picsum.photos/seed/sunglasses/600/600',
            'https://picsum.photos/seed/sunglasses-2/600/600',
            'https://picsum.photos/seed/sunglasses-3/600/600'
        ],
        rating: { average: 4.6, count: 89 },
        isFeatured: false,
        tags: ['uv-protection', 'trendy', 'lightweight']
    },
    {
        name: 'Stellar Chronograph Watch',
        slug: 'stellar-watch',
        description: 'A masterpiece of precision engineering and celestial-inspired design.',
        price: 350.00,
        category: 'fashion',
        subcategory: 'Watches',
        brand: 'Stellar',
        stock: 15,
        images: [
            'https://picsum.photos/seed/watch/600/600',
            'https://picsum.photos/seed/watch-2/600/600',
            'https://picsum.photos/seed/watch-3/600/600'
        ],
        rating: { average: 4.9, count: 28 },
        isFeatured: false,
        tags: ['luxury', 'precision', 'automatic']
    },
    {
        name: 'Infinity Oversized Hoodie',
        slug: 'infinity-hoodie',
        description: 'Premium heavy cotton with a minimal logo and an ultra-soft fleece interior.',
        price: 85.00,
        category: 'fashion',
        subcategory: 'Apparel',
        brand: 'Kaleido',
        stock: 200,
        images: [
            'https://picsum.photos/seed/hoodie/600/600',
            'https://picsum.photos/seed/hoodie-2/600/600',
            'https://picsum.photos/seed/hoodie-3/600/600'
        ],
        rating: { average: 4.8, count: 560 },
        isFeatured: false,
        tags: ['comfortable', 'minimal', 'unisex']
    },
    // Home Decor
    {
        name: 'Orbital Lava Lamp',
        slug: 'orbital-lava-lamp',
        description: 'Floating orbs of light that create a soothing, hypnotic atmosphere.',
        price: 65.00,
        category: 'home-decor',
        subcategory: 'Lighting',
        brand: 'Lumina',
        stock: 40,
        images: [
            'https://picsum.photos/seed/lava-lamp/600/600',
            'https://picsum.photos/seed/lava-lamp-2/600/600',
            'https://picsum.photos/seed/lava-lamp-3/600/600'
        ],
        rating: { average: 4.7, count: 180 },
        isFeatured: true,
        tags: ['vibe', 'retro-future', 'mood']
    },
    {
        name: 'Minimalist Geometric Vase',
        slug: 'geometric-vase',
        description: '3D printed with a unique Voronoi pattern. A statement piece for any room.',
        price: 45.00,
        category: 'home-decor',
        subcategory: 'Vases',
        brand: 'Form',
        stock: 35,
        images: [
            'https://picsum.photos/seed/vase/600/600',
            'https://picsum.photos/seed/vase-2/600/600',
            'https://picsum.photos/seed/vase-3/600/600'
        ],
        rating: { average: 4.9, count: 45 },
        isFeatured: false,
        tags: ['decor', 'modern', 'art']
    },
    {
        name: 'Infinity Mirror Wall Clock',
        slug: 'infinity-clock',
        description: 'LED lights create an endless tunnel of time on your wall.',
        price: 110.00,
        category: 'home-decor',
        subcategory: 'Clocks',
        brand: 'Timepiece',
        stock: 20,
        images: [
            'https://picsum.photos/seed/clock/600/600',
            'https://picsum.photos/seed/clock-2/600/600',
            'https://picsum.photos/seed/clock-3/600/600'
        ],
        rating: { average: 4.8, count: 32 },
        isFeatured: false,
        tags: ['wall-art', 'led', 'futuristic']
    },
    {
        name: 'Silk Velvet Throw Blanket',
        slug: 'velvet-blanket',
        description: 'Incredibly soft and luxurious. Perfect for cozy nights in.',
        price: 75.00,
        category: 'home-decor',
        subcategory: 'Bedding',
        brand: 'Cozy',
        stock: 60,
        images: [
            'https://picsum.photos/seed/blanket/600/600',
            'https://picsum.photos/seed/blanket-2/600/600',
            'https://picsum.photos/seed/blanket-3/600/600'
        ],
        rating: { average: 4.9, count: 145 },
        isFeatured: false,
        tags: ['soft', 'luxury', 'home']
    },
    {
        name: 'Aromatic Candle Set',
        slug: 'candle-set',
        description: 'Three unique scents inspired by the elements: Ether, Plasma, and Void.',
        price: 39.00,
        category: 'home-decor',
        subcategory: 'Fragrance',
        brand: 'Scent',
        stock: 100,
        images: [
            'https://picsum.photos/seed/candles/600/600',
            'https://picsum.photos/seed/candles-2/600/600',
            'https://picsum.photos/seed/candles-3/600/600'
        ],
        rating: { average: 4.7, count: 88 },
        isFeatured: false,
        tags: ['aroma', 'relax', 'gift']
    },
    // Beauty
    {
        name: 'Glow Essence Skincare Set',
        slug: 'glow-essence',
        description: 'Complete routine for radiant, hydrated skin with our patented Bio-Luminance complex.',
        price: 120.00,
        comparePrice: 160.00,
        category: 'beauty',
        subcategory: 'Skincare',
        brand: 'Glow',
        stock: 50,
        images: [
            'https://picsum.photos/seed/skincare/600/600',
            'https://picsum.photos/seed/skincare-2/600/600',
            'https://picsum.photos/seed/skincare-3/600/600'
        ],
        rating: { average: 4.8, count: 240 },
        isFeatured: false,
        tags: ['skincare', 'natural', 'glow']
    },
    {
        name: 'Midnight Bloom Perfume',
        slug: 'midnight-bloom',
        description: 'Mysterious, floral, and long-lasting. A scent that evolves with the night.',
        price: 95.00,
        category: 'beauty',
        subcategory: 'Fragrance',
        brand: 'Bloom',
        stock: 45,
        images: [
            'https://picsum.photos/seed/perfume/600/600',
            'https://picsum.photos/seed/perfume-2/600/600',
            'https://picsum.photos/seed/perfume-3/600/600'
        ],
        rating: { average: 4.7, count: 125 },
        isFeatured: false,
        tags: ['perfume', 'luxury', 'floral']
    },
    {
        name: 'Matte Liquid Lipstick Kit',
        slug: 'lipstick-kit',
        description: 'Five bold shades that stay put all day without drying your lips.',
        price: 48.00,
        category: 'beauty',
        subcategory: 'Makeup',
        brand: 'ColorPop',
        stock: 120,
        images: [
            'https://picsum.photos/seed/lipstick/600/600',
            'https://picsum.photos/seed/lipstick-2/600/600',
            'https://picsum.photos/seed/lipstick-3/600/600'
        ],
        rating: { average: 4.6, count: 310 },
        isFeatured: false,
        tags: ['makeup', 'matte', 'long-lasting']
    },
    {
        name: 'Refresh Facial Mist',
        slug: 'facial-mist',
        description: 'Instant hydration and energy for your skin throughout the day.',
        price: 24.00,
        category: 'beauty',
        subcategory: 'Skincare',
        brand: 'Glow',
        stock: 0,
        images: [
            'https://picsum.photos/seed/mist/600/600',
            'https://picsum.photos/seed/mist-2/600/600',
            'https://picsum.photos/seed/mist-3/600/600'
        ],
        rating: { average: 4.5, count: 76 },
        isFeatured: false,
        tags: ['skincare', 'mist', 'refresh']
    },
    // Sports
    {
        name: 'Pro-Grip Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip surface with perfect cushioning for your daily practice.',
        price: 89.00,
        category: 'sports',
        subcategory: 'Yoga',
        brand: 'Zen',
        stock: 75,
        images: [
            'https://picsum.photos/seed/yoga-mat/600/600',
            'https://picsum.photos/seed/yoga-mat-2/600/600',
            'https://picsum.photos/seed/yoga-mat-3/600/600'
        ],
        rating: { average: 4.9, count: 215 },
        isFeatured: false,
        tags: ['fitness', 'yoga', 'pro']
    },
    {
        name: 'HydraSmart Bottle',
        slug: 'smart-bottle',
        description: 'Keeps water icy cold for 24h and tracks your intake via LED glow.',
        price: 45.00,
        category: 'sports',
        subcategory: 'Accessories',
        brand: 'Hydra',
        stock: 130,
        images: [
            'https://picsum.photos/seed/water-bottle/600/600',
            'https://picsum.photos/seed/water-bottle-2/600/600',
            'https://picsum.photos/seed/water-bottle-3/600/600'
        ],
        rating: { average: 4.7, count: 189 },
        isFeatured: false,
        tags: ['fitness', 'smart', 'health']
    },
    {
        name: 'Force Resistance Bands',
        slug: 'resistance-bands',
        description: 'Five levels of resistance for a complete full-body workout anywhere.',
        price: 35.00,
        category: 'sports',
        subcategory: 'Gym',
        brand: 'Force',
        stock: 100,
        images: [
            'https://picsum.photos/seed/bands/600/600',
            'https://picsum.photos/seed/bands-2/600/600',
            'https://picsum.photos/seed/bands-3/600/600'
        ],
        rating: { average: 4.8, count: 540 },
        isFeatured: false,
        tags: ['gym', 'workout', 'portable']
    }
];
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');
        // Clear existing data
        await Product.deleteMany({});
        console.log('Products cleared.');
        // Check if we should clear users/carts/orders too (usually yes for fresh seed)
        await User.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
        console.log('Users, Carts, and Orders cleared.');
        // Insert new products
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products.`);
        process.exit();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDB();
//# sourceMappingURL=seed.js.map