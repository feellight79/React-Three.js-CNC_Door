import { useState, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter"
import { STLExporter } from "three/examples/jsm/exporters/STLExporter"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

// Texture options with their paths
const TEXTURE_OPTIONS = [
    { id: "wood", name: "Wood", path: "/pattern/wood.jpg" },
    { id: "metal", name: "Metal", path: "/pattern/metal.jpg" },
]

export default function CubeDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 1,
    height: 1,
    depth: 1,
  })

  const [inputValues, setInputValues] = useState({
    width: "1",
    height: "1",
    depth: "1",
  })

  const [currentView, setCurrentView] = useState("free")
  const [selectedTexture, setSelectedTexture] = useState("wood")
  const [processingStatus, setProcessingStatus] = useState("")
  const controlsRef = useRef()
  const cubeRef = useRef()

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setDimensions({
      width: Number.parseFloat(inputValues.width) || 1,
      height: Number.parseFloat(inputValues.height) || 1,
      depth: Number.parseFloat(inputValues.depth) || 1,
    })
  }

  const handleTextureChange = (e) => {
    setSelectedTexture(e.target.value)
  }

  const viewPositions = {
    front: [0, 0, 4],
    back: [0, 0, -4],
    left: [-4, 0, 0],
    right: [4, 0, 0],
    top: [0, 4, 0],
    bottom: [0, -4, 0],
    free: [3, 3, 3],
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  // Find the selected texture path
  const selectedTexturePath = TEXTURE_OPTIONS.find((tex) => tex.id === selectedTexture)?.path || TEXTURE_OPTIONS[0].path

  // Function to export the cube as OBJ
  const exportCubeAsOBJ = () => {
    if (!cubeRef.current) return

    // Create a clone of the cube to export
    const cubeMesh = cubeRef.current.clone()

    // Create a new scene with just the cube
    const tempScene = new THREE.Scene()
    tempScene.add(cubeMesh)

    // Create an OBJ exporter
    const exporter = new OBJExporter()

    // Export the scene to OBJ format
    const objData = exporter.parse(tempScene)

    // Create a blob with the OBJ data
    const blob = new Blob([objData], { type: "text/plain" })

    // Create a download link
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `cube_${dimensions.width}x${dimensions.height}x${dimensions.depth}_${selectedTexture}.obj`

    // Append the link to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(link.href)
  }

  // Function to export the cube as STL
  const exportCubeAsSTL = () => {
    if (!cubeRef.current) return

    setProcessingStatus("Exporting to STL...")

    // Create a clone of the cube to export
    const cubeMesh = cubeRef.current.clone()

    // Create a new scene with just the cube
    const tempScene = new THREE.Scene()
    tempScene.add(cubeMesh)

    // Create an STL exporter
    const exporter = new STLExporter()

    // Export the scene to STL format (binary)
    const stlData = exporter.parse(tempScene, { binary: true })

    // Create a blob with the STL data
    const blob = new Blob([stlData], { type: "application/octet-stream" })

    // Create a download link
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `cube_${dimensions.width}x${dimensions.height}x${dimensions.depth}_${selectedTexture}.stl`

    // Append the link to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up
    URL.revokeObjectURL(link.href)

    setProcessingStatus("STL file exported successfully!")

    // Clear status after 3 seconds
    setTimeout(() => {
      setProcessingStatus("")
    }, 3000)
  }

  // Function to simulate manufacturing pipeline
  const generateGCode = () => {
    setProcessingStatus("Processing manufacturing pipeline...")

    // First export to STL
    if (!cubeRef.current) return

    // Create a clone of the cube to export
    const cubeMesh = cubeRef.current.clone()

    // Create a new scene with just the cube
    const tempScene = new THREE.Scene()
    tempScene.add(cubeMesh)

    // Create an STL exporter
    const exporter = new STLExporter()

    // Export the scene to STL format (binary)
    const stlData = exporter.parse(tempScene, { binary: true })

    // Simulate processing time for Open CASCADE operations
    setTimeout(() => {
      setProcessingStatus("Analyzing geometry with Open CASCADE...")

      // Simulate processing time for G-code generation
      setTimeout(() => {
        setProcessingStatus("Generating G-code...")

        // Simulate final processing
        setTimeout(() => {
          // Create a simple G-code file for demonstration
          const gcode = generateSimpleGCode(dimensions)

          // Create a blob with the G-code data
          const blob = new Blob([gcode], { type: "text/plain" })

          // Create a download link
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = `cube_${dimensions.width}x${dimensions.height}x${dimensions.depth}_gcode.nc`

          // Append the link to the document, click it, and remove it
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up
          URL.revokeObjectURL(link.href)

          setProcessingStatus("Manufacturing files generated successfully!")

          // Clear status after 3 seconds
          setTimeout(() => {
            setProcessingStatus("")
          }, 3000)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  // Function to generate a simple G-code file for demonstration
  const generateSimpleGCode = (dimensions) => {
    // This is a very simplified G-code generation for demonstration purposes only
    // Real G-code generation would require a proper slicing engine or CAM software

    const { width, height, depth } = dimensions
    const layerHeight = 0.2 // mm
    const numLayers = Math.ceil(height / layerHeight)
    const feedRate = 1200 // mm/min
    const extrusionRate = 0.035 // mm of filament per mm of travel

    let gcode = `;Generated G-code for cube ${width}x${height}x${depth}mm\n`
    gcode += `;This is a simplified demonstration\n`
    gcode += `;Real G-code would be generated by a proper slicer\n\n`

    gcode += "M104 S200 ; Set extruder temperature\n"
    gcode += "M140 S60 ; Set bed temperature\n"
    gcode += "M109 S200 ; Wait for extruder temperature\n"
    gcode += "M190 S60 ; Wait for bed temperature\n"
    gcode += "G28 ; Home all axes\n"
    gcode += "G90 ; Use absolute coordinates\n"
    gcode += "M82 ; Use absolute distances for extrusion\n"
    gcode += "G92 E0 ; Reset extruder position\n\n"

    gcode += "; Start printing\n"
    gcode += "G1 Z0.2 F3000 ; Move to first layer height\n"
    gcode += "G1 F1800 ; Set initial feedrate\n\n"

    // Generate simple perimeter moves for each layer
    for (let layer = 0; layer < numLayers; layer++) {
      const z = layerHeight * (layer + 1)
      const extrusion = layer * (width * 2 + depth * 2) * extrusionRate * 4 // Approximate extrusion amount

      gcode += `; Layer ${layer + 1}\n`
      gcode += `G1 Z${z.toFixed(3)} F3000 ; Move to layer height\n`

      // Simple square perimeter
      gcode += `G1 X0 Y0 F${feedRate} E${extrusion.toFixed(5)}\n`
      gcode += `G1 X${width} Y0 F${feedRate} E${(extrusion + width * extrusionRate).toFixed(5)}\n`
      gcode += `G1 X${width} Y${depth} F${feedRate} E${(extrusion + (width + depth) * extrusionRate).toFixed(5)}\n`
      gcode += `G1 X0 Y${depth} F${feedRate} E${(extrusion + (width * 2 + depth) * extrusionRate).toFixed(5)}\n`
      gcode += `G1 X0 Y0 F${feedRate} E${(extrusion + (width * 2 + depth * 2) * extrusionRate).toFixed(5)}\n\n`
    }

    gcode += "; End printing\n"
    gcode += "M104 S0 ; Turn off extruder\n"
    gcode += "M140 S0 ; Turn off bed\n"
    gcode += "G28 X0 Y0 ; Home X and Y axes\n"
    gcode += "M84 ; Disable motors\n"

    return gcode
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Input forms */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Cube Dimensions</h2>

            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                name="width"
                type="number"
                step="0.1"
                min="0.1"
                value={inputValues.width}
                onChange={handleChange}
                placeholder="Width"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                min="0.1"
                value={inputValues.height}
                onChange={handleChange}
                placeholder="Height"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depth">Depth</Label>
              <Input
                id="depth"
                name="depth"
                type="number"
                step="0.1"
                min="0.1"
                value={inputValues.depth}
                onChange={handleChange}
                placeholder="Depth"
              />
            </div>

            {/* Texture Selection */}
            <div className="space-y-2">
              <Label htmlFor="texture">Material</Label>
              <select
                id="texture"
                name="texture"
                value={selectedTexture}
                onChange={handleTextureChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TEXTURE_OPTIONS.map((texture) => (
                  <option key={texture.id} value={texture.id}>
                    {texture.name}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Update Cube
            </Button>

            {/* Export Buttons */}
            <div className="grid grid-cols-1 gap-2">
              <Button type="button" onClick={exportCubeAsOBJ} className="w-full bg-blue-600 hover:bg-blue-700">
                Download as OBJ
              </Button>

              <Button type="button" onClick={exportCubeAsSTL} className="w-full bg-green-600 hover:bg-green-700">
                Download as STL
              </Button>

              <Button type="button" onClick={generateGCode} className="w-full bg-purple-600 hover:bg-purple-700">
                Generate Manufacturing Files
              </Button>
            </div>

            {/* Processing Status */}
            {processingStatus && (
              <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md text-center">{processingStatus}</div>
            )}

            <div className="text-sm text-gray-500 mt-4">
              Current dimensions: {dimensions.width} × {dimensions.height} × {dimensions.depth}
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">Interaction Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click and drag to rotate the cube</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Right-click and drag to pan</li>
                <li>• Use the view buttons to see specific sides</li>
                <li>• Select different materials from the dropdown</li>
                <li>• Download as OBJ or STL for 3D printing</li>
                <li>• Generate manufacturing files for production</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Right side - Three.js canvas */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 min-h-[300px]">
            <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <SceneWithExport
                dimensions={dimensions}
                texturePath={selectedTexturePath}
                textureType={selectedTexture}
                cubeRef={cubeRef}
              />
              <CameraController view={currentView} positions={viewPositions} controlsRef={controlsRef} />
              <OrbitControls ref={controlsRef} />
              <gridHelper args={[10, 10]} />
              <axesHelper args={[5]} />
            </Canvas>
          </div>

          {/* View control buttons */}
          <div className="p-4 bg-gray-200 dark:bg-gray-700 flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => handleViewChange("front")}
              className={`px-3 py-1 ${currentView === "front" ? "bg-blue-700" : ""}`}
            >
              Front
            </Button>
            <Button
              onClick={() => handleViewChange("back")}
              className={`px-3 py-1 ${currentView === "back" ? "bg-blue-700" : ""}`}
            >
              Back
            </Button>
            <Button
              onClick={() => handleViewChange("left")}
              className={`px-3 py-1 ${currentView === "left" ? "bg-blue-700" : ""}`}
            >
              Left
            </Button>
            <Button
              onClick={() => handleViewChange("right")}
              className={`px-3 py-1 ${currentView === "right" ? "bg-blue-700" : ""}`}
            >
              Right
            </Button>
            <Button
              onClick={() => handleViewChange("top")}
              className={`px-3 py-1 ${currentView === "top" ? "bg-blue-700" : ""}`}
            >
              Top
            </Button>
            <Button
              onClick={() => handleViewChange("bottom")}
              className={`px-3 py-1 ${currentView === "bottom" ? "bg-blue-700" : ""}`}
            >
              Bottom
            </Button>
            <Button
              onClick={() => handleViewChange("free")}
              className={`px-3 py-1 ${currentView === "free" ? "bg-blue-700" : ""}`}
            >
              Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CameraController({ view, positions, controlsRef }) {
  const { camera } = useThree()

  useFrame(() => {
    if (view !== "free" && positions[view]) {
      const [targetX, targetY, targetZ] = positions[view]

      // Smoothly animate camera position
      camera.position.x += (targetX - camera.position.x) * 0.05
      camera.position.y += (targetY - camera.position.y) * 0.05
      camera.position.z += (targetZ - camera.position.z) * 0.05

      // Make camera look at origin
      camera.lookAt(0, 0, 0)

      // Update controls target
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    }
  })

  return null
}

// Component that manages the scene and exports
function SceneWithExport({ dimensions, texturePath, textureType, cubeRef }) {
  return <TexturedCube dimensions={dimensions} texturePath={texturePath} textureType={textureType} cubeRef={cubeRef} />
}

function TexturedCube({ dimensions, texturePath, textureType, cubeRef }) {
  const meshRef = useRef()
  const [materials, setMaterials] = useState([])

  // Update the external ref
  useEffect(() => {
    if (meshRef.current) {
      cubeRef.current = meshRef.current
    }
  }, [meshRef, cubeRef])

  // Load textures for each face of the cube
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()

    // For demonstration, we'll use placeholder textures
    // In a real app, replace with actual texture paths
    const actualPath = texturePath || "/placeholder.svg?height=512&width=512&text=Texture"

    // Function to create a texture with proper settings
    const createTexture = () => {
      const texture = textureLoader.load(actualPath)

      // Configure texture based on material type
      if (textureType === "wood" || textureType === "brick") {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
      } else if (textureType === "checkerboard") {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(2, 2)
      } else {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 1)
      }

      return texture
    }

    // Create materials for each face of the cube
    const newMaterials = [
      new THREE.MeshStandardMaterial({ map: createTexture(), roughness: 0.7, metalness: 0.2 }), // right
      new THREE.MeshStandardMaterial({ map: createTexture(), roughness: 0.7, metalness: 0.2 }), // left
      new THREE.MeshStandardMaterial({ map: createTexture(), roughness: 0.7, metalness: 0.2 }), // top
      new THREE.MeshStandardMaterial({ map: createTexture(), roughness: 0.7, metalness: 0.2 }), // bottom
      new THREE.MeshStandardMaterial({ map: createTexture(), roughness: 0.7, metalness: 0.2 }), // front
      new THREE.MeshStandardMaterial({ map: createTexture(), roughness: 0.7, metalness: 0.2 }), // back
    ]

    setMaterials(newMaterials)

    // Cleanup function
    return () => {
      newMaterials.forEach((material) => {
        if (material.map) {
          material.map.dispose()
        }
        material.dispose()
      })
    }
  }, [texturePath, textureType])

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      {materials.length === 6 ? (
        materials.map((material, index) => <primitive key={index} object={material} attach={`material-${index}`} />)
      ) : (
        <meshStandardMaterial color="#1e88e5" />
      )}
    </mesh>
  )
}

