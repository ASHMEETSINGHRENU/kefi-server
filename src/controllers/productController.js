import { Product } from '../models/Product.js';
import { getDBStatus } from '../config/db.js';

// Initial curated seed listings for in-memory and initial DB population
export const initialProducts = [
  {
    _id: 'prod_101',
    title: 'Ivory & Gold Zardozi Bridal Lehenga',
    sku: 'KEFI-B101',
    category: 'Bridal Couture',
    price: 85000,
    currency: 'INR',
    description: 'Bespoke hand-embroidered raw silk lehenga with intricate dabka, zardozi and pearl detailing on an ivory canvas. Paired with a double net dupatta.',
    images: [
      'https://shobitam.com/cdn/shop/files/KF-29Pink_4.jpg?v=1740989894&width=1800',
    ],
    badge: 'Bestseller',
    fabric: 'Pure Raw Silk, Net & Organza',
    colors: ['Ivory', 'Soft Gold', 'Rose Tint'],
    status: 'Active',
    featured: true,
    createdAt: new Date('2026-10-01').toISOString(),
    updatedAt: new Date('2026-10-01').toISOString(),
  },
  {
    _id: 'prod_102',
    title: 'Royal Scarlet Velvet Festive Lehenga',
    sku: 'KEFI-F202',
    category: "Women's Wear",
    price: 62000,
    currency: 'INR',
    description: 'Rich crimson velvet lehenga adorned with traditional peacock motifs, resham embroidery, and antique gold sequins for winter weddings.',
    images: [
      'https://assets.mytribe.in/insecure/rs:fill:420:560/f:webp/plain/s3://mytribe-assets-production/d7049107-392f-4278-8fcc-6620e2b632b0',
    ],
    badge: 'New Arrival',
    fabric: 'Micro Velvet & Organza',
    colors: ['Scarlet Red', 'Antique Gold'],
    status: 'Active',
    featured: true,
    createdAt: new Date('2026-10-05').toISOString(),
    updatedAt: new Date('2026-10-05').toISOString(),
  },
  {
    _id: 'prod_103',
    title: 'Powder Blue Asymmetric Fusion Tunic',
    sku: 'KEFI-C303',
    category: 'Contemporary',
    price: 24500,
    currency: 'INR',
    description: 'Sculpted crepe silk asymmetric tunic with pleated organza cuffs and delicate mirrorwork accent on the collar.',
    images: [
      'https://img.theloom.in/blog/wp-content/uploads/2026/10/vj431fs26-07kpbluevj431urgent12092026_4_.png',
    ],
    badge: 'Trending',
    fabric: 'Crepe Silk & Tissue Organza',
    colors: ['Powder Blue', 'Ice Silver'],
    status: 'Active',
    featured: false,
    createdAt: new Date('2026-10-08').toISOString(),
    updatedAt: new Date('2026-10-08').toISOString(),
  },
  {
    _id: 'prod_104',
    title: 'Heritage Charcoal Silk Men’s Bandhgala',
    sku: 'KEFI-M404',
    category: "Men's Wear",
    price: 38000,
    currency: 'INR',
    description: 'Structured formal bandhgala tailored in charcoal matka silk, finished with monogrammed metal buttons and tailored trousers.',
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT559tSwVGGK-dTqcihccqlg-9WRFeiMgKv3ybetqp23g&s=10',
    ],
    badge: 'Bestseller',
    fabric: 'Handwoven Matka Silk',
    colors: ['Charcoal Gray', 'Midnight Black'],
    status: 'Active',
    featured: true,
    createdAt: new Date('2026-10-10').toISOString(),
    updatedAt: new Date('2026-10-10').toISOString(),
  },
  {
    _id: 'prod_105',
    title: 'Peach Blossom Karwa Chauth Anarkali',
    sku: 'KEFI-O505',
    category: 'Occasion Wear',
    price: 34000,
    currency: 'INR',
    description: 'Floor-length georgette anarkali with fine threadwork embroidery, gotapatti border, and matching scalloped dupatta.',
    images: [
      'https://media.gettyimages.com/id/1774538452/photo/woman-looking-through-sieve-during-karva-chauth-ceremony.jpg?s=612x612&w=0&k=20&c=D3uohkQ1QHRXTLkNxSg2_1ahicAfky3GcPKOSgeXAog=',
    ],
    badge: 'Limited Edition',
    fabric: 'Pure Georgette & Shantoon',
    colors: ['Blush Pink', 'Peach', 'Rose'],
    status: 'Active',
    featured: true,
    createdAt: new Date('2026-10-12').toISOString(),
    updatedAt: new Date('2026-10-12').toISOString(),
  },
  {
    _id: 'prod_106',
    title: 'Minimalist Hand-Block Printed Cotton Co-ord',
    sku: 'KEFI-E606',
    category: 'Everyday Elegance',
    price: 14500,
    currency: 'INR',
    description: 'Breathable mulmul cotton long kurta with straight pants, hand-block botanical motifs, and mother-of-pearl buttons.',
    images: [
      'https://m.media-amazon.com/images/I/41diBwpwkxL._AC_UY1100_.jpg',
    ],
    badge: 'None',
    fabric: '100% Organic Mulmul Cotton',
    colors: ['Off-White', 'Muted Indigo'],
    status: 'Draft',
    featured: false,
    createdAt: new Date('2026-10-14').toISOString(),
    updatedAt: new Date('2026-10-14').toISOString(),
  },
];

