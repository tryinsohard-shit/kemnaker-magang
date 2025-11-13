"use client"

import { ChevronDown } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimatedSelectProps = {
  options: {
    value: string
    label: string
  }[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

const AnimatedSelect = ({ options, value, onValueChange, placeholder, className }: AnimatedSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors cursor-pointer"
      >
        <span className={cn(!selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder || "Pilih..."}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4 opacity-50" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -10, scale: 0.95, opacity: 0, filter: "blur(4px)" }}
            animate={{ y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -10, scale: 0.95, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 p-1 bg-popover rounded-md shadow-lg border border-border backdrop-blur-sm"
          >
            <div className="max-h-60 overflow-y-auto">
              {options && options.length > 0 ? (
                options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left rounded-sm cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground",
                      value === option.value && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    {option.label}
                  </motion.button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">Tidak ada opsi</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { AnimatedSelect }
