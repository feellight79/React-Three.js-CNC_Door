// This is a React component that renders a brick texture SVG
// You can save the SVG part directly as brick.svg

export default function BrickTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="brick-pattern" patternUnits="userSpaceOnUse" width="100" height="50" patternTransform="scale(2)">
          <rect width="100" height="50" fill="#c45d45" />
          <rect width="100" height="2" fill="#8c3b2e" />
          <rect width="2" height="50" fill="#8c3b2e" />
          <rect width="100" height="2" y="25" fill="#8c3b2e" />
          <rect width="2" height="50" x="50" fill="#8c3b2e" />
          <rect width="2" height="25" x="25" y="25" fill="#8c3b2e" />
          <rect width="2" height="25" x="75" fill="#8c3b2e" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brick-pattern)" />
    </svg>
  )
}

