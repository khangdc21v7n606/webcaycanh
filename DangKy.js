document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Ngăn form load lại trang

    // Lấy giá trị từ các ô input
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

    // Reset tất cả thông báo lỗi
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

    let isValid = true;

    // 1. Kiểm tra Tên đăng nhập
    if (username === "") {
        showError('errUsername', "Vui lòng nhập tên đăng nhập.");
        isValid = false;
    } else if (localStorage.getItem(username)) {
        // Kiểm tra xem tên đăng nhập đã tồn tại trong localStorage chưa
        showError('generalError', "Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác!");
        isValid = false;
    }

    // 2. Kiểm tra Email (dùng biểu thức chính quy Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        showError('errEmail', "Vui lòng nhập email.");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('errEmail', "Email không đúng định dạng.");
        isValid = false;
    }

    // 3. Kiểm tra Mật khẩu
    if (password === "") {
        showError('errPassword', "Vui lòng nhập mật khẩu.");
        isValid = false;
    } else if (password.length < 6) {
        showError('errPassword', "Mật khẩu phải có ít nhất 6 ký tự.");
        isValid = false;
    }

    // 4. Kiểm tra Xác nhận mật khẩu
    if (confirmPassword === "") {
        showError('errConfirmPassword', "Vui lòng xác nhận lại mật khẩu.");
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('errConfirmPassword', "Mật khẩu không trùng khớp.");
        isValid = false;
    }

    // 5. Nếu tất cả dữ liệu hợp lệ -> Xử lý đăng ký
    if (isValid) {
        // Lưu thông tin đăng nhập vào localStorage (Key: username, Value: password)
        // Trong thực tế sẽ lưu cả email, nhưng ở đây ta lưu pass để login nhanh
        localStorage.setItem(username, password);
        
        // Cài đặt trạng thái đã đăng nhập (Tự động đăng nhập luôn)
        localStorage.setItem('currentUser', username);

        // Thông báo và chuyển hướng
        alert("Đăng ký thành công! Đang tự động đăng nhập...");
        window.location.href = 'index.php'; 
    }
});

// Hàm hỗ trợ hiển thị lỗi
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}