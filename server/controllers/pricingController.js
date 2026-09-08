const Product = require('../models/Product');

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

function getProductSizes(product) {
  return product.sizes?.length ? product.sizes : DEFAULT_SIZES;
}

function getVariantPrice(product, colorIndex = 0) {
  const variant = product.variants?.[colorIndex];
  return variant?.currentPrice ?? product.currentPrice ?? 0;
}

function calculateLineItem(product, { size, bottomSize, colorIndex = 0, addons = [], quantity = 1 }) {
  const sizes = getProductSizes(product);
  if (!sizes.includes(size)) {
    throw new Error(`Invalid size: ${size}`);
  }

  const stock = product.stockBySize?.get?.(size) ?? product.stockBySize?.[size];
  if (stock !== undefined && stock !== null && stock <= 0) {
    throw new Error(`Size ${size} is out of stock`);
  }

  const unitPrice = getVariantPrice(product, colorIndex);
  let addonsTotal = 0;
  const resolvedAddons = [];

  for (const addonInput of addons) {
    const addon = product.addons?.find((a) => a._id?.toString() === addonInput.addonId || a.name === addonInput.name);
    if (!addon) throw new Error(`Invalid addon: ${addonInput.addonId || addonInput.name}`);
    if (addon.hasSizes && addonInput.size) {
      if (!addon.sizes?.includes(addonInput.size)) {
        throw new Error(`Invalid addon size for ${addon.name}`);
      }
    }
    addonsTotal += addon.price;
    resolvedAddons.push({
      name: addon.name,
      price: addon.price,
      size: addonInput.size,
    });
  }

  const lineTotal = (unitPrice + addonsTotal) * quantity;

  const variant = product.variants?.[colorIndex];
  return {
    productId: product._id,
    productTitle: product.title,
    designerName: product.designerName,
    imageUrl: product.imageUrl || variant?.images?.[0],
    size,
    bottomSize,
    color: variant?.color,
    addons: resolvedAddons,
    unitPrice: unitPrice + addonsTotal,
    quantity,
    lineTotal,
  };
}

const calculatePrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, bottomSize, colorIndex = 0, addons = [], quantity = 1 } = req.body;

    if (!size) {
      return res.status(400).json({ message: 'Size is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const lineItem = calculateLineItem(product, { size, bottomSize, colorIndex, addons, quantity });

    res.json({
      valid: true,
      unitPrice: lineItem.unitPrice,
      lineTotal: lineItem.lineTotal,
      quantity,
      product: {
        id: product._id,
        title: product.title,
        designerName: product.designerName,
        currentPrice: getVariantPrice(product, colorIndex),
        productCode: product.productCode,
      },
    });
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message });
  }
};

const calculateCart = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    const resolvedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ valid: false, message: `Product not found: ${item.productId}` });
      }

      const lineItem = calculateLineItem(product, {
        size: item.size,
        bottomSize: item.bottomSize,
        colorIndex: item.colorIndex ?? 0,
        addons: item.addons ?? [],
        quantity: item.quantity ?? 1,
      });

      if (item.price !== undefined && Math.abs(item.price - lineItem.unitPrice) > 0.01) {
        return res.status(400).json({
          valid: false,
          message: `Price mismatch for ${product.title}. Expected ${lineItem.unitPrice}, got ${item.price}`,
        });
      }

      resolvedItems.push(lineItem);
      subtotal += lineItem.lineTotal;
    }

    const shipping = subtotal > 0 ? 200 : 0;
    const total = subtotal + shipping;

    res.json({ valid: true, items: resolvedItems, subtotal, shipping, total });
  } catch (error) {
    res.status(400).json({ valid: false, message: error.message });
  }
};

module.exports = { calculatePrice, calculateCart, calculateLineItem, getVariantPrice };
