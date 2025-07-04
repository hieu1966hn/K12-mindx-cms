import { useEffect, useRef } from 'react';

// Adjusted thresholds for a more deliberate swipe gesture
const SWIPE_THRESHOLD_X = 75; // min horizontal pixels to count as a swipe
const SWIPE_MAX_Y = 80; // max vertical pixels to allow for a swipe
const SWIPE_TIMEOUT = 500; // max ms for a swipe

/**
 * A hook to detect a rightward swipe on a given element to trigger a "back" action.
 * Provides visual feedback during the swipe.
 * @param onSwipeBack The callback function to execute on a successful swipe.
 * @param enabled A boolean to enable or disable the swipe detection.
 * @returns A ref object to be attached to the target DOM element.
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

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                // Only start swipe from the left edge of the screen for better UX
                const touchX = e.touches[0].clientX;
                if (touchX < 40) { // Start swipe within 40px from the left edge
                    touchStartRef.current = {
                        x: touchX,
                        y: e.touches[0].clientY,
                        time: Date.now(),
                    };
                    isDraggingRef.current = false; // Reset dragging state
                } else {
                    touchStartRef.current = null;
                }
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!touchStartRef.current || e.touches.length !== 1) {
                return;
            }

            const touchCurrentX = e.touches[0].clientX;
            const deltaX = touchCurrentX - touchStartRef.current.x;
            const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);

            // If it looks like a scroll, cancel the swipe gesture
            if (!isDraggingRef.current && deltaY > deltaX && deltaY > 10) {
                touchStartRef.current = null;
                return;
            }

            if (deltaX > 0) {
                // Start dragging if we haven't already
                if (!isDraggingRef.current) {
                    isDraggingRef.current = true;
                    targetElement.style.transition = 'none'; // Disable transition for instant feedback
                }
                
                // Provide visual feedback by moving the element
                const pullRatio = Math.max(0, deltaX / targetElement.clientWidth);
                const opacity = Math.max(1 - pullRatio * 1.5, 0.4);
                targetElement.style.transform = `translateX(${deltaX}px)`;
                targetElement.style.opacity = `${opacity}`;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current || e.changedTouches.length === 0) {
                return;
            }
            
            const wasDragging = isDraggingRef.current;
            isDraggingRef.current = false;
            
            // Re-enable transitions for a smooth animation back
            targetElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

            const { x: touchStartX, y: touchStartY, time: touchStartTime } = touchStartRef.current;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();

            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaTime = touchEndTime - touchStartTime;

            // Clear the reference
            touchStartRef.current = null;

            if (wasDragging && deltaTime < SWIPE_TIMEOUT && deltaX > SWIPE_THRESHOLD_X && deltaY < SWIPE_MAX_Y) {
                // Successful swipe: trigger the back action
                onSwipeBack();
            } else if (wasDragging) {
                // Failed swipe: animate back to original position
                targetElement.style.transform = 'translateX(0px)';
                targetElement.style.opacity = '1';
            }
        };
        
        const handleTouchCancel = () => {
             if (isDraggingRef.current) {
                targetElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                targetElement.style.transform = 'translateX(0px)';
                targetElement.style.opacity = '1';
            }
            isDraggingRef.current = false;
            touchStartRef.current = null;
        };

        targetElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        targetElement.addEventListener('touchmove', handleTouchMove, { passive: true });
        targetElement.addEventListener('touchend', handleTouchEnd, { passive: true });
        targetElement.addEventListener('touchcancel', handleTouchCancel, { passive: true });

        return () => {
            if (targetElement) {
                targetElement.removeEventListener('touchstart', handleTouchStart);
                targetElement.removeEventListener('touchmove', handleTouchMove);
                targetElement.removeEventListener('touchend', handleTouchEnd);
                targetElement.removeEventListener('touchcancel', handleTouchCancel);
                // Clean up inline styles on unmount
                targetElement.style.transform = '';
                targetElement.style.opacity = '';
                targetElement.style.transition = '';
            }
        };
    }, [onSwipeBack, enabled]);

    return targetRef;
};
