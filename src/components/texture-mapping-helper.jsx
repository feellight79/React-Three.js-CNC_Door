// This file contains helper functions for texture mapping

import * as THREE from "three"

// Function to create a material with the given texture
export function createMaterialWithTexture(texturePath, options = {}) {
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(texturePath)

  // Apply texture options
  if (options.repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1)
  }

  if (options.offset) {
    texture.offset.set(options.offset.x || 0, options.offset.y || 0)
  }

  if (options.rotation) {
    texture.rotation = options.rotation
  }

  // Create material with the texture
  return new THREE.MeshStandardMaterial({
    map: texture,
    roughness: options.roughness !== undefined ? options.roughness : 0.7,
    metalness: options.metalness !== undefined ? options.metalness : 0.2,
  })
}

// Function to create materials for each face of a cube
export function createCubeMaterials(texturePath, options = {}) {
  // Default options for each face
  const defaultOptions = {
    right: { repeat: { x: 1, y: 1 } },
    left: { repeat: { x: 1, y: 1 } },
    top: { repeat: { x: 1, y: 1 } },
    bottom: { repeat: { x: 1, y: 1 } },
    front: { repeat: { x: 1, y: 1 } },
    back: { repeat: { x: 1, y: 1 } },
  }

  // Merge default options with provided options
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  // Create materials for each face
  return [
    createMaterialWithTexture(texturePath, mergedOptions.right), // right
    createMaterialWithTexture(texturePath, mergedOptions.left), // left
    createMaterialWithTexture(texturePath, mergedOptions.top), // top
    createMaterialWithTexture(texturePath, mergedOptions.bottom), // bottom
    createMaterialWithTexture(texturePath, mergedOptions.front), // front
    createMaterialWithTexture(texturePath, mergedOptions.back), // back
  ]
}

