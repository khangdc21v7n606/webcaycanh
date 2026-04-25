/* =========================================
   1. KIỂM TRA ĐĂNG NHẬP & XÁC ĐỊNH GIỎ HÀNG
   ========================================= */
const currentUser = localStorage.getItem('currentUser');
let cart = []; 
let cartStorageKey = ''; // BƯỚC SỬA 1: Đưa biến này ra ngoài cùng để không bị "nhốt"

if (!currentUser) {
    alert("Bạn cần đăng nhập để tiến hành thanh toán!");
    window.location.href = "index.php";
} else {
    document.getElementById('userNameDisplay').innerText = `Xin chào, ${currentUser}`;

    // BƯỚC SỬA 2: Bỏ chữ "const" đi, chỉ gán giá trị thôi
    cartStorageKey = 'cart_' + currentUser; 
    cart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống! Hãy chọn mua sản phẩm trước.");
        window.location.href = "GioHang.php";
    }
}

/* =========================================
   2. TÍNH TOÁN & HIỂN THỊ ĐƠN HÀNG
   ========================================= */
const orderItemsList = document.getElementById('orderItemsList');
const subTotalDisplay = document.getElementById('subTotal');
const finalTotalDisplay = document.getElementById('finalTotal');
const SHIPPING_FEE = 30000; // Phí ship cố định 30k

// Hàm parse chuỗi tiền (250.000đ -> 250000)
function parsePrice(priceStr) {
    return parseInt(priceStr.replace(/\D/g, ''));
}
// Hàm format tiền (250000 -> 250.000đ)
function formatPrice(number) {
    return number.toLocaleString('vi-VN') + 'đ';
}

function renderOrderSummary() {
    let html = '';
    let subTotal = 0;

    cart.forEach(item => {
        const itemTotal = parsePrice(item.price) * item.quantity;
        subTotal += itemTotal;

        html += `
            <div class="order-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Số lượng: ${item.quantity}</p>
                    <p class="item-price">${formatPrice(itemTotal)}</p>
                </div>
            </div>
        `;
    });

    orderItemsList.innerHTML = html;
    subTotalDisplay.innerText = formatPrice(subTotal);
    finalTotalDisplay.innerText = formatPrice(subTotal + SHIPPING_FEE);
}

renderOrderSummary();

/* =========================================
   3. LOGIC CHỌN PHƯƠNG THỨC THANH TOÁN
   ========================================= */
const radioButtons = document.querySelectorAll('input[name="payment"]');
const creditCardForm = document.getElementById('creditCardForm');

radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'card') {
            creditCardForm.style.display = 'block'; // Hiện form thẻ
        } else {
            creditCardForm.style.display = 'none';  // Ẩn form thẻ
        }
    });
});

/* =========================================
   4. LOGIC XÁC NHẬN THANH TOÁN
   ========================================= */
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn load trang

    // Reset lỗi
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

    const name = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    let isValid = true;

    // Validate Thông tin chung
    if (name === "") { showError('errName', "Vui lòng nhập họ tên."); isValid = false; }
    if (phone === "" || phone.length < 10) { showError('errPhone', "Vui lòng nhập SDT hợp lệ."); isValid = false; }
    if (address === "") { showError('errAddress', "Vui lòng nhập địa chỉ."); isValid = false; }

    // Validate Thẻ (Nếu chọn)
    if (paymentMethod === 'card') {
        const cardNum = document.getElementById('cardNumber').value.trim();
        const cardName = document.getElementById('cardName').value.trim();
        const cardExp = document.getElementById('cardExp').value.trim();
        const cardCvv = document.getElementById('cardCvv').value.trim();

        if (cardNum === "" || cardName === "" || cardExp === "" || cardCvv === "") {
            showError('errCard', "Vui lòng điền đầy đủ thông tin Thẻ Tín Dụng.");
            isValid = false;
        }
    }

    if (isValid) {
        processPayment();
    }
});

function showError(id, msg) {
    const el = document.getElementById(id);
    el.innerText = msg;
    el.style.display = 'block';
}

function processPayment() {
    // 1. Giao diện Loading
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const btnSubmit = document.getElementById('btnSubmit');

    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    btnSubmit.disabled = true;

    // 2. Giả lập thời gian xử lý giao dịch (2 giây)
    setTimeout(() => {
        // 3. Xóa giỏ hàng của user sau khi mua xong
        localStorage.removeItem(cartStorageKey);

        // 4. Mở Popup thành công
        document.getElementById('successModal').style.display = 'flex';
        
    }, 2000);
}