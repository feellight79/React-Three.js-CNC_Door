"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Center, Environment } from "@react-three/drei"
import * as THREE from "three"
import { CSG } from "three-csg-ts"

function BooleanOperation() {
  const [mesh, setMesh] = useState(null)

  useEffect(() => {
    // Create the box with material
    const boxGeometry = new THREE.BoxGeometry(4, 2, 2)
    const boxMaterial = new THREE.MeshStandardMaterial({ color: "#1e88e5" })
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)

    // Create the cylinder with material
    const cylinderGeometry = new THREE.CylinderGeometry(1.3, 0.7, 1, 52)
    const cylinderMaterial = new THREE.MeshStandardMaterial({ color: "#ff0000" })
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial)

    // Perform the CSG subtraction operation
    const bspBox = CSG.fromMesh(boxMesh)
    const bspCylinder = CSG.fromMesh(cylinderMesh)
    const bspResult = bspBox.subtract(bspCylinder)

    // Convert the result back to a Three.js mesh
    const resultMesh = CSG.toMesh(bspResult, boxMesh.matrix, boxMaterial)
    // resultMesh.castShadow = true
    // resultMesh.receiveShadow = true

    // Set the mesh state
    setMesh(resultMesh)

    // Clean up
    return () => {
      boxGeometry.dispose()
      cylinderGeometry.dispose()
      boxMaterial.dispose()
      cylinderMaterial.dispose()
    }
  }, [])

  return mesh ? <primitive object={mesh} /> : null
}

export default function BooleanCSGDemo() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <color attach="background" args={["#111827"]} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Center>
          <BooleanOperation />
        </Center>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={10} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

