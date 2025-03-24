"use client"

export function Checkbox({ id, name, checked, onCheckedChange, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {...props}
    />
  )
}

