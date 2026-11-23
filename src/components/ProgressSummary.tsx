import { isParticipantConfigured, type Participant } from '../types'
import { accentClasses, getParticipantAccent } from '../utils/participantColors'

interface ProgressSummaryProps {
  participants: Participant[]
  completionByParticipant: Record<string, Set<string>>
  lastSubmissionByParticipant: Record<string, Date | null>
  totalProblems: number
  loading: boolean
}

function formatLastSubmission(date: Date | null | undefined): string {
  if (!date) return 'No submissions yet'
  return `Last submission: ${date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}`
}

export function ProgressSummary({
  participants,
  completionByParticipant,
  lastSubmissionByParticipant,
  totalProblems,
  loading,
}: ProgressSummaryProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {participants.map((participant, index) => {
        const accent = accentClasses[getParticipantAccent(index)]

        if (!isParticipantConfigured(participant)) {
          return (
            <div
              key={participant.name}
              className="rounded-2xl border border-dashed border-slate-700 bg-night-card/40 px-4 py-3 text-sm text-slate-400"
            >
              <p className="font-display font-semibold text-slate-300">{participant.name}</p>
              <p className="mt-1">waiting for their GitHub info ✨</p>
            </div>
          )
        }

        const completion = completionByParticipant[participant.name]
        if (!completion) {
          return (
            <div key={participant.name} className="rounded-2xl border border-white/5 bg-night-card px-4 py-3">
              <p className={`font-display font-semibold ${accent.text}`}>{participant.name}</p>
              <p className="mt-1 text-xs text-slate-400">{loading ? 'Checking progress…' : 'Progress unavailable'}</p>
            </div>
          )
        }
        const completed = completion.size
        const percent = Math.round((completed / totalProblems) * 100)

        return (
          <div
            key={participant.name}
            className="rounded-2xl border border-white/5 bg-night-card px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${accent.dot}`} />
                <p className="font-display font-semibold">{participant.name}</p>
              </div>
              <p className={`text-sm font-semibold ${accent.text}`}>{percent}%</p>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {completed} / {totalProblems} solved
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${accent.bar}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {formatLastSubmission(lastSubmissionByParticipant[participant.name])}
            </p>
          </div>
        )
      })}
    </div>
  )
}
