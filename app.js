const rupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const cartStorageKey = "forge-field-cart-v1";
const whatsappNumber = "919876543210";
let activeCategory = "All";
let searchQuery = "";
let cart = loadCart();
let toastTimer;

const productGrid = document.querySelector("#product-grid");
const categoryGrid = document.querySelector("#category-grid");
const filterRow = document.querySelector("#filter-row");
const searchInput = document.querySelector("#site-search");
const cartDrawer = document.querySelector("#cart-drawer");
const productModal = document.querySelector("#product-modal");

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    return Array.isArray(stored) ? stored.filter((item) => products.some((product) => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

function money(amount) {
  return `₹${rupees.format(amount)}`;
}

function icon(name, className = "") {
  return `<i data-lucide="${name}"${className ? ` class="${className}"` : ""}></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function renderCategories() {
  categoryGrid.innerHTML = categories.map((category, index) => `
    <button class="category-tile" data-category="${category.name}" style="--tile-delay:${index * 45}ms">
      <span class="category-icon ${category.color}">${icon(category.icon)}</span>
      <span class="category-name">${category.name}</span>
      <span class="category-arrow">${icon("arrow-up-right")}</span>
    </button>`).join("");

  filterRow.innerHTML = ["All", ...categories.map((category) => category.name)].map((name) => `
    <button class="filter-chip${activeCategory === name ? " selected" : ""}" data-category="${name}">${name}</button>`).join("");
  refreshIcons();
}

function productCard(product, index) {
  return `
    <article class="product-card" style="--card-delay:${index * 50}ms">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ""}
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="quick-view" data-details="${product.id}" aria-label="View ${product.name} details">${icon("scan-eye")}<span>Quick view</span></button>
      </div>
      <div class="product-info">
        <div class="product-meta"><span>${product.brand}</span><span class="stock"><i></i>${product.stock}</span></div>
        <h3>${product.name}</h3>
        <div class="product-price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
        <div class="product-actions"><button class="button button-dark add-cart" data-add="${product.id}">${icon("shopping-bag")} Add to cart</button><button class="details-button" data-details="${product.id}" aria-label="View details for ${product.name}">${icon("arrow-up-right")}</button></div>
      </div>
    </article>`;
}

function visibleProducts() {
  let result = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
    return matchesCategory && searchable.includes(searchQuery.trim().toLowerCase());
  });
  const sorting = document.querySelector("#sort-select").value;
  if (sorting === "low") result = [...result].sort((a, b) => a.price - b.price);
  if (sorting === "high") result = [...result].sort((a, b) => b.price - a.price);
  return result;
}

function renderProducts() {
  const result = visibleProducts();
  productGrid.innerHTML = result.map(productCard).join("");
  document.querySelector("#result-count").textContent = `${result.length} ${result.length === 1 ? "item" : "items"}`;
  document.querySelector("#empty-state").hidden = result.length > 0;
  productGrid.hidden = result.length === 0;
  refreshIcons();
}

function setCategory(category) {
  activeCategory = category;
  renderCategories();
  renderProducts();
  document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveCart() {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  renderCart();
}

function addToCart(id, quantity = 1) {
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id, quantity });
  saveCart();
  const product = products.find((item) => item.id === id);
  showToast(`${product.name} added to your cart`);
}

function cartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function renderCart() {
  const count = cartQuantity();
  const countElement = document.querySelector("#cart-count");
  countElement.textContent = count > 99 ? "99+" : count;
  countElement.classList.toggle("has-items", count > 0);
  document.querySelector("#drawer-count").textContent = `(${count})`;
  const cartItems = document.querySelector("#cart-items");
  cartItems.innerHTML = cart.map((item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return `<article class="cart-item">
      <img src="${product.image}" alt="" />
      <div class="cart-item-info"><span>${product.brand}</span><h3>${product.name}</h3><strong>${money(product.price)}</strong>
        <div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Decrease ${product.name} quantity">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button></div>
      </div><button class="remove-item" data-remove="${product.id}" aria-label="Remove ${product.name}">${icon("trash-2")}</button>
    </article>`;
  }).join("");
  const total = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  document.querySelector("#cart-subtotal").textContent = money(total);
  document.querySelector("#cart-empty").hidden = count > 0;
  document.querySelector("#cart-footer").hidden = count === 0;
  refreshIcons();
}

function changeQuantity(id, amount) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveCart();
}

function openCart() {
  closeMobileMenu();
  cartDrawer.classList.add("open");
  document.querySelector("#scrim").classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  document.querySelector("#cart-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  if (!productModal.classList.contains("open")) document.querySelector("#scrim").classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function openDetails(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  productModal.innerHTML = `<button class="modal-close icon-button" id="modal-close" aria-label="Close product details">${icon("x")}</button>
    <div class="modal-content"><div class="modal-image"><img src="${product.image}" alt="${product.name}" /></div><div class="modal-info"><span class="modal-category">${product.category} / ${product.brand}</span><h2 id="modal-title">${product.name}</h2><div class="modal-price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del><span>Save ${product.discount}%</span>` : ""}</div><div class="modal-stock"><i></i>${product.stock} · Ready for your next project</div><p>${product.description}</p><div class="modal-details-line"><span>Brand</span><strong>${product.brand}</strong></div><div class="modal-details-line"><span>Category</span><strong>${product.category}</strong></div><button class="button button-orange modal-add" data-add="${product.id}">${icon("shopping-bag")} Add to cart</button><a class="modal-whatsapp" href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like to ask about ${product.name}.`)}" target="_blank" rel="noreferrer">Ask us about this item ${icon("arrow-up-right")}</a></div></div>`;
  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  document.querySelector("#scrim").classList.add("visible");
  document.body.classList.add("no-scroll");
  refreshIcons();
  document.querySelector("#modal-close").focus();
}

function closeDetails() {
  productModal.classList.remove("open");
  productModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("open")) {
    document.querySelector("#scrim").classList.remove("visible");
    document.body.classList.remove("no-scroll");
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function openMobileMenu() {
  document.querySelector("#mobile-nav").classList.add("open");
  document.querySelector("#mobile-nav").setAttribute("aria-hidden", "false");
  document.querySelector("#scrim").classList.add("visible");
  document.body.classList.add("no-scroll");
}

function closeMobileMenu() {
  const menu = document.querySelector("#mobile-nav");
  menu.classList.remove("open");
  menu.setAttribute("aria-hidden", "true");
  if (!cartDrawer.classList.contains("open") && !productModal.classList.contains("open")) {
    document.querySelector("#scrim").classList.remove("visible");
    document.body.classList.remove("no-scroll");
  }
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const detailsButton = event.target.closest("[data-details]");
  const categoryButton = event.target.closest("[data-category]");
  const changeButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  const modalCloseButton = event.target.closest("#modal-close");
  const filterAll = event.target.closest('[data-filter="all"]');
  if (addButton) addToCart(addButton.dataset.add);
  if (detailsButton) openDetails(detailsButton.dataset.details);
  if (modalCloseButton) closeDetails();
  if (categoryButton) setCategory(categoryButton.dataset.category);
  if (changeButton) changeQuantity(changeButton.dataset.quantity, Number(changeButton.dataset.change));
  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove);
    saveCart();
    showToast("Item removed from your cart");
  }
  if (filterAll) {
    activeCategory = "All";
    searchQuery = "";
    searchInput.value = "";
    renderCategories();
    renderProducts();
  }
});

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderProducts();
});

document.querySelector("#sort-select").addEventListener("change", renderProducts);
document.querySelector("#cart-open").addEventListener("click", openCart);
document.querySelector("#cart-close").addEventListener("click", closeCart);
document.querySelector("#continue-shopping").addEventListener("click", closeCart);
document.querySelector("#continue-shopping-bottom").addEventListener("click", closeCart);
document.querySelector("#scrim").addEventListener("click", () => {
  closeCart();
  closeDetails();
  closeMobileMenu();
});
document.querySelector("#menu-open").addEventListener("click", openMobileMenu);
document.querySelector("#menu-close").addEventListener("click", closeMobileMenu);
document.querySelectorAll("#mobile-nav a").forEach((link) => link.addEventListener("click", closeMobileMenu));
document.querySelectorAll(".desktop-nav a").forEach((link) => link.addEventListener("click", () => {
  document.querySelectorAll(".desktop-nav a").forEach((item) => item.classList.remove("active"));
  link.classList.add("active");
}));
document.querySelector("#whatsapp-order").addEventListener("click", () => {
  if (!cart.length) return;
  const lines = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return `• ${product.name} x ${item.quantity} — ${money(product.price * item.quantity)}`;
  });
  const total = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.quantity, 0);
  const message = `Hi Forge & Field, I'd like to place an order:\n${lines.join("\n")}\n\nEstimated subtotal: ${money(total)}\nPlease confirm availability and delivery.`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const subject = `Hardware enquiry from ${fields.get("name")}`;
  const body = `${fields.get("message")}\n\nName: ${fields.get("name")}\nEmail: ${fields.get("email")}\nPhone: ${fields.get("phone") || "Not provided"}`;
  document.querySelector("#form-note").textContent = "Opening your email app with your enquiry...";
  window.location.href = `mailto:hello@forgeandfield.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelector("#scroll-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
window.addEventListener("scroll", () => document.querySelector("#scroll-top").classList.toggle("visible", window.scrollY > 560), { passive: true });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeDetails();
    closeMobileMenu();
  }
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    searchInput.focus();
  }
});
document.querySelector("#current-year").textContent = new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
refreshIcons();
window.setTimeout(() => document.querySelector("#loader").classList.add("loaded"), 650);
