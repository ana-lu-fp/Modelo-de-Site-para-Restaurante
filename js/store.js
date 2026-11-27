
const WHATSAPP_NUMBER = "5541985337031";

const PRODUCTS = [
    { id: 1, name: "Bife de Chorizo na Brasa 400g", category: "Carnes Nobres", price: 115.00, image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80", desc: "Corte nobre suculento acompanhado de batatas rústicas e chimichurri." },
    { id: 2, name: "Burger Artesanal Angus Prime", category: "Hambúrgueres", price: 48.00, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", desc: "Blend Angus 180g, queijo cheddar inglês, bacon crispy e molho especial." },
    { id: 3, name: "Risoto de Camarão ao Limão Siciliano", category: "Massas & Risotos", price: 92.00, image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80", desc: "Arroz arbóreo cremoso com camarões flambados no vinho branco." },
    { id: 4, name: "Tomahawk Angus 1.2kg (Para 2 Pessoas)", category: "Carnes Nobres", price: 240.00, image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80", desc: "Corte espetacular grelhado na parrilla com guarnições completas." },
    { id: 5, name: "Gin Tônica Botânica Autoral", category: "Bebidas & Drinques", price: 34.00, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80", desc: "Gin premium, especiarias selecionadas, zimbro e tônica artesanal." },
    { id: 6, name: "Petit Gateau com Sorvete de Baunilha", category: "Massas & Risotos", price: 32.00, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", desc: "Bolo de chocolate belga quente com recheio cremoso e sorvete artesanal." }
];

let cart = JSON.parse(localStorage.getItem("restaurantCart")) || [];

function saveCart() {
    localStorage.setItem("restaurantCart", JSON.stringify(cart));
}

function renderIcons() {
    if (window.lucide) window.lucide.createIcons();
}

function toggleCartDrawer() {
    document.getElementById("cartDrawer").classList.toggle("open");
    document.getElementById("drawerOverlay").classList.toggle("open");
    renderCartDrawer();
}

function addToCart(id) {
    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ ...prod, qty: 1 });
    saveCart();
    updateCartCount();
    toggleCartDrawer();
}

function updateCartQty(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartCount();
    renderCartDrawer();
}

function updateCartCount() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const countEl = document.getElementById("cartCount");
    if (countEl) countEl.innerText = count;
}

function renderCartDrawer() {
    const listEl = document.getElementById("drawerCartItems");
    const totalEl = document.getElementById("drawerTotalPrice");
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

    if (totalEl) totalEl.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    if (listEl) {
        listEl.innerHTML = cart.length ? cart.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #333; padding-bottom:12px;">
                <div>
                    <strong style="font-size:0.95rem; display:block; color:#fff;">${item.name}</strong>
                    <small style="color:#aaa;">R$ ${item.price.toFixed(2).replace('.', ',')} un.</small>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="updateCartQty(${item.id}, -1)" style="padding:2px 8px; background:#444; color:#fff; border:none; border-radius:4px; cursor:pointer;">-</button>
                    <span style="font-weight:700; color:#fff;">${item.qty}</span>
                    <button onclick="updateCartQty(${item.id}, 1)" style="padding:2px 8px; background:#444; color:#fff; border:none; border-radius:4px; cursor:pointer;">+</button>
                </div>
            </div>
        `).join("") : "<p style='color:#888;'>Sua sacola está vazia.</p>";
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) { alert("Sua sacola está vazia!"); return; }
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const msg = `Olá, *Gourmet & Grill*! Gostaria de fazer o seguinte pedido:\n\n` +
        cart.map(i => `• ${i.qty}x ${i.name} (R$ ${(i.price * i.qty).toFixed(2).replace('.', ',')})`).join("\n") +
        `\n\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

function reserveTableWhatsApp(e) {
    e.preventDefault();
    const name = document.getElementById("resName").value;
    const people = document.getElementById("resPeople").value;
    const date = document.getElementById("resDate").value;

    const msg = `Olá, *Gourmet & Grill*! Gostaria de reservar uma mesa:\n\n` +
        `*Nome:* ${name}\n*Pessoas:* ${people}\n*Data/Horário:* ${date}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

function renderProducts() {
    const allGrid = document.getElementById("allProductsGrid");
    if (allGrid) {
        const search = (document.getElementById("productSearch")?.value || "").toLowerCase();
        const cat = document.getElementById("productCategoryFilter")?.value || "Todas";
        const filtered = PRODUCTS.filter(p => {
            const matchS = p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search);
            const matchC = cat === "Todas" || p.category === cat;
            return matchS && matchC;
        });
        allGrid.innerHTML = filtered.length ? filtered.map(cardTpl).join("") : "<p style='color:#888;'>Nenhum prato encontrado.</p>";
    }
    renderIcons();
}

function cardTpl(p) {
    return `
        <div class="product-card">
            <div class="card-img-wrap">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="card-body">
                <div>
                    <span class="card-tag">${p.category}</span>
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                </div>
                <div>
                    <div class="card-price">R$ ${p.price.toFixed(2).replace('.', ',')}</div>
                    <button class="btn-outline" onclick="addToCart(${p.id})">
                        <i data-lucide="plus" style="width:16px; height:16px;"></i> Adicionar à Sacola
                    </button>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartCount();
    renderIcons();
});
