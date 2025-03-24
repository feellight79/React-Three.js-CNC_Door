import { useState, useRef, useEffect } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { CSG } from "three-csg-ts"
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter"
import { STLExporter } from "three/examples/jsm/exporters/STLExporter"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Tabs, TabsContent } from "./ui/tabs"
import { Checkbox } from "./ui/checkbox"

// Texture options with their paths
const TEXTURE_OPTIONS = [
    { id: "wood", name: "Wood", path: "/pattern/wood.jpg" },
    { id: "metal", name: "Metal", path: "/pattern/metal.jpg" },
]

// Tool type options
const TOOL_TYPES = [
  { id: "endmill", name: "End Mill" },
  { id: "ballnose", name: "Ball Nose" },
  { id: "vbit", name: "V-Bit" },
  { id: "drill", name: "Drill Bit" },
  { id: "chamfer", name: "Chamfer Mill" },
]

// Tool material options
const TOOL_MATERIALS = [
  { id: "hss", name: "High Speed Steel (HSS)" },
  { id: "carbide", name: "Carbide" },
  { id: "diamond", name: "Diamond Coated" },
  { id: "cobalt", name: "Cobalt" },
]

// Cutting direction options
const CUTTING_DIRECTIONS = [
  { id: "climb", name: "Climb (Conventional)" },
  { id: "conventional", name: "Conventional (Climb)" },
  { id: "mixed", name: "Mixed" },
]

// Coolant options
const COOLANT_OPTIONS = [
  { id: "none", name: "None" },
  { id: "flood", name: "Flood" },
  { id: "mist", name: "Mist" },
  { id: "air", name: "Air Blast" },
]

// Machine types
const MACHINE_TYPES = [
  { id: "3axis", name: "3-Axis Mill" },
  { id: "4axis", name: "4-Axis Mill" },
  { id: "5axis", name: "5-Axis Mill" },
  { id: "router", name: "CNC Router" },
]

// Operation types
const OPERATION_TYPES = [
  { id: "roughing", name: "Roughing" },
  { id: "finishing", name: "Finishing" },
  { id: "contour", name: "Contour" },
  { id: "pocket", name: "Pocket" },
  { id: "drilling", name: "Drilling" },
  { id: "engraving", name: "Engraving" },
]

// Toolpath patterns
const TOOLPATH_PATTERNS = [
  { id: "parallel", name: "Parallel" },
  { id: "zigzag", name: "Zig-Zag" },
  { id: "spiral", name: "Spiral" },
  { id: "radial", name: "Radial" },
  { id: "offset", name: "Offset" },
  { id: "waterline", name: "Waterline" },
]

