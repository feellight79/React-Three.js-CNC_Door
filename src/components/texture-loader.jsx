"use client"

// This is a utility component to preload textures
// You can use this to ensure textures are loaded before rendering

import { useEffect } from "react"
import * as THREE from "three"

export function useTexturePreloader() {
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()

    // Preload all textures
    const texturePaths = [
      "/wood.jpg",
      "/brick.jpg",
      "/metal.jpg",
      "/stone.jpg",
      "/fabric.jpg",
      "/marble.jpg",
      "/checkerboard.jpg",
      "/grass.jpg",
    ]

    // Create an array to track loaded textures
    const loadedTextures = []

    // Load each texture
    texturePaths.forEach((path) => {
      const texture = textureLoader.load(path)
      loadedTextures.push(texture)
    })

    // Cleanup function to dispose textures when component unmounts
    return () => {
      loadedTextures.forEach((texture) => {
        texture.dispose()
      })
    }
  }, [])
}

