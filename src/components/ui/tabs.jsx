"use client"

import { useState } from "react"

export function Tabs({ children, value, onValueChange, className = "" }) {
  return <div className={className}>{children}</div>
}

export function TabsList({ children, className = "" }) {
  return <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>{children}</div>
}

export function TabsTrigger({ children, value, className = "" }) {
  const [activeTab, setActiveTab] = useState(value)

  const handleClick = () => {
    setActiveTab(value)
  }

  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-md ${
        activeTab === value ? "bg-white text-gray-900 shadow" : "text-gray-600 hover:text-gray-900"
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className = "" }) {
  return <div className={className}>{children}</div>
}

