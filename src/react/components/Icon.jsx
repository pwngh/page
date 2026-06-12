import React, { useMemo } from 'react';

/**
 * Render an inline SVG icon from the built-in stroke icon set.
 *
 * Unknown names log a warning and render an empty SVG frame. When `title`
 * is provided the icon is exposed to assistive technology as an image;
 * otherwise it is treated as decorative.
 *
 * @param {import('../../shared/types.js').IconProps} props
 * @param {string} props.name - Icon key, e.g. 'check', 'search', 'trash'; see the icon map below for the full set.
 * @param {string} [props.size='24'] - Width and height in pixels.
 * @param {string} [props.color='black'] - Stroke color.
 * @param {'none'|'spin'|'pulse'} [props.animation='none'] - Tailwind animation applied to the SVG.
 * @param {string} [props.title] - Accessible label, rendered as an SVG <title>.
 */
export function Icon({
  name,
  size = '24',
  color = 'black',
  className,
  style,
  onClick = () => void 0,
  title,
  animation = 'none'
}) {
  const animationClass = useMemo(() => ({
   none: '',
   spin: 'animate-spin',
   pulse: 'animate-pulse'
  })[animation], [animation]);

  const iconSvg = useMemo(() => {
    const icons = {
      arrow: <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />,
      lock: <path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v3m-7-3h14v9H5v-9z" strokeLinecap="round" strokeLinejoin="round" />,
      smile: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 0c-3.314 0-6-2.686-6-6h12c0 3.314-2.686 6-6 6zM9 9h.01M15 9h.01" strokeLinecap="round" strokeLinejoin="round" />,
      thumbsUp: <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zm-7 7H3v-7h4v7z" strokeLinecap="round" strokeLinejoin="round" />,
      check: <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />,
      bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zm-4.27 13a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />,
      home: <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />,
      gear: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />,
      search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />,
      user: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round" />,
      edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />,
      trash: <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />,
      download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />,
      upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />,
      calendar: <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeLinejoin="round" />,
      mail: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />,
      bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />,
      star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round" />,
      heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />,
      play: <path d="M5 3l14 9-14 9V3z" strokeLinecap="round" strokeLinejoin="round" />,
      pause: <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" strokeLinecap="round" strokeLinejoin="round" />,
      fastForward: <path d="M13 19l9-7-9-7v14zM2 19l9-7-9-7v14z" strokeLinecap="round" strokeLinejoin="round" />,
      rewind: <path d="M11 19L2 12l9-7v14zm11 0l-9-7 9-7v14z" strokeLinecap="round" strokeLinejoin="round" />,
      shuffle: <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" strokeLinecap="round" strokeLinejoin="round" />,
      repeat: <path d="M17 2l4 4-4 4M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v1a4 4 0 0 1-4 4H3" strokeLinecap="round" strokeLinejoin="round" />,
      volume: <path d="M11 5L6 9H2v6h4l5 4V5zm11.54 3.46a10 10 0 0 1 0 14.14M17.54 9.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round" />,
      mute: <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6m0-6l6 6" strokeLinecap="round" strokeLinejoin="round" />,
      compass: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 0l4-4m-4 4l-4-4m4 4V2" strokeLinecap="round" strokeLinejoin="round" />,
      map: <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zm7-4v16m8-12v16" strokeLinecap="round" strokeLinejoin="round" />,
      message: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />,
      link: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />,
      unlink: <path d="M18.84 12.25l1.72-1.71h-.02a5 5 0 0 0-7.07-7.07l-1.72 1.71M5.17 11.75l-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71M8 2v4M2 8h4m-4 8h4m4 4v-4" strokeLinecap="round" strokeLinejoin="round" />,
      share: <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6l-4-4-4 4m4-4v13" strokeLinecap="round" strokeLinejoin="round" />,
      wifi: <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" strokeLinecap="round" strokeLinejoin="round" />,
      signal: <path d="M6.343 15.657a8 8 0 0 1 11.314 0M2.343 11.657a12 12 0 0 1 16.971 0M10.343 19.657a4 4 0 0 1 3.314 0M12 23h.01" strokeLinecap="round" strokeLinejoin="round" />,
      broadcast: <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round" />,
      refresh: <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round" />,
      graph: <path d="M2 20h20M5 20v-6m3 6v-9m3 9v-4m3 9v-8m3 8v-5m3 5v-7" strokeLinecap="round" strokeLinejoin="round" />,
      chart: <path d="M12 2a10 10 0 1 0 10 10H12V2zM22 12A10 10 0 0 0 12 2v10h10z" strokeLinecap="round" strokeLinejoin="round" />,
      layers: <path d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />,
      grid: <path d="M10 3h4v18h-4V3zM3 10h18v4H3v-4z" strokeLinecap="round" strokeLinejoin="round" />,
      filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />,
      zoomIn: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 0l6 6m-6-14v8m-4-4h8" strokeLinecap="round" strokeLinejoin="round" />,
      zoomOut: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 0l6 6m-12-10h8" strokeLinecap="round" strokeLinejoin="round" />,
      maximize: <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />,
      minimize: <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" strokeLinecap="round" strokeLinejoin="round" />,
      target: <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-8V4m0 16v-4m8-8h-4m4 8h-4M8 8H4m4 8H4" strokeLinecap="round" strokeLinejoin="round" />,
      crosshair: <path d="M12 22v-4m0-16v4m-10 6h4m12 0h-4M2 12l10 .005m10-.005L12 12" strokeLinecap="round" strokeLinejoin="round" />,
      copy: <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2zm2-2v4h4m6 2v12a2 2 0 0 1-2 2H6" strokeLinecap="round" strokeLinejoin="round" />,
      paste: <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m4-2a2 2 0 0 1 2 2v2H8V4a2 2 0 0 1 2-2h4z" strokeLinecap="round" strokeLinejoin="round" />,
      tag: <path d="M7 7h.01M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeLinecap="round" strokeLinejoin="round" />,
      database: <path d="M12 8c4.97 0 9-1.79 9-4s-4.03-4-9-4-9 1.79-9 4 4.03 4 9 4zM21 12c0 2.21-4.03 4-9 4s-9-1.79-9-4m18 4c0 2.21-4.03 4-9 4s-9-1.79-9-4" strokeLinecap="round" strokeLinejoin="round" />,
      server: <path d="M20 2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM6 6h.01M6 18h.01" strokeLinecap="round" strokeLinejoin="round" />,
      terminal: <path d="M4 17l6-6-6-6m8 14h8" strokeLinecap="round" strokeLinejoin="round" />,
      code: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    };

    if (!icons[name]) {
      console.warn(`Icon "${name}" not found`);
      return null;
    }

    return icons[name];
  }, [name]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      className={`${className || ''} ${animationClass}`}
      style={style}
      onClick={onClick}
      aria-hidden={!title}
      role={title ? 'img' : 'presentation'}
    >
      {title && <title>{title}</title>}
      {iconSvg}
    </svg>
  );
}
