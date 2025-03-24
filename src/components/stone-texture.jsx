// This is a React component that renders a stone texture SVG
// You can save the SVG part directly as stone.svg

export default function StoneTexture() {
  return (
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="stone-pattern"
          patternUnits="userSpaceOnUse"
          width="200"
          height="200"
          patternTransform="scale(1.5)"
        >
          <rect width="200" height="200" fill="#7d7d7d" />
          <path d="M0,50 L200,50" stroke="#686868" strokeWidth="2" fill="none" />
          <path d="M0,100 L200,100" stroke="#686868" strokeWidth="2" fill="none" />
          <path d="M0,150 L200,150" stroke="#686868" strokeWidth="2" fill="none" />
          <path d="M50,0 L50,200" stroke="#686868" strokeWidth="2" fill="none" />
          <path d="M100,0 L100,200" stroke="#686868" strokeWidth="2" fill="none" />
          <path d="M150,0 L150,200" stroke="#686868" strokeWidth="2" fill="none" />

          <circle cx="25" cy="25" r="20" fill="#8a8a8a" />
          <circle cx="75" cy="75" r="15" fill="#686868" />
          <circle cx="125" cy="25" r="18" fill="#8a8a8a" />
          <circle cx="175" cy="75" r="22" fill="#686868" />
          <circle cx="25" cy="125" r="17" fill="#8a8a8a" />
          <circle cx="75" cy="175" r="19" fill="#686868" />
          <circle cx="125" cy="125" r="21" fill="#8a8a8a" />
          <circle cx="175" cy="175" r="16" fill="#686868" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stone-pattern)" />
    </svg>
  )
}

