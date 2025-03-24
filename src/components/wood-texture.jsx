// This is a React component that renders a wood texture SVG
// You can save the SVG part directly as wood.svg

export default function WoodTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="wood-grain" patternUnits="userSpaceOnUse" width="100" height="512" patternTransform="rotate(0)">
          <rect width="100%" height="100%" fill="#b38b6d" />
          <path
            d="M0 0 Q 50 50, 100 0 T 200 0 T 300 0 T 400 0 T 500 0"
            stroke="#96714c"
            strokeWidth="15"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0 100 Q 50 150, 100 100 T 200 100 T 300 100 T 400 100 T 500 100"
            stroke="#96714c"
            strokeWidth="15"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0 200 Q 50 250, 100 200 T 200 200 T 300 200 T 400 200 T 500 200"
            stroke="#96714c"
            strokeWidth="15"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0 300 Q 50 350, 100 300 T 200 300 T 300 300 T 400 300 T 500 300"
            stroke="#96714c"
            strokeWidth="15"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0 400 Q 50 450, 100 400 T 200 400 T 300 400 T 400 400 T 500 400"
            stroke="#96714c"
            strokeWidth="15"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M0 500 Q 50 550, 100 500 T 200 500 T 300 500 T 400 500 T 500 500"
            stroke="#96714c"
            strokeWidth="15"
            fill="none"
            opacity="0.3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wood-grain)" />
    </svg>
  )
}

