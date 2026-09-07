import { useMemo, useState } from 'react'
import { commonMeds } from '../data/commonMeds'

const MIN_CHARS = 4
const MAX_SUGGESTIONS = 8

export default function MedNameInput({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const suggestions = useMemo(() => {
    if (value.trim().length < MIN_CHARS) return []
    const query = value.trim().toLowerCase()
    return commonMeds
      .filter((med) => med.toLowerCase().includes(query))
      .slice(0, MAX_SUGGESTIONS)
  }, [value])

  function selectSuggestion(name) {
    onChange(name)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <input
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {suggestions.map((name) => (
            <li key={name}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(name)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
