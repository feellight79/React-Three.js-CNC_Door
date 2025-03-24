// This is a React component that renders a marble texture SVG
// You can save the SVG part directly as marble.svg

export default function MarbleTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="marble-turbulence" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" seed="1" result="turbulence" />
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="50" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id="marble-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="25%" stopColor="#e0e0e0" />
          <stop offset="50%" stopColor="#f5f5f5" />
          <stop offset="75%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#f5f5f5" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#marble-gradient)" filter="url(#marble-turbulence)" />
      <rect width="100%" height="100%" fill="#f5f5f5" opacity="0.3" />
    </svg>
  )
}

