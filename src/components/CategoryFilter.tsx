import type { Participant } from '../types'
import { accentClasses, getParticipantAccent } from '../utils/participantColors'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  participants: Participant[]
}

export const ALL_CATEGORIES = 'All categories'

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  participants,
}: CategoryFilterProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
      <select
        value={selectedCategory}
        onChange={(event) => onSelectCategory(event.target.value)}
        className="font-display rounded-full border border-white/10 bg-night-card px-3 py-1.5 text-sm text-slate-200 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-lavender/60"
      >
        <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">Level</span>
        {participants.map((participant, index) => {
          const accent = accentClasses[getParticipantAccent(index)]
          return (
            <span
              key={participant.name}
              title={participant.name}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-night ${accent.bar}`}
            >
              {participant.name.slice(0, 1)}
            </span>
          )
        })}
      </div>
    </div>
  )
}
