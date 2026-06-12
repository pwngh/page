import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Constrain children to a fixed aspect ratio using the padding-bottom technique.
 *
 * @param {import('../../shared/types.js').AspectRatioProps} props
 * @param {number} [props.ratio=1] - Width divided by height (e.g. 16 / 9).
 * @param {import('react').ReactNode} props.children - Content absolutely positioned to fill the ratio box.
 */
export function AspectRatio({ ratio = 1, className, children }) {
  const aspectRatioClasses = useMemo(() => {
    return cn(
      'relative',
      'overflow-hidden',
      className,
    );
  }, [className]);

  const paddingBottomStyle = useMemo(() => {
    return {
      paddingBottom: `${(1 / ratio) * 100}%`,
    };
  }, [ratio]);

  return (
    <div className={aspectRatioClasses} style={paddingBottomStyle}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
