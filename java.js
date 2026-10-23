// ==========================================
// 1. CON TRỎ CHUỘT TÙY CHỈNH (CUSTOM CURSOR)
// ==========================================
const cursor = document.getElementById('customCursor');

if (cursor) {
  window.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    cursor.style.left = `${clientX}px`;
    cursor.style.top = `${clientY}px`;

    if (!cursor.classList.contains('visible')) {
      cursor.classList.add('visible');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });
}

// ==========================================
// 2. HERO PARALLAX SCROLL VỚI TỐC ĐỘ 0.5X
// ==========================================
const heroSection = document.getElementById('heroSection');
const heroBg = document.getElementById('heroBg');

if (heroSection && heroBg) {
  let isHeroVisible = false;
  let isTicking = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isHeroVisible = entry.isIntersecting;
    });
  }, {
    root: null,
    threshold: 0
  });

  observer.observe(heroSection);

  const updateParallax = () => {
    if (isHeroVisible) {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0)`;
    }
    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (isHeroVisible && !isTicking) {
      window.requestAnimationFrame(updateParallax);
      isTicking = true;
    }
  }, { passive: true });
}

// ==========================================
// 3. HIỆU ỨNG MAGNETIC BUTTON (NÚT NAM CHÂM)
// ==========================================
const magneticButtons = document.querySelectorAll('.magnetic-btn');

magneticButtons.forEach((btn) => {
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let isAnimating = false;
  let mouseX = -9999;
  let mouseY = -9999;

  const MAGNETIC_DISTANCE = 100; // Ngưỡng khoảng cách kích hoạt nam châm (100px)
  const MAGNETIC_FORCE = 0.35;    // Cường độ kéo (0.35 = 35% khoảng cách tới tâm)
  const EASING = 0.12;           // Hệ số nội suy mượt mà (LERP)

  // Vòng lặp animation bằng requestAnimationFrame cho chuyển động đàn hồi tự nhiên
  const animate = () => {
    // Thuật toán LERP (Linear Interpolation) tạo cảm giác chuyển động mượt mà và đàn hồi
    currentX += (targetX - currentX) * EASING;
    currentY += (targetY - currentY) * EASING;

    btn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;

    // Nếu nút gần như đã về hẳn vị trí gốc (khi chuột rời đi), dừng rAF để tiết kiệm tài nguyên
    const distanceToTarget = Math.hypot(targetX - currentX, targetY - currentY);
    if (distanceToTarget < 0.1 && targetX === 0 && targetY === 0) {
      currentX = 0;
      currentY = 0;
      btn.style.transform = 'translate3d(0px, 0px, 0px)';
      isAnimating = false;
      return;
    }

    requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(animate);
    }
  };

  // Lắng nghe di chuyển chuột để tính khoảng cách tới tâm nút
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const rect = btn.getBoundingClientRect();
    // Tính tâm nút (lấy vị trí ban đầu bằng cách trừ đi offset hiện tại)
    const centerX = rect.left + rect.width / 2 - currentX;
    const centerY = rect.top + rect.height / 2 - currentY;

    // Khoảng cách giữa con trỏ chuột và tâm nút
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.hypot(dx, dy);

    // Nếu khoảng cách nhỏ hơn 100px: hút nhẹ về hướng chuột
    if (distance < MAGNETIC_DISTANCE) {
      targetX = dx * MAGNETIC_FORCE;
      targetY = dy * MAGNETIC_FORCE;
      startAnimation();
    } else if (targetX !== 0 || targetY !== 0) {
      // Chuột vượt quá 100px: tự động hồi về vị trí cũ (0, 0)
      targetX = 0;
      targetY = 0;
      startAnimation();
    }
  });

  // Khi chuột rời khỏi cửa sổ, đảm bảo nút đàn hồi về vị trí ban đầu
  document.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    startAnimation();
  });
});
