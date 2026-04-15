/* ================= 1. DỮ LIỆU SẢN PHẨM ================= */
// Mảng chứa dữ liệu sản phẩm (bạn có thể thêm sản phẩm mới vào đây, thanh tìm kiếm vẫn sẽ hoạt động)
const products = [
    { id: 1, name: "Cây Kim Tiền", price: "150.000 VNĐ", image: "https://placehold.co/300x300/27ae60/ffffff?text=Kim+Tien" },
    { id: 2, name: "Sen Đá Kim Cương", price: "50.000 VNĐ", image: "https://placehold.co/300x300/27ae60/ffffff?text=Sen+Da" },
    { id: 3, name: "Cây Bàng Singapore", price: "250.000 VNĐ", image: "https://placehold.co/300x300/27ae60/ffffff?text=Bang+Singapore" },
    { id: 4, name: "Bonsai Linh Sam", price: "850.000 VNĐ", image: "https://placehold.co/300x300/27ae60/ffffff?text=Bonsai" }
];

/* ================= 2. HIỂN THỊ VÀ TÌM KIẾM SẢN PHẨM ================= */
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');

// Hàm render sản phẩm ra màn hình
function renderProducts(productList) {
    productGrid.innerHTML = ''; // Xóa rỗng grid cũ
    if (productList.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Không tìm thấy sản phẩm nào.</p>';
        return;
    }

    productList.forEach(product => {
        // Tạo thẻ sản phẩm
        const card = document.createElement('div');
        card.className = 'product-card';
        // Chuyển trang khi click (Trang SanPham.html sẽ làm sau)
        card.onclick = () => window.location.href = 'SanPham.html';

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Gọi hàm render lần đầu khi tải trang
renderProducts(products);

// Xử lý tìm kiếm realtime
searchInput.addEventListener('input', function(e) {
    const keyword = e.target.value.toLowerCase().trim();
    // Lọc các sản phẩm có tên chứa từ khóa
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(keyword)
    );
    renderProducts(filteredProducts);
});


/* ================= 3. SLIDER TỰ ĐỘNG ================= */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    // Ẩn tất cả slide
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Xử lý vòng lặp index
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    // Hiển thị slide hiện tại
    slides[currentSlide].classList.add('active');
}

// Nút bấm trái/phải
function changeSlide(step) {
    currentSlide += step;
    showSlide(currentSlide);
}

// Chạy tự động mỗi 4 giây
setInterval(() => {
    currentSlide++;
    showSlide(currentSlide);
}, 4000);


/* ================= 4. HỆ THỐNG ĐĂNG KÝ / ĐĂNG NHẬP ================= */
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const modalTitle = document.getElementById('modalTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authMessage = document.getElementById('authMessage');
const authArea = document.getElementById('authArea');

let currentAction = 'login'; // 'login' hoặc 'register'

// Kiểm tra trạng thái đăng nhập khi tải trang
checkLoginState();

function openModal(action) {
    currentAction = action;
    authModal.style.display = 'block';
    authMessage.textContent = ''; // Xóa lỗi cũ
    authForm.reset(); // Xóa form cũ

    if (action === 'login') {
        modalTitle.textContent = 'Đăng nhập';
        authSubmitBtn.textContent = 'Đăng nhập';
    } else {
        modalTitle.textContent = 'Đăng ký tài khoản';
        authSubmitBtn.textContent = 'Đăng ký';
    }
}

function closeModal() {
    authModal.style.display = 'none';
}

// Xử lý submit form
authForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn load lại trang
    
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (currentAction === 'register') {
        // Xử lý đăng ký
        if (localStorage.getItem(user)) {
            authMessage.textContent = "Tên đăng nhập đã tồn tại!";
        } else {
            // Lưu vào localStorage: Key là username, Value là password
            localStorage.setItem(user, pass);
            alert("Đăng ký thành công! Hệ thống tự động đăng nhập.");
            
            // Đăng ký xong tự động đăng nhập luôn
            localStorage.setItem('currentUser', user); 
            closeModal();
            checkLoginState();
        }
    } else if (currentAction === 'login') {
        // Xử lý đăng nhập
        const savedPass = localStorage.getItem(user);
        if (savedPass && savedPass === pass) {
            // Lưu trạng thái đăng nhập hiện tại
            localStorage.setItem('currentUser', user);
            closeModal();
            checkLoginState();
        } else {
            authMessage.textContent = "Sai tên đăng nhập hoặc mật khẩu!";
        }
    }
});

// Hàm kiểm tra xem user đã đăng nhập chưa và đổi UI Header
function checkLoginState() {
    const loggedInUser = localStorage.getItem('currentUser');
    
    if (loggedInUser) {
        // Nếu đã đăng nhập, đổi nút thành Lời chào + Nút Đăng xuất
        authArea.innerHTML = `
            <span class="user-greeting">Xin chào, ${loggedInUser}!</span>
            <button class="btn-logout" onclick="logout()">Đăng xuất</button>
        `;
    } else {
        // Nếu chưa, hiện lại nút đăng nhập/đăng ký
        authArea.innerHTML = `
            <button class="btn-login" onclick="openModal('login')">Đăng nhập</button>
            <button class="btn-register" onclick="openModal('register')">Đăng ký</button>
        `;
    }
}

// Hàm đăng xuất
function logout() {
    localStorage.removeItem('currentUser'); // Xóa trạng thái đăng nhập
    checkLoginState(); // Cập nhật lại UI
}

// Đóng modal khi click ra vùng ngoài modal
window.onclick = function(event) {
    if (event.target == authModal) {
        closeModal();
    }
}