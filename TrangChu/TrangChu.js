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
    
    // Ẩn tất cả và bỏ class active của dot
    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Hiển thị slide hiện tại
    slides[slideIndex].style.display = "block";
    dots[slideIndex].classList.add('active');
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
    slideInterval = setInterval(() => changeSlide(1), 3000); // Tự động chạy mỗi 3s
}

// Khởi tạo slider
showSlide(slideIndex);
resetInterval();

/* =========================================
   2. LOGIC TÌM KIẾM SẢN PHẨM (REAL-TIME)
   ========================================= */
const searchInput = document.getElementById('searchInput');
const noProductMsg = document.getElementById('noProductMsg');

/* --- TỰ ĐỘNG CUỘN XUỐNG KHI NHẤP VÀO Ô TÌM KIẾM --- */
searchInput.addEventListener('focus', function() {
    const productsSection = document.querySelector('.products-container');
    const header = document.querySelector('header');
    
    // Tính toán vị trí của phần sản phẩm, trừ đi chiều cao của header (vì header của bạn đang dính ở trên cùng)
    const headerHeight = header.offsetHeight;
    const elementPosition = productsSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerHeight - 20; // Trừ thêm 20px để có khoảng thở đẹp mắt

    // Lệnh cuộn trang mượt mà
    window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
});

// Sự kiện input sẽ kích hoạt mỗi khi gõ phím
searchInput.addEventListener('input', function() {
    const keyword = searchInput.value.toLowerCase().trim();
    // Lấy TẤT CẢ sản phẩm hiện có trong DOM tại thời điểm gõ
    // Nhờ cách này, nếu HTML thêm sản phẩm mới thì hàm vẫn hoạt động bình thường
    const products = document.querySelectorAll('.product'); 
    let hasVisibleProduct = false;

    products.forEach(product => {
        // Tìm thẻ h3 chứa tên cây bên trong mỗi product
        const productName = product.querySelector('h3').innerText.toLowerCase();
        
        if (productName.includes(keyword)) {
            product.style.display = "block"; // Hiện nếu khớp
            hasVisibleProduct = true;
        } else {
            product.style.display = "none";  // Ẩn nếu không khớp
        }
    });

    // Hiện thông báo "Không tìm thấy" nếu không có sản phẩm nào
    if (!hasVisibleProduct) {
        noProductMsg.style.display = "block";
    } else {
        noProductMsg.style.display = "none";
    }
});

/* =========================================
   3. LOGIC ĐĂNG NHẬP / ĐĂNG KÝ (LOCALSTORAGE)
   ========================================= */
const modal = document.getElementById('authModal');
const closeBtn = document.querySelector('.close-btn');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');
const btnLogout = document.getElementById('btnLogout');

// Elements trong Modal
const modalTitle = document.getElementById('modalTitle');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const btnSubmitAuth = document.getElementById('btnSubmitAuth');
const modalSwitchText = document.getElementById('modalSwitchText');
const modalSwitchLink = document.getElementById('modalSwitchLink');
const modalError = document.getElementById('modalError');

let isLoginMode = true; // Cờ xác định đang ở form Đăng nhập hay Đăng ký

// Cập nhật giao diện Header dựa vào trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        document.getElementById('guestSection').style.display = "none";
        document.getElementById('userSection').style.display = "block";
        document.getElementById('userNameDisplay').innerText = `Chào, ${currentUser}`;
    } else {
        document.getElementById('guestSection').style.display = "block";
        document.getElementById('userSection').style.display = "none";
    }
}
// Chạy hàm kiểm tra ngay khi load trang
checkLoginStatus();

// Mở modal
function openModal(mode) {
    isLoginMode = mode === 'login';
    updateModalUI();
    modal.style.display = 'block';
    modalError.style.display = 'none';
    usernameInput.value = '';
    passwordInput.value = '';
}

// Đóng modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// Cập nhật chữ trong Modal tùy thuộc mode
function updateModalUI() {
    if (isLoginMode) {
        modalTitle.innerText = "Đăng nhập";
        modalSwitchText.innerText = "Chưa có tài khoản?";
        modalSwitchLink.innerText = "Đăng ký ngay";
    } else {
        modalTitle.innerText = "Đăng ký";
        modalSwitchText.innerText = "Đã có tài khoản?";
        modalSwitchLink.innerText = "Đăng nhập ngay";
    }
}

// Chuyển đổi qua lại giữa form Đăng ký / Đăng nhập
modalSwitchLink.onclick = (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateModalUI();
    modalError.style.display = 'none';
};

// Gắn sự kiện mở modal cho các nút trên Header
btnLogin.onclick = () => openModal('login');
btnRegister.onclick = () => openModal('register');

// Xử lý khi bấm nút "Xác nhận" trong Modal
btnSubmitAuth.onclick = () => {
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (!user || !pass) {
        showError("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (isLoginMode) {
        // XỬ LÝ ĐĂNG NHẬP
        const savedPass = localStorage.getItem(user); // Lấy mật khẩu từ localStorage
        if (savedPass && savedPass === pass) {
            localStorage.setItem('currentUser', user); // Lưu phiên đăng nhập
            modal.style.display = "none";
            checkLoginStatus();
            alert("Đăng nhập thành công!");
        } else {
            showError("Tài khoản hoặc mật khẩu không chính xác!");
        }
    } else {
        // XỬ LÝ ĐĂNG KÝ
        if (localStorage.getItem(user)) {
            showError("Tên đăng nhập đã tồn tại!");
        } else {
            localStorage.setItem(user, pass); // Lưu tài khoản mới
            alert("Đăng ký thành công! Đang tự động đăng nhập...");
            localStorage.setItem('currentUser', user);
            modal.style.display = "none";
            checkLoginStatus();
        }
    }
};

// Xử lý Đăng xuất
btnLogout.onclick = () => {
    localStorage.removeItem('currentUser'); // Xóa phiên đăng nhập
    checkLoginStatus(); // Cập nhật lại UI header
    alert("Đã đăng xuất!");
};

function showError(msg) {
    modalError.innerText = msg;
    modalError.style.display = "block";
}