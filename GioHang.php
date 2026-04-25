<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cửa Hàng - VuonNhoST</title>
    <link rel="stylesheet" href="GioHang.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <header>
        <div class="header-container">
            <div class="logo">
                <h1>VuonNho<span>SocTrang</span></h1>
            </div>
            <a href="index.php" class="btn-back"> <-Về Trang Chủ</a>
        </div>
    </header>

    <main>
        <div class="shop-header">
            <h2>Tất Cả Sản Phẩm</h2>
            <p>Chọn những chậu nho ưng ý nhất cho không gian của bạn</p>
        </div>

        <div class="product-grid" id="shopGrid">
            </div>
    </main>

    <div class="cart-float-icon" id="cartFloatBtn">
        🛒
        <span class="cart-badge" id="cartBadge">0</span>
    </div>

    <div class="cart-overlay" id="cartOverlay">
        <div class="cart-drawer">
            <div class="cart-header">
                <h3>Giỏ Hàng Của Bạn</h3>
                <span class="close-cart" id="closeCartBtn">&times;</span>
            </div>
            
            <div class="cart-items" id="cartItemsList">
                </div>

            <div class="cart-footer">
                <div class="cart-summary">
                    <span>Tổng sản phẩm: <strong id="totalItems">0</strong></span>
                    <span>Tổng tiền: <strong id="totalPrice" class="price-highlight">0đ</strong></span>
                </div>
                <button class="btn-checkout" onclick="window.location.href='ThanhToan.php'">Tiến Hành Thanh Toán</button>
            </div>
        </div>
    </div>

    <div id="toast" class="toast">Đã thêm vào giỏ hàng!</div>
    <script>
        const currentPHPUser = "<?php echo $_SESSION['currentUser'] ?? 'guest'; ?>";
    </script>
    
    <script src="GioHang.js"></script>
</body>
</html>