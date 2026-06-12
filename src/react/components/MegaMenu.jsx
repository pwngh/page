import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import { cn } from '../../shared/utils.js';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1 inline-block">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const isExternalUrl = (url) => {
  if(!url) {
    return false;
  }
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
};

/** Renders an external anchor, an internal Remix Link, or a button when no href is given. */
const LinkWrapper = ({ href, className, children, onClick }) => {
  if(!href) {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  const linkClasses = cn(
    className,
    'transition-colors duration-150 ease-in-out',
  );

  if(isExternalUrl(href)) {
    return (
      <a
        href={href}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
        <ExternalLinkIcon/>
      </a>
    );
  }

  return (
    <Link
      to={href}
      prefetch="intent"
      className={linkClasses}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

/**
 * Render a navigation bar with hover-activated dropdown panels for nested items.
 *
 * Below the md breakpoint (768px) items collapse into a toggleable mobile menu
 * that closes automatically after a selection.
 *
 * @param {MegaMenuProps} props
 * @returns {React.JSX.Element}
 */
export function MegaMenu({
  items,
  bgColor = 'bg-white',
  textColor = 'text-gray-800',
  hoverColor = 'bg-gray-50',
  selectedColor = 'text-blue-600',
  activeColor = 'bg-gray-100',
  onSelect,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if(typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if(window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    if (onSelect) onSelect(item);
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const DesktopMenuItem = ({ item }) => {
    const menuItemClasses = cn(
      'relative px-3 py-2 rounded-md text-sm font-medium',
      textColor,
      {
        [selectedColor]: selectedId === item.id,
        [activeColor]: activeItem === item.id,
        [`hover:${hoverColor}`]: true
      }
    );

    const dropdownClasses = cn(
      'fixed left-0 right-0 bg-white border-t shadow-lg z-50',
      'mt-1'
    );

    return (
      <div
        className="relative"
        onMouseEnter={() => setActiveItem(item.id)}
        onMouseLeave={(e) => {
          const relatedTarget = e.relatedTarget;
          const dropdown = document.querySelector(`[data-dropdown-id="${item.id}"]`);
          if (!dropdown?.contains(relatedTarget)) {
            setActiveItem(null);
          }
        }}
      >
        <LinkWrapper
          href={item.href}
          className={menuItemClasses}
          onClick={() => handleSelect(item)}
        >
          {item.label}
        </LinkWrapper>

        {item.children && activeItem === item.id && (
          <div className={dropdownClasses} data-dropdown-id={item.id} onMouseLeave={() => setActiveItem(null)}>
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-4 gap-6 px-4 py-6">
                {item.children.map((child) => (
                  <div key={child.id} className="-m-3">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      {child.label}
                    </h3>
                    {child.children && (
                      <div className="mt-2 space-y-2">
                        {child.children.map((subItem) => (
                          <LinkWrapper
                            key={subItem.id}
                            href={subItem.href}
                            className={cn(
                              'block px-3 py-1 rounded-md text-sm',
                              selectedId === subItem.id ? selectedColor : 'text-gray-500',
                              'hover:text-gray-900 hover:bg-gray-50'
                            )}
                            onClick={() => handleSelect(subItem)}
                          >
                            {subItem.label}
                          </LinkWrapper>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobileMenuItem = ({ item, depth = 0 }) => {
    const mobileItemClasses = cn(
      'block w-full text-left px-3 py-2 rounded-md text-base font-medium',
      textColor,
      {
        [selectedColor]: selectedId === item.id,
        [`hover:${hoverColor}`]: true
      }
    );

    return (
      <div className={depth > 0 ? 'ml-4' : ''}>
        <LinkWrapper
          href={item.href}
          className={mobileItemClasses}
          onClick={() => handleSelect(item)}
        >
          {item.label}
        </LinkWrapper>
        {item.children && (
          <div className="mt-2 space-y-2">
            {item.children.map((child) => (
              <MobileMenuItem
                key={child.id}
                item={child}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn('relative z-50', bgColor, 'border-b')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold">Logo</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {items.map((item) => (
                <DesktopMenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-md',
                textColor,
                `hover:${hoverColor}`
              )}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1">
            {items.map((item) => (
              <MobileMenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
