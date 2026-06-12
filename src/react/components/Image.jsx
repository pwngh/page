import React, { useMemo, useState } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render an image with a loading skeleton and an error fallback panel.
 *
 * A pulse skeleton covers the image until it loads; failed loads swap in a
 * "Failed to load image" panel instead. `priority` forces eager loading
 * regardless of `lazy`.
 *
 * @param {import('../../shared/types.js').ImageProps} props
 * @param {string} props.src - Image source URL.
 * @param {string} props.alt - Alternative text description.
 * @param {'cover'|'contain'|'fill'|'none'} [props.fit='cover'] - Object-fit mode.
 * @param {boolean|'full'} [props.rounded=false] - Rounded corners; 'full' renders a circle.
 * @param {boolean} [props.lazy=true] - Defer loading until near the viewport.
 * @param {boolean} [props.priority=false] - Load eagerly for above-the-fold images.
 * @param {(event: Event) => void} [props.onLoad] - Called after a successful load.
 * @param {(event: Event) => void} [props.onError] - Called when the image fails to load.
 */
export function Image({
  src,
  alt,
  width,
  height,
  fit = 'cover',
  rounded = false,
  lazy = true,
  priority = false,
  className,
  onLoad,
  onError,
  ...props
}) {
  const [status, setStatus] = useState('loading');

  const wrapperClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'overflow-hidden',
      'bg-gray-100',

      // Rounded Variants
      {
        'rounded-none': !rounded,
        'rounded-lg': rounded === true,
        'rounded-full': rounded === 'full',
      },

      // Custom Classes
      className,
    );
  }, [rounded, className]);

  const imageClasses = useMemo(() => {
    return cn(
      // Base
      'w-full',
      'h-full',
      'transition-opacity',
      'duration-300',

      // Object Fit
      {
        'object-cover': fit === 'cover',
        'object-contain': fit === 'contain',
        'object-fill': fit === 'fill',
        'object-none': fit === 'none',
      },

      // Loading States
      {
        'opacity-0': status === 'loading',
        'opacity-100': status === 'loaded',
        'hidden': status === 'error',
      },
    );
  }, [fit, status]);

  const handleLoad = (event) => {
    setStatus('loaded');
    onLoad?.(event);
  };

  const handleError = (event) => {
    setStatus('error');
    onError?.(event);
  };

  return (
    <div
      className={wrapperClasses}
      style={{ width, height }}
    >
      <img
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : (lazy ? 'lazy' : 'eager')}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={imageClasses}
        {...props}
      />

      {status === 'loading' && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-sm text-gray-500">Failed to load image</div>
        </div>
      )}
    </div>
  );
}
