<?php 
session_start(); // Chỉ gọi 1 lần duy nhất ở đây
require 'db.php'; //kết nối database
// Xử lý khi người dùng bấm nút Đăng xuất
if (isset($_GET['action']) && $_GET['action'] == 'logout') {
    session_unset();
    session_destroy();
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> VuonNhoSocTrang-Cửa hàng cây cảnh cao cấp</title>
    <link rel="stylesheet" href="index.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <header>
        <div class="header-container">
            <div class="logo">
                <h1>VuonNho<span>SocTrang</span></h1>
            </div>
            
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Bạn đang tìm cây gì hôm nay?">
                <span class="search-icon">🔍</span>
            </div>

            <div class="auth-section">
                <?php if (isset($_SESSION['currentUser'])): ?>
                    <div id="userSection" style="display: flex; align-items: center;">
                        <span class="user-greeting" style="margin-right: 15px; font-weight: 600;">
                            Chào, <?php echo $_SESSION['currentUser']; ?>
                        </span>
                        <a href="index.php?action=logout" class="btn btn-outline" style="text-decoration:none;">Đăng xuất</a>
                    </div>
                <?php else: ?>
                    <div id="guestSection">
                        <button id="btnLogin" class="btn btn-outline">Đăng nhập</button>
                        <a href="DangKy.php" id="btnRegister" class="btn btn-primary" style="text-decoration: none;">Đăng ký</a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </header>

    <div id="loginModal" class="modal-overlay">
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Đăng Nhập</h2>
        <p>Chào mừng bạn đến với VuonNhoST</p>
        
        <form method="POST" action="xu_ly_dang_nhap.php">
            <div class="input-group">
                <label>Tên đăng nhập</label>
                <input type="text" id="loginUsername" name="loginUsername" placeholder="Nhập tên tài khoản" required>
            </div>
            
            <div class="input-group">
                <label>Mật khẩu</label>
                <input type="password" id="loginPassword" name="loginPassword" placeholder="Nhập mật khẩu" required>
            </div>

            <?php
            if (isset($_SESSION['loginError'])) {
                echo '<p style="color:red; font-size:13px; text-align:center; margin-bottom:10px;">' . $_SESSION['loginError'] . '</p>';
                echo "<script>
                        document.addEventListener('DOMContentLoaded', function() {
                            document.getElementById('loginModal').style.display = 'block';
                        });
                      </script>";
                unset($_SESSION['loginError']); 
            }
            ?>
            
            <button type="submit" class="btn btn-primary btn-full">Xác nhận</button>
        </form>
        <div class="modal-footer">
            <span>Bạn chưa có tài khoản?</span>
            <a href="DangKy.php">Đăng ký ngay</a>
        </div>
    </div>
</div>

    <main>
       <section class="slider-container">
            <div class="slides">
                <div class="slide active">
                    <div class="slide-overlay"></div>
                    <img src="images/slider1.jpg" alt="Slider 1">
                    <div class="slide-content">
                        <h2>Mang vườn nho<br>vào không gian sống</h2>
                        <p>Khám phá bộ sưu tập cây nho tươi tốt, dễ trồng, giúp ngôi nhà bạn thêm xanh mát và tràn đầy sức sống.</p>
                    </div>
                </div>
                <div class="slide">
                    <div class="slide-overlay"></div>
                    <img src="images/slider2.jpg" alt="Slider 2">
                    <div class="slide-content">
                        <h2>Trồng nho tại nhà<br>Tươi ngon mỗi ngày</h2>
                        <p>Các giống cây nho khỏe mạnh, dễ chăm sóc, cho trái ngọt ngay trong khu vườn của bạn.</p>
                    </div>
                </div>
                <div class="slide active">
                    <div class="slide-overlay"></div>
                    <img src="images/slider3.jpg" alt="Slider3 3">
                    <div class="slide-content">
                        <h2>Biến ngôi nhà thành vườn nho xanh</h2>
                        <p>Lựa chọn những giống nho chất lượng, phù hợp trồng ban công, sân vườn hoặc trong chậu.</p>
                    </div>
                </div>
            </div>
            <button class="slider-btn prev" onclick="changeSlide(-1)">&#10094;</button>
            <button class="slider-btn next" onclick="changeSlide(1)">&#10095;</button>
            <div class="dots">
                <span class="dot active" onclick="currentSlide(0)"></span>
                <span class="dot" onclick="currentSlide(1)"></span>
            </div>
        </section>

        <section class="products-container">
            <div class="section-header">
                <h2>Sản Phẩm Mới Nhất</h2>
                <p>Những chậu cây được chăm sóc tỉ mỉ nhất</p>
            </div>
            
            <div id="noProductMsg" style="display: none; text-align: center; color: #e74c3c;">Không tìm thấy sản phẩm phù hợp.</div>
            
            <div class="product-grid" id="productList">
                <?php
                // Lấy sản phẩm từ DB
                $sql = "SELECT * FROM products ORDER BY id ASC";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        ?>
                        <div class="product">
                            <div class="product-img-wrapper">
                                <img src="<?php echo $row['image']; ?>" alt="<?php echo $row['name']; ?>">
                                
                                <?php if($row['id'] == 1): ?>
                                    <span class="badge">Bán chạy</span>
                                <?php elseif($row['id'] == 3): ?>
                                    <span class="badge new">Mới</span>
                                <?php endif; ?>
                            </div>
                            
                            <div class="product-info">
                                <h3><?php echo $row['name']; ?></h3>
                                <p class="price"><?php echo number_format($row['price'], 0, ',', '.'); ?>đ</p>
                                <a href="GioHang.php" class="btn btn-outline-full">Xem chi tiết</a>
                            </div>
                        </div>
                        <?php
                    }
                } else {
                    echo "<p style='text-align:center; width:100%;'>Hiện chưa có sản phẩm nào trong cửa hàng.</p>";
                }
                ?>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-container">
            <div class="footer-col">
                <h3>VuonNho<span>SocTrang</span></h3>
                <p>Mang màu xanh tươi mát và sự bình yên đến mọi góc nhỏ trong không gian sống của bạn.</p>
            </div>
            <div class="footer-col">
                <h4>Liên hệ</h4>
                <p>📧 VuonNhoSocTrang@gmail.com
                <p>📞 094-8989-036
                <p>📍 68 An Dương Vương, Ấp Hoà Mỹ, Mỹ Xuyên, Sóc Trăng</p>
            </div>
            <div class="footer-col">
                <h4>Chính sách</h4>
                <p><a href="#">Chính sách bảo hành cây</a></p>
                <p><a href="#">Vận chuyển & Đổi trả</a></p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 VuonNhoSocTrang. All rights reserved.</p>
        </div>
    </footer>

    <script src="index.js"></script>
</body>
</html>