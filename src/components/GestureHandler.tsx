import { useEffect, useRef, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface GestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
  className?: string;
}

export const GestureHandler = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  className = ""
}: GestureHandlerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Check for double tap
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - lastTapRef.current < 500) {
          if (onDoubleTap) {
            onDoubleTap();
            toast({
              title: "🎯 Double Tap Detected",
              description: "Smart gesture activated!",
            });
          }
        }
        lastTapRef.current = now;
        return;
      }

      // Swipe detection
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;

      if (deltaTime > maxSwipeTime) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight?.();
            toast({
              title: "👉 Swipe Right",
              description: "Next section activated!",
            });
          } else {
            onSwipeLeft?.();
            toast({
              title: "👈 Swipe Left",
              description: "Previous section activated!",
            });
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            onSwipeDown?.();
            toast({
              title: "👇 Swipe Down",
              description: "Expanded view activated!",
            });
          } else {
            onSwipeUp?.();
            toast({
              title: "👆 Swipe Up",
              description: "Minimized view activated!",
            });
          }
        }
      }

      touchStartRef.current = null;
    };

    // Mouse events for desktop gesture simulation
    let mouseStart: { x: number; y: number; time: number } | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      mouseStart = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now()
      };
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!mouseStart) return;

      const deltaX = e.clientX - mouseStart.x;
      const deltaY = e.clientY - mouseStart.y;
      const deltaTime = Date.now() - mouseStart.time;

      // Double click detection
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - lastTapRef.current < 500) {
          if (onDoubleTap) {
            onDoubleTap();
            toast({
              title: "🖱️ Double Click Detected",
              description: "Smart gesture activated!",
            });
          }
        }
        lastTapRef.current = now;
        return;
      }

      // Mouse drag gestures
      const minSwipeDistance = 100;
      const maxSwipeTime = 500;

      if (deltaTime > maxSwipeTime) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      mouseStart = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, toast]);

  return (
    <div
      ref={elementRef}
      className={`gesture-handler ${className}`}
      style={{ 
        touchAction: 'pan-y pinch-zoom',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};