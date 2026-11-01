const categories = [
  { name: "Hand Tools", icon: "hammer", color: "peach" },
  { name: "Power Tools", icon: "drill", color: "blue" },
  { name: "Electrical Items", icon: "zap", color: "yellow" },
  { name: "Plumbing Supplies", icon: "faucet", color: "mint" },
  { name: "Paints & Accessories", icon: "paint-roller", color: "pink" },
  { name: "Building Materials", icon: "brick-wall", color: "sand" },
  { name: "Fasteners", icon: "nut", color: "slate" },
  { name: "Safety Equipment", icon: "hard-hat", color: "green" },
];

const products = [
  { id: "h01", name: "ProGrip Claw Hammer", brand: "STANLEY", category: "Hand Tools", price: 649, oldPrice: 899, discount: 28, stock: "In stock", image: "https://images.unsplash.com/photo-1581147036324-c1c5f6e8ed1c?auto=format&fit=crop&w=900&q=85", tag: "BESTSELLER", description: "A balanced, forged steel claw hammer built for everyday repairs and reliable performance on site." },
  { id: "p01", name: "Compact Impact Drill", brand: "BOSCH", category: "Power Tools", price: 3299, oldPrice: 3999, discount: 18, stock: "In stock", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=85", tag: "POPULAR", description: "A versatile corded impact drill with variable speed control for drilling into wood, metal and masonry." },
  { id: "e01", name: "Modular Switch Socket Set", brand: "ANCHOR", category: "Electrical Items", price: 285, oldPrice: 350, discount: 19, stock: "In stock", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=85", tag: "", description: "A durable, clean-finish modular switch and socket set designed for safe, dependable everyday use." },
  { id: "pl01", name: "Brass Angle Valve 1/2 in", brand: "JAQUAR", category: "Plumbing Supplies", price: 475, oldPrice: 590, discount: 19, stock: "In stock", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=85", tag: "", description: "Solid brass construction with a smooth quarter-turn handle. A dependable choice for bathroom and kitchen fittings." },
  { id: "pa01", name: "WeatherGuard Exterior Paint", brand: "ASIAN PAINTS", category: "Paints & Accessories", price: 1849, oldPrice: 2199, discount: 16, stock: "In stock", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=900&q=85", tag: "STAFF PICK", description: "Long-lasting exterior protection with rich, even coverage. Available in a wide range of shades on request." },
  { id: "b01", name: "Heavy Duty Cement 50 kg", brand: "ULTRATECH", category: "Building Materials", price: 395, oldPrice: 430, discount: 8, stock: "In stock", image: "https://images.unsplash.com/photo-1513467655676-561b7d489a88?auto=format&fit=crop&w=900&q=85", tag: "", description: "A trusted general-purpose cement for masonry, plastering and residential construction projects." },
  { id: "f01", name: "Assorted Hex Bolt Set", brand: "TVS", category: "Fasteners", price: 220, oldPrice: 275, discount: 20, stock: "In stock", image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=900&q=85", tag: "VALUE PICK", description: "A practical assortment of corrosion-resistant hex bolts in common sizes, supplied in a reusable organizer." },
  { id: "s01", name: "SiteGuard Safety Helmet", brand: "KARAM", category: "Safety Equipment", price: 499, oldPrice: 625, discount: 20, stock: "In stock", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85", tag: "", description: "A comfortable, adjustable safety helmet designed to provide reliable protection on busy work sites." },
];
