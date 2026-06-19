import { useState } from 'react';
import { cn } from '../../shared/utils.js';

const ChevronIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

/** Single accordion row: a toggle header plus its collapsible content panel. */
const AccordionItem = ({
  item,
  isOpen,
  onClick,
  textColor = 'text-gray-800',
  hoverColor = 'hover:bg-gray-50',
  activeColor = 'bg-gray-100'
}) => {
  const headerClasses = cn(
    'flex items-center justify-between w-full px-4 py-3 text-left rounded-md',
    textColor,
    hoverColor,
    {
      [activeColor]: isOpen
    }
  );

  const iconClasses = cn(
    'transform transition-transform duration-200',
    {
      'rotate-180': isOpen
    }
  );

  const contentClasses = cn(
    'overflow-hidden transition-all duration-200',
    {
      'max-h-0': !isOpen,
      'max-h-96': isOpen
    }
  );

  return (
    <div className="border rounded-md mb-2">
      <button
        className={headerClasses}
        onClick={() => onClick(item.id)}
        type="button"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{item.label}</span>
        <ChevronIcon className={iconClasses} />
      </button>
      <div className={contentClasses}>
        <div className="px-4 py-3">
          {item.content}
        </div>
      </div>
    </div>
  );
};

/**
 * Display collapsible content sections with single- or multi-expand behavior.
 *
 * @param {import('../../shared/types.js').AccordionProps} props
 * @param {import('../../shared/types.js').AccordionItem[]} props.items - Sections to render; each needs a unique `id`, a header `label`, and panel `content`.
 * @param {boolean} [props.multiple=false] - Allow several sections to be open at once instead of closing the previous one.
 * @param {string} [props.bgColor='bg-white'] - Tailwind background class for the wrapper.
 */
export function Accordion({
  items,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
  hoverColor = 'hover:bg-gray-50',
  activeColor = 'bg-gray-100',
  multiple = false
}) {
  const [openItems, setOpenItems] = useState(new Set());

  const handleClick = (itemId) => {
    setOpenItems(prev => {
      const newOpenItems = new Set(prev);
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        if (!multiple) {
          newOpenItems.clear();
        }
        newOpenItems.add(itemId);
      }
      return newOpenItems;
    });
  };

  return (
    <div className={cn('w-full', bgColor)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openItems.has(item.id)}
          onClick={handleClick}
          textColor={textColor}
          hoverColor={hoverColor}
          activeColor={activeColor}
        />
      ))}
    </div>
  );
}
