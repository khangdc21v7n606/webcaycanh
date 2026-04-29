/* =========================================
   1. LẤY GIỎ HÀNG TỪ LOCALSTORAGE
   ========================================= */
let cart = [];
// currentPHPUser đã được lấy từ file PHP
let cartStorageKey = 'cart_' + currentPHPUser;

// Lấy dữ liệu giỏ hàng
cart = JSON.parse(localStorage.getItem(cartStorageKey)) || [];

// Kiểm tra: Nếu giỏ hàng trống thì đuổi về trang chủ
if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống! Hãy chọn mua sản phẩm trước.");
    window.location.href = "index.php";
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
    radio.addEventListener('change', function () {
        if (this.value === 'card') {
            creditCardForm.style.display = 'block'; // Hiện form thẻ
        } else {
            creditCardForm.style.display = 'none';  // Ẩn form thẻ
        }
    });
});

/* =========================================
   4. LOGIC XÁC NHẬN THANH TOÁN (KẾT NỐI PHP)
   ========================================= */
document.getElementById('checkoutForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn không cho trang web tự load lại

    // Xóa trắng các thông báo lỗi cũ
    document.querySelectorAll('.error-msg').forEach(msg => msg.style.display = 'none');

    // 1. Gom thông tin từ các ô nhập liệu
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const note = document.getElementById('note').value.trim();

    // Lấy phương thức thanh toán đang được tích chọn
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Validate sơ bộ: Không cho bỏ trống
    if (fullname === "" || phone === "" || address === "") {
        alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng!");
        return; // Dừng lại, không gửi đi
    }

    // 2. Tính lại tổng tiền (BẮT BUỘC PHẢI PARSE GIÁ TIỀN)
    let subTotal = 0;
    cart.forEach(item => {
        // Gọi hàm parsePrice để biến "150.000đ" thành số 150000
        const realPrice = parsePrice(item.price);
        subTotal += (realPrice * item.quantity);
    });
    let finalTotal = subTotal + 30000; // Cộng phí ship

    // 3. Đóng gói dữ liệu thành 1 khối (Object)
    const orderData = {
        fullname: fullname,
        phone: phone,
        address: address,
        note: note,
        payment: paymentMethod,
        totalAmount: finalTotal, // Đã tính đúng
        cartItems: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: parsePrice(item.price) // Gửi giá sạch (số nguyên) cho PHP
        }))
    };

    // Hiện hiệu ứng Loading quay quay
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const btnSubmit = document.getElementById('btnSubmit');

    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-block';
    btnSubmit.disabled = true;

    // 4. Gửi khối dữ liệu sang file PHP
    fetch('xu_ly_thanh_toan.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Xóa sạch giỏ hàng trong bộ nhớ máy
                localStorage.removeItem(cartStorageKey);

                // Hiện bảng thông báo thành công
                document.getElementById('successModal').style.display = 'flex';
            } else {
                alert("Rất tiếc: " + data.message);
                // Phục hồi lại nút bấm nếu lỗi
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                btnSubmit.disabled = false;
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert("Có lỗi xảy ra trong quá trình kết nối với máy chủ!");
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            btnSubmit.disabled = false;
        });
});
