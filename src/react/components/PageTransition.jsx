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

/**
 * Wrap a component in a PageTransition boundary.
 *
 * @param {React.ComponentType} WrappedComponent - Component to render inside the transition.
 * @param {Object} [options] - PageTransition props (transitionName, style) for the wrapper.
 * @returns {React.FC} Component rendering WrappedComponent within a PageTransition.
 */
export const withPageTransition = (WrappedComponent, options = {}) => {
  return function WithPageTransitionWrapper(props) {
    return (
      <PageTransition {...options}>
        <WrappedComponent {...props} />
      </PageTransition>
    );
  };
};

/** Ready-made ::view-transition CSS for the default "page" transition name, suitable for a <style> tag. */
export const pageTransitionStyles = {
  crossFade: `
    ::view-transition-old(page) {
      animation: fade-out 0.5s ease-out;
    }
    
    ::view-transition-new(page) {
      animation: fade-in 0.5s ease-in;
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideLeft: `
    ::view-transition-old(page) {
      animation: slide-out 0.5s ease-out;
    }
    
    ::view-transition-new(page) {
      animation: slide-in 0.5s ease-in;
    }
    
    @keyframes slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    @keyframes slide-out {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
  `
};
