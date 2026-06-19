import { useEffect } from 'react';
import { useNavigate, useLocation } from '@remix-run/react';

/**
 * Animate client-side navigation using the View Transitions API.
 *
 * Intercepts clicks on internal links (anchors whose href starts with "/") and
 * wraps the resulting navigation in document.startViewTransition. Listeners are
 * re-attached after every route change; browsers without View Transitions
 * support fall back to normal navigation.
 *
 * @param {PageTransitionProps} props
 * @returns {React.JSX.Element}
 */
export const PageTransition = ({
  children,
  transitionName = 'page',
  style,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || !window.document.startViewTransition) {
      return;
    }

    const handleNavigate = (event) => {
      event.preventDefault();
      const href = event.currentTarget.getAttribute('href');
      window.document.startViewTransition(() => {
        navigate(href);
      });
    };

    const links = window.document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      link.addEventListener('click', handleNavigate);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleNavigate);
      });
    };
  }, [navigate, /* effect dep */ location]);

  return (
    <div
      style={{
        viewTransitionName: transitionName,
        ...style
      }}
    >
      {children}
    </div>
  );
};
