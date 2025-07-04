import { useEffect, useRef } from 'react';

const SWIPE_THRESHOLD_X = 50; // min horizontal pixels to count as a swipe
const SWIPE_THRESHOLD_Y = 70; // max vertical pixels to allow for a swipe
const SWIPE_TIMEOUT = 500; // max ms for a swipe

/**
 * A hook to detect a rightward swipe on a given element to trigger a "back" action.
 * @param onSwipeBack The callback function to execute on a successful swipe.
 * @param enabled A boolean to enable or disable the swipe detection.
 * @returns A ref object to be attached to the target DOM element.
 */
export const useSwipeBack = (onSwipeBack: () => void, enabled: boolean = true) => {
    const touchStartRef = useRef<{ x: number, y: number, time: number } | null>(null);
    const targetRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const targetElement = targetRef.current;
        if (!targetElement || !enabled) {
            return;
        }

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1) {
                touchStartRef.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                    time: Date.now(),
                };
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStartRef.current || e.changedTouches.length === 0) {
                return;
            }

            const { x: touchStartX, y: touchStartY, time: touchStartTime } = touchStartRef.current;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndTime = Date.now();

            const deltaX = touchEndX - touchStartX;
            const deltaY = Math.abs(touchEndY - touchStartY);
            const deltaTime = touchEndTime - touchStartTime;

            if (deltaTime < SWIPE_TIMEOUT) {
                if (deltaX > SWIPE_THRESHOLD_X && deltaY < SWIPE_THRESHOLD_Y) {
                    onSwipeBack();
                }
            }

            touchStartRef.current = null;
        };
        
        const handleTouchCancel = () => {
            touchStartRef.current = null;
        };

        targetElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        targetElement.addEventListener('touchend', handleTouchEnd, { passive: true });
        targetElement.addEventListener('touchcancel', handleTouchCancel, { passive: true });

        return () => {
            if (targetElement) {
                targetElement.removeEventListener('touchstart', handleTouchStart);
                targetElement.removeEventListener('touchend', handleTouchEnd);
                targetElement.removeEventListener('touchcancel', handleTouchCancel);
            }
        };
    }, [onSwipeBack, enabled]);

    return targetRef;
};
