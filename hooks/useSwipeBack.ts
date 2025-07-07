

import { useEffect, useRef } from 'react';

// Các hằng số để phát hiện cử chỉ vuốt
const SWIPE_THRESHOLD_X = 75; // khoảng cách vuốt ngang tối thiểu (pixel) để được tính là một cú vuốt
const SWIPE_MAX_Y = 80;       // khoảng cách di chuyển dọc tối đa cho phép trong một cú vuốt ngang
const SWIPE_TIMEOUT = 500;    // thời gian tối đa (ms) cho một cú vuốt
const SWIPE_EDGE_WIDTH = 40;  // chiều rộng của cạnh màn hình nơi có thể bắt đầu vuốt (pixel)

/**
 * Một custom hook để phát hiện cử chỉ vuốt từ phải sang trái trên một phần tử
 * để kích hoạt hành động "quay lại" (back).
 * Cung cấp phản hồi trực quan trong quá trình vuốt.
 * @param onSwipeBack - Hàm callback để thực thi khi phát hiện một cú vuốt thành công.
 * @param enabled - Một boolean để bật hoặc tắt tính năng phát hiện vuốt.
 * @returns Một đối tượng ref để gắn vào phần tử DOM mục tiêu.
 */
export const useSwipeBack = (onSwipeBack: () => void, enabled: boolean = true) => {
    const touchStartRef = useRef<{ x: number, y: number, time: number } | null>(null);
    const targetRef = useRef<HTMLElement | null>(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        const targetElement = targetRef.current;
        if (!targetElement || !enabled) {
            return;
        }

        // Xử lý khi bắt đầu chạm vào màn hình
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                const touchX = e.touches[0].clientX;
                // Chỉ bắt đầu theo dõi nếu người dùng chạm vào cạnh phải của màn hình
                if (touchX > window.innerWidth - SWIPE_EDGE_WIDTH) { 
                    touchStartRef.current = {
                        x: touchX,
                        y: e.touches[0].clientY,
                        time: Date.now(),
                    };
                    isDraggingRef.current = false;
                } else {
                    touchStartRef.current = null;
                }
            }
        };

        // Xử lý khi di chuyển ngón tay trên màn hình
        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartRef.current || e.touches.length !== 1) {
                return;
            }

            const touchCurrentX = e.touches[0].clientX;
            const deltaX = touchCurrentX - touchStartRef.current.x;
            const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);

            // Nếu người dùng cuộn dọc nhiều hơn ngang, hủy cử chỉ vuốt
            if (!isDraggingRef.current && deltaY > Math.abs(deltaX) && deltaY > 10) {
                touchStartRef.current = null;
                return;
            }

            // Nếu vuốt sang trái (deltaX < 0)
            if (deltaX < 0) { 
                if (!isDraggingRef.current) {
                    isDraggingRef.current = true;
                    targetElement.style.transition = 'none'; // Tắt transition để di chuyển mượt mà
                }
                
                // Cung cấp phản hồi trực quan: di chuyển và làm mờ phần tử
                const pullRatio = Math.max(0, Math.abs(deltaX) / targetElement.clientWidth);
                const opacity = Math.max(1 - pullRatio * 1.5, 0.4);
                targetElement.style.transform = `translateX(${deltaX}px)`;
                targetElement.style.opacity = `${opacity}`;
            }
        };

        // Xử lý khi nhấc ngón tay khỏi màn hình
        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current || e.changedTouches.length === 0) {
                return;
            }
            
            const wasDragging = isDraggingRef.current;
            isDraggingRef.current = false;
            
            targetElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Bật lại transition

            // Lấy thông tin điểm bắt đầu và kết thúc
            const { x: touchStartX, y: touchStartY, time: touchStartTime } = touchStartRef.current;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();

            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaTime = touchEndTime - touchStartTime;

            touchStartRef.current = null;

            // Kiểm tra xem cú vuốt có đủ điều kiện hay không
            if (wasDragging && deltaTime < SWIPE_TIMEOUT && deltaX < -SWIPE_THRESHOLD_X && deltaY < SWIPE_MAX_Y) {
                onSwipeBack(); // Kích hoạt callback
            } else if (wasDragging) {
                // Nếu không đủ điều kiện, trả phần tử về vị trí cũ
                targetElement.style.transform = 'translateX(0px)';
                targetElement.style.opacity = '1';
            }
        };
        
        const handleTouchCancel = () => {
             if (isDraggingRef.current) {
                // Trả về vị trí cũ nếu cử chỉ bị hủy
                targetElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                targetElement.style.transform = 'translateX(0px)';
                targetElement.style.opacity = '1';
            }
            isDraggingRef.current = false;
            touchStartRef.current = null;
        };

        // Gắn các event listener
        targetElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        targetElement.addEventListener('touchmove', handleTouchMove, { passive: true });
        targetElement.addEventListener('touchend', handleTouchEnd, { passive: true });
        targetElement.addEventListener('touchcancel', handleTouchCancel, { passive: true });

        // Hàm dọn dẹp để gỡ các event listener
        return () => {
            if (targetElement) {
                targetElement.removeEventListener('touchstart', handleTouchStart);
                targetElement.removeEventListener('touchmove', handleTouchMove);
                targetElement.removeEventListener('touchend', handleTouchEnd);
                targetElement.removeEventListener('touchcancel', handleTouchCancel);
                // Đảm bảo các style được reset khi component unmount
                targetElement.style.transform = '';
                targetElement.style.opacity = '';
                targetElement.style.transition = '';
            }
        };
    }, [onSwipeBack, enabled]);

    return targetRef;
};