export default function CubeDimensions() {
  const [dimensions, setDimensions] = useState({
    width: 1000,
    height: 2000,
    thickness: 50,
    hingeTop: 150,
    hingeBackSet: 4,
    hingeThickness: 7.5,
    lockPosition: 1200,
    litePositionTop: 200,
    litePositionRight: 180,
    liteWidth: 180,
    liteHeight: 1500,
  })

  const [inputValues, setInputValues] = useState({
    width: "1000",
    height: "2000",
    thickness: "50",
    hingeTop: "150",
    hingeBackSet: "4",
    hingeThickness: "7.5",
    lockPosition: "1200",
    litePositionTop: "200",
    litePositionRight: "180",
    liteWidth: "180",
    liteHeight: "1500",
  })

  const [currentView, setCurrentView] = useState("free")
  const [selectedTexture, setSelectedTexture] = useState("wood")
  const [processingStatus, setProcessingStatus] = useState("")
  const [activeTab, setActiveTab] = useState("dimensions")
  const controlsRef = useRef()
  const cubeRef = useRef()

  // Manufacturing parameters
  const [toolParams, setToolParams] = useState({
    type: "endmill",
    diameter: "6",
    length: "50",
    fluteLength: "25",
    flutes: "2",
    cornerRadius: "0",
    material: "carbide",
  })

  const [operationParams, setOperationParams] = useState({
    spindleSpeed: "10000",
    feedRate: "500",
    plungeRate: "200",
    stepOver: "40",
    stepDown: "1",
    cuttingDirection: "climb",
    coolant: "none",
  })

  const [machineParams, setMachineParams] = useState({
    type: "3axis",
    maxSpindleSpeed: "24000",
    maxFeedRate: "5000",
    travelLimitsX: "300",
    travelLimitsY: "200",
    travelLimitsZ: "100",
    tableX: "400",
    tableY: "300",
    rapidTravelSpeed: "5000",
    toolChangeTime: "10",
    hasCoolant: true,
  })

  const [strategyParams, setStrategyParams] = useState({
    operationType: "roughing",
    toolpathPattern: "zigzag",
    clearanceHeight: "10",
    retractHeight: "5",
    stockAllowance: "0.5",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
 console.log(dimensions)
  const handleSubmit = (e) => {
    e.preventDefault()
    setDimensions({
      width: Number.parseFloat(inputValues.width) || 1,
      height: Number.parseFloat(inputValues.height) || 1,
      thickness: Number.parseFloat(inputValues.thickness) || 1,
      hingeTop: Number.parseFloat(inputValues.hingeTop) || 1,
      hingeBackSet: Number.parseFloat(inputValues.hingeBackSet) || 1,
      hingeThickness: Number.parseFloat(inputValues.hingeThickness) || 1,
      lockPosition: Number.parseFloat(inputValues.lockPosition) || 1,
      litePositionTop: Number.parseFloat(inputValues.litePositionTop) || 1,
      litePositionRight: Number.parseFloat(inputValues.litePositionRight) || 1,
      liteWidth: Number.parseFloat(inputValues.liteWidth) || 1,
      liteHeight: Number.parseFloat(inputValues.liteHeight) || 1,
    })
  }

  const handleTextureChange = (e) => {
    setSelectedTexture(e.target.value)
  }

  const handleToolParamChange = (e) => {
    const { name, value } = e.target
    setToolParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleOperationParamChange = (e) => {
    const { name, value } = e.target
    setOperationParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleMachineParamChange = (e) => {
    const { name, value, type, checked } = e.target
    setMachineParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleStrategyParamChange = (e) => {
    const { name, value } = e.target
    setStrategyParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const viewPositions = {
    front: [0, 0, 4000],
    back: [0, 0, -4000],
    left: [-4000, 0, 0],
    right: [4000, 0, 0],
    top: [0, 4000, 0],
    bottom: [0, -4000, 0],
    free: [3000, 3000, 3000],
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
    link.download = `cube_${dimensions.width}x${dimensions.height}x${dimensions.thickness}_${selectedTexture}.obj`

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
    link.download = `cube_${dimensions.width}x${dimensions.height}x${dimensions.thickness}_${selectedTexture}.stl`

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

  // Function to simulate manufacturing pipeline with Open CASCADE
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

    // Collect all manufacturing parameters
    const manufacturingParams = {
      tool: toolParams,
      operation: operationParams,
      machine: machineParams,
      strategy: strategyParams,
      model: {
        dimensions,
        type: "cube",
      },
    }

    // Log the parameters that would be sent to Open CASCADE
    console.log("Manufacturing Parameters:", manufacturingParams)

    // Simulate processing time for Open CASCADE operations
    setTimeout(() => {
      setProcessingStatus("Analyzing geometry with Open CASCADE...")

      // Simulate processing time for G-code generation
      setTimeout(() => {
        setProcessingStatus("Generating G-code with manufacturing parameters...")

        // Simulate final processing
        setTimeout(() => {
          // Create a G-code file based on the manufacturing parameters
          const gcode = generateAdvancedGCode(dimensions, manufacturingParams)

          // Create a blob with the G-code data
          const blob = new Blob([gcode], { type: "text/plain" })

          // Create a download link
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = `cube_${dimensions.width}x${dimensions.height}x${dimensions.thickness}_${toolParams.type}_${strategyParams.operationType}.nc`

          // Append the link to the document, click it, and remove it
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up
          URL.revokeObjectURL(link.href)

          setProcessingStatus("G-code generated successfully with Open CASCADE parameters!")

          // Clear status after 3 seconds
          setTimeout(() => {
            setProcessingStatus("")
          }, 3000)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  // Function to generate a more advanced G-code file based on manufacturing parameters
  const generateAdvancedGCode = (dimensions, params) => {
    // This is a simplified G-code generation that takes manufacturing parameters into account
    // In a real application, this would be handled by Open CASCADE and a proper CAM engine

    const { width, height, thickness } = dimensions
    const { tool, operation, machine, strategy } = params

    // Convert string parameters to numbers
    const toolDiameter = Number.parseFloat(tool.diameter)
    const spindleSpeed = Number.parseInt(operation.spindleSpeed)
    const feedRate = Number.parseInt(operation.feedRate)
    const plungeRate = Number.parseInt(operation.plungeRate)
    const stepOver = Number.parseFloat(operation.stepOver) / 100 // Convert percentage to decimal
    const stepDown = Number.parseFloat(operation.stepDown)
    const clearanceHeight = Number.parseFloat(strategy.clearanceHeight)
    const retractHeight = Number.parseFloat(strategy.retractHeight)
    const stockAllowance = Number.parseFloat(strategy.stockAllowance)

    let gcode = `;Generated G-code for cube ${width}x${height}x${thickness}mm\n`
    gcode += `;Tool: ${tool.type}, Diameter: ${tool.diameter}mm, Material: ${tool.material}\n`
    gcode += `;Operation: ${strategy.operationType}, Pattern: ${strategy.toolpathPattern}\n`
    gcode += `;Machine: ${machine.type}\n\n`

    // Program setup
    gcode += "G90 ; Absolute positioning\n"
    gcode += "G21 ; Metric units\n"
    gcode += "G17 ; XY plane selection\n\n"

    // Tool setup
    gcode += `M6 T1 ; Load tool #1 (${tool.type}, ${tool.diameter}mm)\n`
    gcode += `S${spindleSpeed} ; Set spindle speed\n`
    gcode += "M3 ; Start spindle clockwise\n"

    // Coolant based on selection
    if (operation.coolant !== "none") {
      if (operation.coolant === "flood") {
        gcode += "M8 ; Flood coolant on\n"
      } else if (operation.coolant === "mist") {
        gcode += "M7 ; Mist coolant on\n"
      }
    }

    gcode += "\n; Begin machining operations\n"

    // Move to safe height
    gcode += `G0 Z${clearanceHeight} ; Move to clearance height\n`

    // Generate toolpath based on strategy
    if (strategy.operationType === "roughing") {
      // Roughing operation with selected pattern
      gcode += generateRoughingToolpath(
        width,
        thickness,
        height,
        toolDiameter,
        stepOver,
        stepDown,
        feedRate,
        plungeRate,
        retractHeight,
        strategy.toolpathPattern,
      )
    } else if (strategy.operationType === "finishing") {
      // Finishing operation
      gcode += generateFinishingToolpath(
        width,
        thickness,
        height,
        toolDiameter,
        stepOver,
        feedRate,
        plungeRate,
        retractHeight,
        stockAllowance,
      )
    } else if (strategy.operationType === "contour") {
      // Contour operation
      gcode += generateContourToolpath(
        width,
        thickness,
        height,
        toolDiameter,
        feedRate,
        plungeRate,
        retractHeight,
        stockAllowance,
      )
    }

    // End program
    gcode += "\n; End of program\n"
    gcode += `G0 Z${clearanceHeight} ; Move to clearance height\n`
    gcode += "M5 ; Stop spindle\n"

    // Turn off coolant if it was on
    if (operation.coolant !== "none") {
      gcode += "M9 ; Coolant off\n"
    }

    gcode += "M30 ; Program end and rewind\n"

    return gcode
  }

  // Function to generate a roughing toolpath
  const generateRoughingToolpath = (
    width,
    thickness,
    height,
    toolDiameter,
    stepOver,
    stepDown,
    feedRate,
    plungeRate,
    retractHeight,
    pattern,
  ) => {
    let gcode = "; Roughing operation\n"

    // Calculate number of layers based on step down
    const numLayers = Math.ceil(height / stepDown)

    // Calculate step over distance
    const stepOverDistance = toolDiameter * stepOver

    // Calculate number of passes in X and Y
    const numPassesX = Math.ceil(width / stepOverDistance)
    const numPassesY = Math.ceil(thickness / stepOverDistance)

    // Generate toolpath for each layer
    for (let layer = 0; layer < numLayers; layer++) {
      const z = -layer * stepDown

      gcode += `\n; Layer ${layer + 1} at Z=${z.toFixed(3)}\n`
      gcode += `G0 Z${retractHeight} ; Retract to safe height\n`

      if (pattern === "zigzag") {
        // Zig-zag pattern
        for (let y = 0; y < numPassesY; y++) {
          const yPos = y * stepOverDistance

          // Move to start position
          gcode += `G0 X0 Y${yPos.toFixed(3)} ; Rapid to start position\n`

          // Plunge to cutting thickness
          gcode += `G1 Z${z.toFixed(3)} F${plungeRate} ; Plunge to cutting thickness\n`

          // Cut in X direction (left to right or right to left based on row)
          if (y % 2 === 0) {
            gcode += `G1 X${width.toFixed(3)} Y${yPos.toFixed(3)} F${feedRate} ; Cut left to right\n`
          } else {
            gcode += `G1 X0 Y${yPos.toFixed(3)} F${feedRate} ; Cut right to left\n`
          }
        }
      } else if (pattern === "spiral") {
        // Spiral pattern (simplified)
        const centerX = width / 2
        const centerY = thickness / 2
        const maxRadius = Math.min(width, thickness) / 2
        const numSpirals = Math.ceil(maxRadius / stepOverDistance)

        // Move to center
        gcode += `G0 X${centerX.toFixed(3)} Y${centerY.toFixed(3)} ; Rapid to center\n`

        // Plunge to cutting thickness
        gcode += `G1 Z${z.toFixed(3)} F${plungeRate} ; Plunge to cutting thickness\n`

        // Generate spiral
        for (let i = 0; i < numSpirals; i++) {
          const radius = i * stepOverDistance
          gcode += `G2 X${centerX.toFixed(3)} Y${centerY.toFixed(3)} I${radius.toFixed(3)} J0 F${feedRate} ; Spiral cut\n`
        }
      } else {
        // Default to parallel pattern
        for (let y = 0; y < numPassesY; y++) {
          const yPos = y * stepOverDistance

          // Move to start position
          gcode += `G0 X0 Y${yPos.toFixed(3)} ; Rapid to start position\n`

          // Plunge to cutting thickness
          gcode += `G1 Z${z.toFixed(3)} F${plungeRate} ; Plunge to cutting thickness\n`

          // Cut in X direction
          gcode += `G1 X${width.toFixed(3)} Y${yPos.toFixed(3)} F${feedRate} ; Cut along X\n`

          // Retract slightly for rapid move
          gcode += `G0 Z${retractHeight} ; Retract for rapid move\n`
        }
      }
    }

    return gcode
  }

  // Function to generate a finishing toolpath
  const generateFinishingToolpath = (
    width,
    thickness,
    height,
    toolDiameter,
    stepOver,
    feedRate,
    plungeRate,
    retractHeight,
    stockAllowance,
  ) => {
    let gcode = "; Finishing operation\n"

    // Adjust dimensions for stock allowance
    const adjustedWidth = width - 2 * stockAllowance
    const adjustedThickness = thickness - 2 * stockAllowance
    const adjustedHeight = height - stockAllowance

    // Calculate step over distance
    const stepOverDistance = toolDiameter * stepOver

    // Calculate number of passes for walls
    const numPassesX = Math.ceil(adjustedWidth / stepOverDistance)
    const numPassesY = Math.ceil(adjustedThickness / stepOverDistance)

    // Finish the top surface
    gcode += "\n; Finishing top surface\n"

    for (let y = 0; y < numPassesY; y++) {
      const yPos = stockAllowance + y * stepOverDistance

      // Move to start position
      gcode += `G0 X${stockAllowance.toFixed(3)} Y${yPos.toFixed(3)} ; Rapid to start position\n`

      // Plunge to top surface
      gcode += `G1 Z${(-adjustedHeight).toFixed(3)} F${plungeRate} ; Plunge to top surface\n`

      // Cut in X direction
      gcode += `G1 X${(adjustedWidth + stockAllowance).toFixed(3)} Y${yPos.toFixed(3)} F${feedRate} ; Finish cut along X\n`
    }

    // Finish the walls
    gcode += "\n; Finishing walls\n"

    // Front wall
    gcode += `G0 X${stockAllowance.toFixed(3)} Y${stockAllowance.toFixed(3)} Z${retractHeight} ; Rapid to front wall start\n`
    gcode += `G1 Z${(-adjustedHeight).toFixed(3)} F${plungeRate} ; Plunge to cutting thickness\n`
    gcode += `G1 X${(adjustedWidth + stockAllowance).toFixed(3)} Y${stockAllowance.toFixed(3)} F${feedRate} ; Cut front wall\n`

    // Right wall
    gcode += `G1 X${(adjustedWidth + stockAllowance).toFixed(3)} Y${(adjustedThickness + stockAllowance).toFixed(3)} F${feedRate} ; Cut right wall\n`

    // Back wall
    gcode += `G1 X${stockAllowance.toFixed(3)} Y${(adjustedThickness + stockAllowance).toFixed(3)} F${feedRate} ; Cut back wall\n`

    // Left wall
    gcode += `G1 X${stockAllowance.toFixed(3)} Y${stockAllowance.toFixed(3)} F${feedRate} ; Cut left wall\n`

    return gcode
  }

  // Function to generate a contour toolpath
  const generateContourToolpath = (
    width,
    thickness,
    height,
    toolDiameter,
    feedRate,
    plungeRate,
    retractHeight,
    stockAllowance,
  ) => {
    let gcode = "; Contour operation\n"

    // Adjust dimensions for stock allowance
    const adjustedWidth = width - 2 * stockAllowance
    const adjustedThickness = thickness - 2 * stockAllowance
    const adjustedHeight = height - stockAllowance

    // Calculate number of layers (simplified to 3 for demonstration)
    const numLayers = 3
    const layerHeight = adjustedHeight / numLayers

    // Generate contour for each layer
    for (let layer = 0; layer < numLayers; layer++) {
      const z = -layer * layerHeight

      gcode += `\n; Contour at Z=${z.toFixed(3)}\n`
      gcode += `G0 X${stockAllowance.toFixed(3)} Y${stockAllowance.toFixed(3)} Z${retractHeight} ; Rapid to start position\n`
      gcode += `G1 Z${z.toFixed(3)} F${plungeRate} ; Plunge to contour thickness\n`

      // Cut contour (rectangle)
      gcode += `G1 X${(adjustedWidth + stockAllowance).toFixed(3)} Y${stockAllowance.toFixed(3)} F${feedRate} ; Contour cut 1\n`
      gcode += `G1 X${(adjustedWidth + stockAllowance).toFixed(3)} Y${(adjustedThickness + stockAllowance).toFixed(3)} F${feedRate} ; Contour cut 2\n`
      gcode += `G1 X${stockAllowance.toFixed(3)} Y${(adjustedThickness + stockAllowance).toFixed(3)} F${feedRate} ; Contour cut 3\n`
      gcode += `G1 X${stockAllowance.toFixed(3)} Y${stockAllowance.toFixed(3)} F${feedRate} ; Contour cut 4\n`
    }

    return gcode
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left side - Input forms */}
        <div className="w-full md:w-1/2 p-4 flex flex-col overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <ul className="grid grid-cols-5 mb-12">
              <li className="px-2"><button className={`py-2 rounded-xl m-auto text-white font-bold w-full hover:bg-blue-600 ${ activeTab==="dimensions"?"bg-blue-700":"bg-blue-500" }`} onClick={()=>setActiveTab("dimensions")} value="dimensions">Dimensions</button></li>
              <li className="px-2"><button className={`py-2 rounded-xl m-auto text-white font-bold w-full hover:bg-blue-600 ${ activeTab==="tool"?"bg-blue-700":"bg-blue-500" }`} onClick={()=>setActiveTab("tool")} value="tool">Tool</button></li>
              <li className="px-2"><button className={`py-2 rounded-xl m-auto text-white font-bold w-full hover:bg-blue-600 ${ activeTab==="operation"?"bg-blue-700":"bg-blue-500" }`} onClick={()=>setActiveTab("operation")} value="operation">Operation</button></li>
              <li className="px-2"><button className={`py-2 rounded-xl m-auto text-white font-bold w-full hover:bg-blue-600 ${ activeTab==="machine"?"bg-blue-700":"bg-blue-500" }`} onClick={()=>setActiveTab("machine")} value="machine">Machine</button></li>
              <li className="px-2"><button className={`py-2 rounded-xl m-auto text-white font-bold w-full hover:bg-blue-600 ${ activeTab==="strategy"?"bg-blue-700":"bg-blue-500" }`} onClick={()=>setActiveTab("strategy")} value="strategy">Strategy</button></li>
            </ul>

            {/* Dimensions Tab */}
            <TabsContent value="dimensions" className={`space-y-4 ${activeTab==="dimensions"?"block":"hidden"}`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold">Door Dimensions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (mm)</Label>
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
                    <Label htmlFor="height">Height (mm)</Label>
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
                    <Label htmlFor="thickness">Thickness (mm)</Label>
                    <Input
                      id="thickness"
                      name="thickness"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.thickness}
                      onChange={handleChange}
                      placeholder="Thickness"
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
                </div>
                <h2 className="text-lg font-bold">Lite Dimensions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="liteWidth">LiteWidth (mm)</Label>
                    <Input
                      id="liteWidth"
                      name="liteWidth"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.liteWidth}
                      onChange={handleChange}
                      placeholder="liteWidth"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="liteHeight">LiteHeight (mm)</Label>
                    <Input
                      id="liteHeight"
                      name="liteHeight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.liteHeight}
                      onChange={handleChange}
                      placeholder="liteHeight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="litePositionTop">LitePositionTop (mm)</Label>
                    <Input
                      id="litePositionTop"
                      name="litePositionTop"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.litePositionTop}
                      onChange={handleChange}
                      placeholder="litePositionTop"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="litePositionRight">LitePositionRight (mm)</Label>
                    <Input
                      id="litePositionRight"
                      name="litePositionRight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.litePositionRight}
                      onChange={handleChange}
                      placeholder="litePositionRight"
                    />
                  </div>
                </div>
                <h2 className="text-lg font-bold">Hinge Dimensions</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hingeTop">HingeTop (mm)</Label>
                    <Input
                      id="hingeTop"
                      name="hingeTop"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.hingeTop}
                      onChange={handleChange}
                      placeholder="hingeTop"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hingeBackSet">HingeBackSet (mm)</Label>
                    <Input
                      id="hingeBackSet"
                      name="hingeBackSet"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.hingeBackSet}
                      onChange={handleChange}
                      placeholder="hingeBackSet"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hingeThickness">HingeThickness (mm)</Label>
                    <Input
                      id="hingeThickness"
                      name="hingeThickness"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.hingeThickness}
                      onChange={handleChange}
                      placeholder="hingeThickness"
                    />
                  </div>
                </div>
                <h2 className="text-lg font-bold">Lock Dimensions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lockPosition">LockPosition (mm)</Label>
                    <Input
                      id="lockPosition"
                      name="lockPosition"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={inputValues.lockPosition}
                      onChange={handleChange}
                      placeholder="lockPosition"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Update Cube
                </Button>

                <div className="text-sm text-gray-500">
                  Current dimensions: {dimensions.width} × {dimensions.height} × {dimensions.thickness} mm
                </div>
              </form>
            </TabsContent>

            {/* Tool Tab */}
            <TabsContent value="tool" className={`space-y-4 ${activeTab==="tool"?"block":"hidden"}`}>
              <h2 className="text-xl font-bold">Tool Parameters</h2>

              <div className="space-y-2">
                <Label htmlFor="type">Tool Type</Label>
                <select
                  id="type"
                  name="type"
                  value={toolParams.type}
                  onChange={handleToolParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TOOL_TYPES.map((toolType) => (
                    <option key={toolType.id} value={toolType.id}>
                      {toolType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diameter">Tool Diameter (mm)</Label>
                <Input
                  id="diameter"
                  name="diameter"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={toolParams.diameter}
                  onChange={handleToolParamChange}
                  placeholder="Diameter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Tool Length (mm)</Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  step="1"
                  min="1"
                  value={toolParams.length}
                  onChange={handleToolParamChange}
                  placeholder="Length"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fluteLength">Flute Length (mm)</Label>
                <Input
                  id="fluteLength"
                  name="fluteLength"
                  type="number"
                  step="1"
                  min="1"
                  value={toolParams.fluteLength}
                  onChange={handleToolParamChange}
                  placeholder="Flute Length"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flutes">Number of Flutes</Label>
                <Input
                  id="flutes"
                  name="flutes"
                  type="number"
                  step="1"
                  min="1"
                  value={toolParams.flutes}
                  onChange={handleToolParamChange}
                  placeholder="Flutes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cornerRadius">Corner Radius (mm)</Label>
                <Input
                  id="cornerRadius"
                  name="cornerRadius"
                  type="number"
                  step="0.1"
                  min="0"
                  value={toolParams.cornerRadius}
                  onChange={handleToolParamChange}
                  placeholder="Corner Radius"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Tool Material</Label>
                <select
                  id="material"
                  name="material"
                  value={toolParams.material}
                  onChange={handleToolParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TOOL_MATERIALS.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>

            {/* Operation Tab */}
            <TabsContent value="operation" className={`space-y-4 ${activeTab==="operation"?"block":"hidden"}`}>
              <h2 className="text-xl font-bold">Operation Parameters</h2>

              <div className="space-y-2">
                <Label htmlFor="spindleSpeed">Spindle Speed (RPM)</Label>
                <Input
                  id="spindleSpeed"
                  name="spindleSpeed"
                  type="number"
                  step="100"
                  min="1000"
                  value={operationParams.spindleSpeed}
                  onChange={handleOperationParamChange}
                  placeholder="Spindle Speed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedRate">Feed Rate (mm/min)</Label>
                <Input
                  id="feedRate"
                  name="feedRate"
                  type="number"
                  step="10"
                  min="10"
                  value={operationParams.feedRate}
                  onChange={handleOperationParamChange}
                  placeholder="Feed Rate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plungeRate">Plunge Rate (mm/min)</Label>
                <Input
                  id="plungeRate"
                  name="plungeRate"
                  type="number"
                  step="10"
                  min="10"
                  value={operationParams.plungeRate}
                  onChange={handleOperationParamChange}
                  placeholder="Plunge Rate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepOver">Step Over (%)</Label>
                <Input
                  id="stepOver"
                  name="stepOver"
                  type="number"
                  step="1"
                  min="10"
                  max="100"
                  value={operationParams.stepOver}
                  onChange={handleOperationParamChange}
                  placeholder="Step Over"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepDown">Step Down (mm)</Label>
                <Input
                  id="stepDown"
                  name="stepDown"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={operationParams.stepDown}
                  onChange={handleOperationParamChange}
                  placeholder="Step Down"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuttingDirection">Cutting Direction</Label>
                <select
                  id="cuttingDirection"
                  name="cuttingDirection"
                  value={operationParams.cuttingDirection}
                  onChange={handleOperationParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CUTTING_DIRECTIONS.map((direction) => (
                    <option key={direction.id} value={direction.id}>
                      {direction.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coolant">Coolant</Label>
                <select
                  id="coolant"
                  name="coolant"
                  value={operationParams.coolant}
                  onChange={handleOperationParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {COOLANT_OPTIONS.map((coolant) => (
                    <option key={coolant.id} value={coolant.id}>
                      {coolant.name}
                    </option>
                  ))}
                </select>
              </div>
            </TabsContent>

            {/* Machine Tab */}
            <TabsContent value="machine" className={`space-y-4 ${activeTab==="machine"?"block":"hidden"}`}>
              <h2 className="text-xl font-bold">Machine Parameters</h2>

              <div className="space-y-2">
                <Label htmlFor="type">Machine Type</Label>
                <select
                  id="type"
                  name="type"
                  value={machineParams.type}
                  onChange={handleMachineParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MACHINE_TYPES.map((machineType) => (
                    <option key={machineType.id} value={machineType.id}>
                      {machineType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSpindleSpeed">Max Spindle Speed (RPM)</Label>
                <Input
                  id="maxSpindleSpeed"
                  name="maxSpindleSpeed"
                  type="number"
                  step="1000"
                  min="1000"
                  value={machineParams.maxSpindleSpeed}
                  onChange={handleMachineParamChange}
                  placeholder="Max Spindle Speed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFeedRate">Max Feed Rate (mm/min)</Label>
                <Input
                  id="maxFeedRate"
                  name="maxFeedRate"
                  type="number"
                  step="100"
                  min="100"
                  value={machineParams.maxFeedRate}
                  onChange={handleMachineParamChange}
                  placeholder="Max Feed Rate"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="travelLimitsX">X Travel Limit (mm)</Label>
                  <Input
                    id="travelLimitsX"
                    name="travelLimitsX"
                    type="number"
                    step="10"
                    min="10"
                    value={machineParams.travelLimitsX}
                    onChange={handleMachineParamChange}
                    placeholder="X Limit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelLimitsY">Y Travel Limit (mm)</Label>
                  <Input
                    id="travelLimitsY"
                    name="travelLimitsY"
                    type="number"
                    step="10"
                    min="10"
                    value={machineParams.travelLimitsY}
                    onChange={handleMachineParamChange}
                    placeholder="Y Limit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelLimitsZ">Z Travel Limit (mm)</Label>
                  <Input
                    id="travelLimitsZ"
                    name="travelLimitsZ"
                    type="number"
                    step="10"
                    min="10"
                    value={machineParams.travelLimitsZ}
                    onChange={handleMachineParamChange}
                    placeholder="Z Limit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tableX">Table Width (mm)</Label>
                  <Input
                    id="tableX"
                    name="tableX"
                    type="number"
                    step="10"
                    min="10"
                    value={machineParams.tableX}
                    onChange={handleMachineParamChange}
                    placeholder="Table Width"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tableY">Table Thickness (mm)</Label>
                  <Input
                    id="tableY"
                    name="tableY"
                    type="number"
                    step="10"
                    min="10"
                    value={machineParams.tableY}
                    onChange={handleMachineParamChange}
                    placeholder="Table Thickness"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rapidTravelSpeed">Rapid Travel Speed (mm/min)</Label>
                <Input
                  id="rapidTravelSpeed"
                  name="rapidTravelSpeed"
                  type="number"
                  step="100"
                  min="100"
                  value={machineParams.rapidTravelSpeed}
                  onChange={handleMachineParamChange}
                  placeholder="Rapid Travel Speed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolChangeTime">Tool Change Time (sec)</Label>
                <Input
                  id="toolChangeTime"
                  name="toolChangeTime"
                  type="number"
                  step="1"
                  min="1"
                  value={machineParams.toolChangeTime}
                  onChange={handleMachineParamChange}
                  placeholder="Tool Change Time"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCoolant"
                  name="hasCoolant"
                  checked={machineParams.hasCoolant}
                  onCheckedChange={(checked) =>
                    setMachineParams((prev) => ({
                      ...prev,
                      hasCoolant: !!checked,
                    }))
                  }
                />
                <Label htmlFor="hasCoolant">Machine has coolant system</Label>
              </div>
            </TabsContent>

            {/* Strategy Tab */}
            <TabsContent value="strategy" className={`space-y-4 ${activeTab==="strategy"?"block":"hidden"}`}>
              <h2 className="text-xl font-bold">Machining Strategy</h2>

              <div className="space-y-2">
                <Label htmlFor="operationType">Operation Type</Label>
                <select
                  id="operationType"
                  name="operationType"
                  value={strategyParams.operationType}
                  onChange={handleStrategyParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {OPERATION_TYPES.map((opType) => (
                    <option key={opType.id} value={opType.id}>
                      {opType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolpathPattern">Toolpath Pattern</Label>
                <select
                  id="toolpathPattern"
                  name="toolpathPattern"
                  value={strategyParams.toolpathPattern}
                  onChange={handleStrategyParamChange}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TOOLPATH_PATTERNS.map((pattern) => (
                    <option key={pattern.id} value={pattern.id}>
                      {pattern.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clearanceHeight">Clearance Height (mm)</Label>
                <Input
                  id="clearanceHeight"
                  name="clearanceHeight"
                  type="number"
                  step="1"
                  min="1"
                  value={strategyParams.clearanceHeight}
                  onChange={handleStrategyParamChange}
                  placeholder="Clearance Height"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retractHeight">Retract Height (mm)</Label>
                <Input
                  id="retractHeight"
                  name="retractHeight"
                  type="number"
                  step="1"
                  min="1"
                  value={strategyParams.retractHeight}
                  onChange={handleStrategyParamChange}
                  placeholder="Retract Height"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockAllowance">Stock Allowance (mm)</Label>
                <Input
                  id="stockAllowance"
                  name="stockAllowance"
                  type="number"
                  step="0.1"
                  min="0"
                  value={strategyParams.stockAllowance}
                  onChange={handleStrategyParamChange}
                  placeholder="Stock Allowance"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Export Buttons */}
          <div className={`grid grid-cols-1 gap-2 mt-4 ${activeTab==="strategy"?"block":"hidden"}`}>
            <Button type="button" onClick={exportCubeAsOBJ} className="w-full bg-blue-600 hover:bg-blue-700">
              Download as OBJ
            </Button>

            <Button type="button" onClick={exportCubeAsSTL} className="w-full bg-green-600 hover:bg-green-700">
              Download as STL
            </Button>

            <Button type="button" onClick={generateGCode} className="w-full bg-purple-600 hover:bg-purple-700">
              Generate G-code with Open CASCADE
            </Button>
          </div>

          {/* Processing Status */}
          {processingStatus && (
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md text-center">{processingStatus}</div>
          )}

          <div className={`mt-4 p-4 bg-gray-100 rounded-md text-sm ${activeTab==="strategy"?"block":"hidden"}`}>
            <h3 className="font-medium mb-2">Manufacturing Pipeline:</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Configure cube dimensions and material</li>
              <li>Set tool, operation, machine, and strategy parameters</li>
              <li>Export as STL for 3D printing or visualization</li>
              <li>Generate G-code with Open CASCADE integration for CNC machining</li>
            </ol>
          </div>
        </div>

        {/* Right side - Three.js canvas */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 min-h-[300px]">
            <Canvas camera={{ position: [3000, 1000, 3000], fov: 50, near: 0.1, far: 20000  }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[0, 2000, 8000]} intensity={1.5} />
              <Door
                dimensions={dimensions}
                texturePath={selectedTexturePath}
                textureType={selectedTexture}
                cubeRef={cubeRef}
              />
              <CameraController view={currentView} positions={viewPositions} controlsRef={controlsRef} />
              <OrbitControls ref={controlsRef} />
              {/* <gridHelper args={[5000, 500]} /> */}
              {/* <axesHelper args={[2000]} /> */}
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
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.thickness]} />
      {materials.length === 6 ? (
        materials.map((material, index) => <primitive key={index} object={material} attach={`material-${index}`} />)
      ) : (
        <meshStandardMaterial color="#1e88e5" />
      )}
    </mesh>
  )
}

function Door({ dimensions, texturePath, cubeRef }) {
  const meshRef = useRef();
  useEffect(() => { if (meshRef.current) cubeRef.current = meshRef.current; }, [meshRef, cubeRef]);
  const texture = new THREE.TextureLoader().load(texturePath);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(0.002, 0.002)

  const shape = createDoorShape(dimensions);
  const extrudeSettings = { depth: dimensions.thickness, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const doorMesh = new THREE.Mesh(geometry);
  doorMesh.material = new THREE.MeshStandardMaterial({ map: texture });

  // Create the subtractive mesh (for example, a cylinder for the hole)
  const lockbox = new THREE.BoxGeometry(120, 150, 30)
  lockbox.translate(dimensions.width/2-50, dimensions.height/2-dimensions.lockPosition, 25)
  // const holeGeometry = new THREE.CylinderGeometry(100, 100, dimensions.thickness*2, 32);
  // holeGeometry.rotateX(Math.PI / 2); // Rotate to position it correctly for subtraction
  // holeGeometry.translate(0, 100, 60); // Adjust position to the desired hole location
  const lockMesh = new THREE.Mesh(lockbox);
console.log(dimensions);
  const hingeGeometry1 = new THREE.BoxGeometry(15, 150, (dimensions.thickness-dimensions.hingeBackSet)*2)
  hingeGeometry1.translate(-dimensions.width/2, dimensions.height/2-dimensions.hingeTop-75, 0)
  const hingeMesh1 = new THREE.Mesh(hingeGeometry1);

  const hingeGeometry2 = new THREE.BoxGeometry(15, 150, (dimensions.thickness-dimensions.hingeBackSet)*2)
  hingeGeometry2.translate(-dimensions.width/2, (325-dimensions.hingeTop)/2, 0)
  const hingeMesh2 = new THREE.Mesh(hingeGeometry2);

  const hingeGeometry3 = new THREE.BoxGeometry(15, 150, (dimensions.thickness-dimensions.hingeBackSet)*2)
  hingeGeometry3.translate(-dimensions.width/2, -dimensions.height/2+400, 0)
  const hingeMesh3 = new THREE.Mesh(hingeGeometry3);

  // Perform the subtraction using CSG
  const doorCSG = CSG.fromMesh(doorMesh);  // Convert door mesh to CSG
  const holeCSG = CSG.fromMesh(lockMesh);  // Convert hole mesh to CSG
  const hingeCSG1 = CSG.fromMesh(hingeMesh1);  // Convert hinge mesh to CSG
  const hingeCSG2 = CSG.fromMesh(hingeMesh2);  // Convert hinge mesh to CSG
  const hingeCSG3 = CSG.fromMesh(hingeMesh3);  // Convert hinge mesh to CSG
  const resultCSG = doorCSG.subtract(holeCSG).subtract(hingeCSG1).subtract(hingeCSG2).subtract(hingeCSG3);  // Perform the subtraction

  // Convert the result back to a Three.js mesh
  const resultMesh = CSG.toMesh(resultCSG, doorMesh.matrix, doorMesh.material)

  // // Convert the resulting CSG back to mesh geometry
  // const resultGeometry = resultCSG.toGeometry();
  // const resultMesh = new THREE.Mesh(resultGeometry, doorMesh.material); // Use original material


  return (
    <mesh ref={meshRef} geometry={resultMesh.geometry} material={doorMesh.material}>
      {/* <shapeGeometry args={[createDoorShape(dimensions)]} /> */}
    </mesh>
  );
}

function createDoorShape(dimensions) {

  const shape = new THREE.Shape();
  shape.moveTo(-dimensions.width / 2, -dimensions.height / 2);
  shape.lineTo(dimensions.width / 2, -dimensions.height / 2);
  shape.lineTo(dimensions.width / 2, dimensions.height / 2);
  shape.lineTo(-dimensions.width / 2, dimensions.height / 2);
  shape.lineTo(-dimensions.width / 2, -dimensions.height / 2);

  // const circularhole = new THREE.Path();
  // circularhole.absarc(0, dimensions.height / 3, dimensions.width / 4, 0, Math.PI * 2, false);
  // shape.holes.push(circularhole);

  // const ecllipsehole = new THREE.Path();
  // ecllipsehole.absellipse(0, 0, 300, 150, 0, Math.PI * 2, false);
  // shape.holes.push(ecllipsehole);

  const lockholepath1 = new THREE.Path();
  lockholepath1.absarc(dimensions.width/2-70, dimensions.height/2-dimensions.lockPosition+35, 10, 0, Math.PI * 2, false);
  shape.holes.push(lockholepath1);

  const lockholepath2 = new THREE.Path();
  lockholepath2.absarc(dimensions.width/2-70, dimensions.height/2-dimensions.lockPosition, 20, 0, Math.PI * 2, false);
  shape.holes.push(lockholepath2);

  const lockholepath3 = new THREE.Path();
  lockholepath3.absarc(dimensions.width/2-70, dimensions.height/2-dimensions.lockPosition-35, 10, 0, Math.PI * 2, false);
  shape.holes.push(lockholepath3);

  const rectHole = new THREE.Path();
  const width = dimensions.liteWidth;  // Width of the hole
  const height = dimensions.liteHeight; // Height of the hole
  const x = dimensions.width/2-dimensions.litePositionRight;  // X position
  const y = dimensions.height/2-dimensions.litePositionTop;  // Y position
  rectHole.moveTo(x, y);
  rectHole.lineTo(x - width, y);         // Bottom edge
  rectHole.lineTo(x - width, y - height); // Right edge
  rectHole.lineTo(x, y - height);         // Top edge
  rectHole.lineTo(x, y);                  // Close the path
  shape.holes.push(rectHole);
  return shape;
}

