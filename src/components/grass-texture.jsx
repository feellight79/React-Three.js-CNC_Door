// This is a React component that renders a grass texture SVG
// You can save the SVG part directly as grass.svg

export default function GrassTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grass-pattern" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(2)">
          <rect width="100" height="100" fill="#4a8c36" />

          {/* Grass blades */}
          <line x1="10" y1="80" x2="5" y2="60" stroke="#3a7026" strokeWidth="1" />
          <line x1="10" y1="80" x2="15" y2="60" stroke="#3a7026" strokeWidth="1" />
          <line x1="30" y1="70" x2="25" y2="50" stroke="#3a7026" strokeWidth="1" />
          <line x1="30" y1="70" x2="35" y2="50" stroke="#3a7026" strokeWidth="1" />
          <line x1="50" y1="90" x2="45" y2="70" stroke="#3a7026" strokeWidth="1" />
          <line x1="50" y1="90" x2="55" y2="70" stroke="#3a7026" strokeWidth="1" />
          <line x1="70" y1="80" x2="65" y2="60" stroke="#3a7026" strokeWidth="1" />
          <line x1="70" y1="80" x2="75" y2="60" stroke="#3a7026" strokeWidth="1" />
          <line x1="90" y1="70" x2="85" y2="50" stroke="#3a7026" strokeWidth="1" />
          <line x1="90" y1="70" x2="95" y2="50" stroke="#3a7026" strokeWidth="1" />

          <line x1="10" y1="30" x2="5" y2="10" stroke="#3a7026" strokeWidth="1" />
          <line x1="10" y1="30" x2="15" y2="10" stroke="#3a7026" strokeWidth="1" />
          <line x1="30" y1="20" x2="25" y2="0" stroke="#3a7026" strokeWidth="1" />
          <line x1="30" y1="20" x2="35" y2="0" stroke="#3a7026" strokeWidth="1" />
          <line x1="50" y1="40" x2="45" y2="20" stroke="#3a7026" strokeWidth="1" />
          <line x1="50" y1="40" x2="55" y2="20" stroke="#3a7026" strokeWidth="1" />
          <line x1="70" y1="30" x2="65" y2="10" stroke="#3a7026" strokeWidth="1" />
          <line x1="70" y1="30" x2="75" y2="10" stroke="#3a7026" strokeWidth="1" />
          <line x1="90" y1="20" x2="85" y2="0" stroke="#3a7026" strokeWidth="1" />
          <line x1="90" y1="20" x2="95" y2="0" stroke="#3a7026" strokeWidth="1" />

          {/* Dots for texture */}
          <circle cx="10" cy="10" r="1" fill="#5a9c46" />
          <circle cx="30" cy="30" r="1" fill="#5a9c46" />
          <circle cx="50" cy="10" r="1" fill="#5a9c46" />
          <circle cx="70" cy="30" r="1" fill="#5a9c46" />
          <circle cx="90" cy="10" r="1" fill="#5a9c46" />
          <circle cx="10" cy="50" r="1" fill="#5a9c46" />
          <circle cx="30" cy="70" r="1" fill="#5a9c46" />
          <circle cx="50" cy="50" r="1" fill="#5a9c46" />
          <circle cx="70" cy="70" r="1" fill="#5a9c46" />
          <circle cx="90" cy="50" r="1" fill="#5a9c46" />
          <circle cx="10" cy="90" r="1" fill="#5a9c46" />
          <circle cx="30" cy="90" r="1" fill="#5a9c46" />
          <circle cx="50" cy="90" r="1" fill="#5a9c46" />
          <circle cx="70" cy="90" r="1" fill="#5a9c46" />
          <circle cx="90" cy="90" r="1" fill="#5a9c46" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grass-pattern)" />
    </svg>
  )
}

