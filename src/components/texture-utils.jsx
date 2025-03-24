// This file shows how to use the texture SVGs in your React Three Fiber project

import { useTexture } from "@react-three/drei"

// Import your SVG textures
// Note: You would need to save the SVG code from each component above as separate .svg files
// and place them in your public directory

export function useMaterialTextures() {
  // Load all textures
  const textures = useTexture({
    wood: "/wood.svg",
    brick: "/brick.svg",
    metal: "/metal.svg",
    stone: "/stone.svg",
    fabric: "/fabric.svg",
    marble: "/marble.svg",
    checkerboard: "/checkerboard.svg",
    grass: "/grass.svg",
  })

  return textures
}

// Example usage in your Cube component:
/*
function Cube({ dimensions, textureType }) {
  const textures = useMaterialTextures()
  const selectedTexture = textures[textureType]
  
  return (
    <mesh>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial map={selectedTexture} />
    </mesh>
  )
}
*/