// In-memory array fallback if MongoDB is not connected
export let inMemoryProducts = [...initialProducts];

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, status, search, limit = 50, sort = 'newest' } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(initialProducts.map(({ _id, ...rest }) => rest));
      }

      const query = {};
      if (category && category !== 'All') query.category = category;
      if (status && status !== 'All') query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { fabric: { $regex: search, $options: 'i' } },
        ];
      }

      const sortOption = sort === 'newest' ? { createdAt: -1 } : sort === 'price-low' ? { price: 1 } : { price: -1 };
      const products = await Product.find(query).sort(sortOption).limit(Number(limit));
      return res.json({ success: true, count: products.length, products });
    }

    // In-memory fallback
    let filtered = [...inMemoryProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          p.fabric.toLowerCase().includes(s)
      );
    }

    if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return res.json({
      success: true,
      count: filtered.length,
      products: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product listing not found' });
      }
      return res.json({ success: true, product });
    }

    const product = inMemoryProducts.find((p) => p._id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product listing not found' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// POST /api/products (Admin only)
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      category,
      price,
      currency = 'INR',
      description,
      images = [],
      badge = 'None',
      fabric,
      colors = [],
      status = 'Active',
      featured = false,
      sku,
    } = req.body;

    if (!title || !category || price === undefined || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Category, Price, and Description.',
      });
    }

    const productPayload = {
      title: title.trim(),
      sku: sku ? sku.trim().toUpperCase() : 'KEFI-' + Math.floor(1000 + Math.random() * 9000),
      category,
      price: Number(price),
      currency,
      description: description.trim(),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://shobitam.com/cdn/shop/files/KF-29Pink_4.jpg?v=1740989894&width=1800'],
      badge,
      fabric: fabric ? fabric.trim() : 'Pure Silk',
      colors: Array.isArray(colors) && colors.length > 0 ? colors : ['Blush Pink'],
      status,
      featured: Boolean(featured),
    };

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const created = await Product.create(productPayload);
      return res.status(201).json({
        success: true,
        message: 'New outfit listing created successfully.',
        product: created,
      });
    }

    // In-memory fallback
    const newRecord = {
      _id: 'prod_' + Date.now(),
      ...productPayload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryProducts.unshift(newRecord);

    return res.status(201).json({
      success: true,
      message: 'New outfit listing created successfully in repository.',
      product: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id (Admin only)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Product listing not found' });
      }
      return res.json({
        success: true,
        message: 'Product listing updated successfully.',
        product: updated,
      });
    }

    const index = inMemoryProducts.findIndex((p) => p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product listing not found' });
    }

    inMemoryProducts[index] = {
      ...inMemoryProducts[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.json({
      success: true,
      message: 'Product listing updated successfully.',
      product: inMemoryProducts[index],
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id (Admin only)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product listing not found' });
      }
      return res.json({ success: true, message: 'Product listing deleted successfully.' });
    }

    const initialLen = inMemoryProducts.length;
    inMemoryProducts = inMemoryProducts.filter((p) => p._id !== id);
    if (inMemoryProducts.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Product listing not found' });
    }

    return res.json({ success: true, message: 'Product listing deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
