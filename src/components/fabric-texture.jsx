// This is a React component that renders a fabric texture SVG
// You can save the SVG part directly as fabric.svg

export default function FabricTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="fabric-pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="scale(4)">
          <rect width="20" height="20" fill="#6a8caf" />
          <path d="M0,0 L20,20" stroke="#5a7ca0" strokeWidth="1" fill="none" />
          <path d="M20,0 L0,20" stroke="#5a7ca0" strokeWidth="1" fill="none" />
          <path d="M10,0 L10,20" stroke="#5a7ca0" strokeWidth="0.5" fill="none" />
          <path d="M0,10 L20,10" stroke="#5a7ca0" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fabric-pattern)" />
    </svg>
  )
}

