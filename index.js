/* =========================================
   1. LOGIC SLIDER (QUẢNG CÁO) - FADE EFFECT
   ========================================= */
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(index) {
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    
    // Xóa class 'active' của tất cả các slide (để chúng mờ đi)
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Xóa class 'active' của tất cả các dấu chấm
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Thêm class 'active' cho slide và dấu chấm hiện tại (để nó từ từ hiện ra)
    if(slides.length > 0) slides[slideIndex].classList.add('active');
    if(dots.length > 0) dots[slideIndex].classList.add('active');
}

function changeSlide(n) {
    slideIndex += n;
    showSlide(slideIndex);
    resetInterval();
}

function currentSlide(n) {
    slideIndex = n;
    showSlide(slideIndex);
    resetInterval();
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => changeSlide(1), 4000); // 4 giây đổi 1 lần
}

// Khởi tạo slider
showSlide(slideIndex);
resetInterval();

/* =========================================
   2. LOGIC HIỂN THỊ 4 SẢN PHẨM & TÌM KIẾM
   ========================================= */
const searchInput = document.getElementById('searchInput');
const noProductMsg = document.getElementById('noProductMsg');
const allProducts = document.querySelectorAll('.product');
const MAX_DISPLAY = 4; 

function showLatestProducts() {
    allProducts.forEach((product, index) => {
        if (index < MAX_DISPLAY) {
            product.style.display = "flex"; 
        } else {
            product.style.display = "none"; 
        }
    });
}

showLatestProducts();

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const keyword = searchInput.value.toLowerCase().trim();
        let hasVisibleProduct = false;

        if (keyword === '') {
            showLatestProducts();
            noProductMsg.style.display = "none";
            return;
        }

        allProducts.forEach(product => {
            const productName = product.querySelector('h3').innerText.toLowerCase();
            if (productName.includes(keyword)) {
                product.style.display = "flex"; 
                hasVisibleProduct = true;
            } else {
                product.style.display = "none";  
            }
        });

        if (!hasVisibleProduct) {
            noProductMsg.style.display = "block";
        } else {
            noProductMsg.style.display = "none";
        }
    });

    /* --- TỰ ĐỘNG CUỘN XUỐNG KHI TÌM KIẾM --- */
    searchInput.addEventListener('focus', function() {
        const productsSection = document.querySelector('.products-container');
        const header = document.querySelector('header');
        
        if (productsSection && header) {
            const headerHeight = header.offsetHeight;
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerHeight - 20;

            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    });
}

/* =========================================
   3. LOGIC HIỆU ỨNG POP-UP ĐĂNG NHẬP (Chỉ giữ lại đóng/mở)
   ========================================= */
const loginModal = document.getElementById('loginModal');
const btnLogin = document.getElementById('btnLogin');
const closeX = document.querySelector('.close-modal');

// Mở Pop-up khi bấm nút "Đăng nhập"
if (btnLogin && loginModal) {
    btnLogin.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}

// Đóng Pop-up khi bấm dấu X
if (closeX && loginModal) {
    closeX.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}

// Đóng Pop-up khi click ra vùng đen bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

/* =========================================
   6. ĐỒNG BỘ DỮ LIỆU SẢN PHẨM SANG GIỎ HÀNG
   ========================================= */
function syncProductsToLocalStorage() {
    const products = document.querySelectorAll('.product');
    const productList = [];

    products.forEach((p, index) => {
        const img = p.querySelector('img').src;
        const name = p.querySelector('h3').innerText;
        const price = p.querySelector('.price').innerText;
        
        productList.push({
            id: 'SP_' + index, // Tạo ID tự động dựa trên vị trí
            img: img,
            name: name,
            price: price,
        });
    });

    // Lưu toàn bộ mảng sản phẩm vào localStorage
    localStorage.setItem('allProducts', JSON.stringify(productList));
}

// Chạy hàm đồng bộ ngay khi load trang chủ
syncProductsToLocalStorage();