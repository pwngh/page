import { cn } from '../../shared/utils.js';

/**
 * Constrain children to a fixed aspect ratio using the native CSS aspect-ratio property.
 *
 * @param {import('../../shared/types.js').AspectRatioProps} props
 * @param {number} [props.ratio=1] - Width divided by height (e.g. 16 / 9).
 * @param {import('react').ReactNode} props.children - Content absolutely positioned to fill the ratio box.
 */
export function AspectRatio({ ratio = 1, className, children }) {
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ aspectRatio: ratio }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
