<?php session_start(); ?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký tài khoản - VuonNhoST</title>
    <link rel="stylesheet" href="DangKy.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <div class="register-container">
        <div class="register-card">
            <div class="logo">
                <h1>VuonNho<span>ST</span></h1>
            </div>
            <h2>Tạo tài khoản mới</h2>
            <p class="subtitle">Đăng ký để trải nghiệm mua sắm cây cảnh tuyệt vời nhất</p>

            <form id="registerForm" method="POST" action="xu_ly_dang_ky.php">
                <div class="input-group">
                    <label for="regUsername">Tên đăng nhập</label>
                    <input type="text" id="regUsername" name="regUsername" placeholder="Ví dụ: nguyenvan_a" required>
                    <span class="error-msg" id="errUsername"></span>
                </div>

                <div class="input-group">
                    <label for="regEmail">Địa chỉ Email</label>
                    <input type="email" id="regEmail" name="regEmail" placeholder="Ví dụ: email@domain.com" required>
                    <span class="error-msg" id="errEmail"></span>
                </div>

                <div class="input-group">
                    <label for="regPassword">Mật khẩu</label>
                    <input type="password" id="regPassword" name="regPassword" placeholder="Tối thiểu 6 ký tự" required>
                    <span class="error-msg" id="errPassword"></span>
                </div>

                <div class="input-group">
                    <label for="regConfirmPassword">Xác nhận mật khẩu</label>
                    <input type="password" id="regConfirmPassword" name="regConfirmPassword" placeholder="Nhập lại mật khẩu" required>
                    <span class="error-msg" id="errConfirmPassword"></span>
                </div>

                <?php 
                if (isset($_SESSION['thongBao'])) {
                echo '<p style="color:red; font-size:13px; text-align:center; margin-bottom: 15px;">' . $_SESSION['thongBao'] . '</p>';
                unset($_SESSION['thongBao']); 
                    }
                ?>
                    
                <button type="submit" class="btn-primary">Đăng ký ngay</button>
            </form>

            <div class="card-footer">
                <span>Đã có tài khoản?</span>
                <a href="index.php">Đăng nhập tại đây</a>
            </div>
        </div>
    </div>

</body>
</html>