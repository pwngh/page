import { Fragment } from 'react';

/**
 * Insert uniform gaps between sibling elements using Tailwind's spacing scale.
 *
 * Returns children unchanged unless there are at least two non-null children to space.
 *
 * @param {SpaceProps} props
 * @returns {React.JSX.Element|React.ReactNode} Wrapped children, or the original children when no spacing applies.
 */
export function Space({ h, w, children }) {
  if (!Array.isArray(children)) {
    return children;
  }

  /** @type {React.ReactNode[]} */
  const validChildren = children.filter(child => child != null);

  if (validChildren.length <= 1) {
    return children;
  }

  const spaceClass = h
    ? `space-x-${h} flex items-center`
    : w
      ? `space-y-${w} flex flex-col`
      : '';

  return (
    <div className={spaceClass}>
      {validChildren.map((child, index) => (
        <Fragment key={index}>
          {child}
        </Fragment>
      ))}
    </div>
  );
}
