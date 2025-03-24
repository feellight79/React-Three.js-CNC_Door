export function SelectGroup({ children, className = "", ...props }) {
    return (
      <optgroup className={className} {...props}>
        {children}
      </optgroup>
    )
  }
  
  export function SelectTrigger({ children, className = "", ...props }) {
    return (
      <button
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
  
  export function SelectValue({ children, className = "", ...props }) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    )
  }
  
  export function SelectContent({ children, className = "", ...props }) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }
  
  export function SelectLabel({ children, className = "", ...props }) {
    return (
      <label className={className} {...props}>
        {children}
      </label>
    )
  }
  
  export function SelectItem({ children, className = "", ...props }) {
    return (
      <option className={className} {...props}>
        {children}
      </option>
    )
  }
  
  export function SelectSeparator({ className = "", ...props }) {
    return <hr className={className} {...props} />
  }
  
  export function SelectScrollUpButton({ children = "Scroll up", className = "", ...props }) {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    )
  }
  
  export function SelectScrollDownButton({ children = "Scroll down", className = "", ...props }) {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    )
  }
  
  