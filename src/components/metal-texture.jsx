// This is a React component that renders a metal texture SVG
// You can save the SVG part directly as metal.svg

export default function MetalTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d1d1d1" />
          <stop offset="25%" stopColor="#a8a8a8" />
          <stop offset="50%" stopColor="#d1d1d1" />
          <stop offset="75%" stopColor="#a8a8a8" />
          <stop offset="100%" stopColor="#d1d1d1" />
        </linearGradient>
        <filter id="metal-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#metal-gradient)" filter="url(#metal-noise)" />
      <rect width="100%" height="100%" fill="url(#metal-gradient)" opacity="0.5" />
    </svg>
  )
}

