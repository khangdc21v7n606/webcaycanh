/* =========================================
   1. LẤY DỮ LIỆU SẢN PHẨM & RENDER TRANG CỬA HÀNG
   ========================================= */
const shopGrid = document.getElementById('shopGrid');
// Lấy danh sách sản phẩm từ TrangChu đã lưu trong localStorage
const allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];

function renderShop() {
    if (allProducts.length === 0) {
        shopGrid.innerHTML = `<p style="text-align:center; grid-column: 1/-1;">Chưa có sản phẩm nào được đồng bộ từ Trang Chủ. Hãy quay lại Trang Chủ để load dữ liệu.</p>`;
        return;
    }

    let html = '';
    allProducts.forEach(product => {
        html += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <button class="btn-add-cart" onclick="addToCart('${product.id}')">Thêm vào giỏ hàng</button>
            </div>
        `;
    });
    shopGrid.innerHTML = html;
}

renderShop(); // Chạy hàm hiển thị

/* =========================================
   2. LOGIC GIỎ HÀNG (SỬ DỤNG currentPHPUser TỪ PHP)
   ========================================= */
let cart = []; 
// Biến currentPHPUser đã được khai báo ở file PHP
let cartStorageKey = 'cart_' + currentPHPUser; 

function loadCart() {
    cart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];
}
loadCart(); // Chạy hàm lấy giỏ hàng

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function parsePrice(priceStr) {
    return parseInt(priceStr.replace(/\D/g, ''));
}

function formatPrice(number) {
    return number.toLocaleString('vi-VN') + 'đ';
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            img: product.img,
            price: product.price, 
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}
/* =========================================
   3. CẬP NHẬT GIAO DIỆN (UI) GIỎ HÀNG
   ========================================= */
const cartItemsList = document.getElementById('cartItemsList');
const cartBadge = document.getElementById('cartBadge');
const totalItemsDisplay = document.getElementById('totalItems');
const totalPriceDisplay = document.getElementById('totalPrice');

function updateCartUI() {
    // 1. Cập nhật số lượng trên Icon
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.innerText = totalItems;
    totalItemsDisplay.innerText = totalItems;

    // 2. Tính tổng tiền
    let totalPrice = 0;
    
    // 3. Render danh sách item trong Popup
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart">Giỏ hàng của bạn đang trống.</p>';
    } else {
        let html = '';
        cart.forEach(item => {
            const itemPriceNum = parsePrice(item.price);
            totalPrice += itemPriceNum * item.quantity;

            html += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <span class="price">${item.price}</span>
                        <div class="item-controls">
                            <div class="qty-box">
                                <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                            </div>
                            <button class="btn-remove" onclick="removeFromCart('${item.id}')">Xóa</button>
                        </div>
                    </div>
                </div>
            `;
        });
        cartItemsList.innerHTML = html;
    }

    // Hiển thị tổng tiền
    totalPriceDisplay.innerText = formatPrice(totalPrice);
}

updateCartUI(); // Chạy cập nhật UI ngay khi load trang

/* =========================================
   4. ĐÓNG / MỞ POPUP GIỎ HÀNG & TOAST
   ========================================= */
const cartFloatBtn = document.getElementById('cartFloatBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');

// Mở giỏ hàng
cartFloatBtn.addEventListener('click', () => {
    cartOverlay.classList.add('active');
});

// Đóng giỏ hàng
closeCartBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
});

// Nhấn ra ngoài vùng đen để đóng
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
        cartOverlay.classList.remove('active');
    }
});

// Hiệu ứng Toast "Đã thêm vào giỏ hàng"
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    // Tự động ẩn sau 2.5 giây
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}