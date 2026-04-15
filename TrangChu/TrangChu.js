/* =========================================
   1. LOGIC SLIDER (QUẢNG CÁO)
   ========================================= */
let slideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(index) {
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove('active'));
    
    if(slides.length > 0) slides[slideIndex].style.display = "block";
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
    slideInterval = setInterval(() => changeSlide(1), 3000); 
}

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
   3. LOGIC POP-UP ĐĂNG NHẬP MỚI
   ========================================= */
const loginModal = document.getElementById('loginModal');
const btnLogin = document.getElementById('btnLogin');
const closeX = document.querySelector('.close-modal');
const btnSubmitLogin = document.getElementById('btnSubmitLogin');

// 1. Mở Pop-up
if (btnLogin && loginModal) {
    btnLogin.addEventListener('click', () => {
        loginModal.style.display = 'block';
        // Xóa thông báo lỗi và làm trống ô nhập khi mở lại form
        document.getElementById('loginErrorMessage').style.display = 'none';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    });
}

// 2. Đóng Pop-up
if (closeX && loginModal) {
    closeX.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}
// Đóng khi click ra vùng đen bên ngoài
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
});

// 3. Xử lý Nút Xác Nhận Đăng Nhập
if (btnSubmitLogin) {
    btnSubmitLogin.addEventListener('click', () => {
        const user = document.getElementById('loginUsername').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();
        const errorMsg = document.getElementById('loginErrorMessage');

        if (user === "" || pass === "") {
            errorMsg.innerText = "Vui lòng điền đầy đủ thông tin!";
            errorMsg.style.display = "block";
            return;
        }

        const savedPass = localStorage.getItem(user);

        if (savedPass && savedPass === pass) {
            localStorage.setItem('currentUser', user); 
            alert("Đăng nhập thành công!");
            loginModal.style.display = 'none'; 
            checkLoginStatus(); 
        } else {
            errorMsg.innerText = "Tên đăng nhập hoặc mật khẩu không đúng!";
            errorMsg.style.display = "block";
        }
    });
}

// 4. Xử lý Đăng xuất
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('currentUser'); // Xóa phiên đăng nhập
        checkLoginStatus(); // Cập nhật lại UI header
        alert("Đã đăng xuất!");
        
        // (Tùy chọn) Nếu bạn muốn khi đăng xuất, web tự động quay về trang chủ để reset mọi thứ:
        window.location.reload(); 
    });
}
// 5. Cập nhật giao diện Header
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const guestSection = document.getElementById('guestSection');
    const userSection = document.getElementById('userSection');
    const nameDisplay = document.getElementById('userNameDisplay');

    if (currentUser) {
        if(guestSection) guestSection.style.display = 'none';
        if(userSection) userSection.style.display = 'block';
        if(nameDisplay) nameDisplay.innerText = `Chào, ${currentUser}`;
    } else {
        if(guestSection) guestSection.style.display = 'block';
        if(userSection) userSection.style.display = 'none';
    }
}

checkLoginStatus();

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