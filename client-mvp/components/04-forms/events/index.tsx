"use client"

import { Input } from "@/shared/dsm"
import { useState, useEffect, useRef } from "react"
import styles from "./styles.module.sass"
import { useQueryState } from "nuqs"

const options = [
  {
    label: "Baseball",
    value: "baseball",
  },
  {
    label: "Basketball",
    value: "basketball",
  },
  {
    label: "Football",
    value: "football",
  },
  {
    label: "Fútbol (Soccer)",
    value: "soccer",
  },
  {
    label: "Ice Hockey",
    value: "hockey",
  },
]

// Define available color themes
export type ColorTheme = "orange" | "green"

interface FormEventsProps {
  colorTheme?: ColorTheme
}

export function FormEvents({ colorTheme = "orange" }: FormEventsProps) {
  const [filter, setFilter] = useQueryState("filter")
  const [query, setQuery] = useQueryState("query")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize selected options from URL parameter
  useEffect(() => {
    if (filter) {
      setSelectedOptions(filter.split(","))
    }
  }, [filter])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionChange = (value: string) => {
    let newSelected

    if (selectedOptions.includes(value)) {
      newSelected = selectedOptions.filter((option) => option !== value)
    } else {
      newSelected = [...selectedOptions, value]
    }

    setSelectedOptions(newSelected)
    setFilter(newSelected.length > 0 ? newSelected.join(",") : null)
  }

  // Get theme-specific class names
  const getThemeClass = (baseClass: string) => {
    return `${styles[baseClass]} ${styles[`${baseClass}--${colorTheme}`]}`
  }

  return (
    <form className={styles.base}>
      <div className={styles.selectContainer} ref={dropdownRef}>
        <button type="button" className={getThemeClass("selectTrigger")} onClick={() => setIsOpen(!isOpen)}>
          Filter by
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.chevron}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={getThemeClass("dropdown")}>
            {options.map((option) => (
              <label key={option.value} className={getThemeClass("option")}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleOptionChange(option.value)}
                  className={getThemeClass("checkbox")}
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className={styles.searchContainer}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={getThemeClass("searchIcon")}
        >
          <path
            d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Input
          name="query"
          value={query || ""}
          placeholder="Search event..."
          onChange={(e) => setQuery(e.target.value)}
          className={getThemeClass("searchInput")}
          style={{ height: "36px", fontSize: "14px" }} // Adjusted to match design
        />
      </div>
    </form>
  )
}
