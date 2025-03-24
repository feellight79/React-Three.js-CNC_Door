// This is a React component that renders a checkerboard texture SVG
// You can save the SVG part directly as checkerboard.svg

export default function CheckerboardTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="checkerboard" patternUnits="userSpaceOnUse" width="128" height="128">
          <rect width="64" height="64" fill="#ffffff" />
          <rect width="64" height="64" x="64" y="64" fill="#ffffff" />
          <rect width="64" height="64" x="64" y="0" fill="#000000" />
          <rect width="64" height="64" x="0" y="64" fill="#000000" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#checkerboard)" />
    </svg>
  )
}

