import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Show a floating tooltip on hover or focus of the wrapped element.
 *
 * Position is computed from the trigger's bounding box and kept in sync on
 * scroll and resize while the tooltip is visible.
 *
 * @param {TooltipProps} props
 * @returns {React.JSX.Element}
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 0,
  disabled = false,
  className,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const tooltipClasses = useMemo(() => {
    return cn(
      // Base
      'absolute',
      'z-50',
      'px-2',
      'py-1',
      'text-sm',
      'text-white',
      'bg-gray-900',
      'rounded',
      'shadow-lg',
      'pointer-events-none',
      'whitespace-nowrap',
      'transition-opacity',
      'duration-200',

      // Visibility
      isVisible ? 'opacity-100' : 'opacity-0',

      // Custom classes
      className
    );
  }, [isVisible, className]);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
    }

    setPosition({
      top: top + scrollTop,
      left: left + scrollLeft
    });
  }, [placement]);

  const handleShow = () => {
    if (disabled) return;

    if (delay) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        calculatePosition();
      }, delay);
    } else {
      setIsVisible(true);
      calculatePosition();
    }
  };

  const handleHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);

      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible, calculatePosition]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={tooltipClasses}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
          {...props}
        >
          {content}
        </div>
      )}
    </>
  );
}
