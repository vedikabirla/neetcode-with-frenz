import { isParticipantConfigured, type Participant, type Problem } from '../types'
import { accentClasses, getParticipantAccent } from '../utils/participantColors'
import { CelebrationBurst } from './decorations'

interface ProblemTableProps {
  problems: Problem[]
  participants: Participant[]
  completionByParticipant: Record<string, Set<string>>
  recentlyCompleted: Set<string>
}

const difficultyColor: Record<Problem['difficulty'], string> = {
  Easy: 'text-mint',
  Medium: 'text-butter',
  Hard: 'text-blush',
}

function groupByCategory(items: Problem[]): Map<string, Problem[]> {
  const groups = new Map<string, Problem[]>()
  for (const problem of items) {
    const group = groups.get(problem.category)
    if (group) {
      group.push(problem)
    } else {
      groups.set(problem.category, [problem])
    }
  }
  return groups
}

export function ProblemTable({
  problems,
  participants,
  completionByParticipant,
  recentlyCompleted,
}: ProblemTableProps) {
  const grouped = groupByCategory(problems)

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 bg-night-card/40 px-6 py-12 text-center">
        <p className="font-display text-lg text-slate-200">Nothing to show here right now 🌙</p>
        <p className="text-sm text-slate-400">
          Try widening your filters — or just enjoy how far everyone's already come ✨
        </p>
      </div>
    )
  }

  return (
    <>
      {[...grouped.entries()].map(([category, categoryProblems]) => {
        return (
          <section
            key={category}
            className="mb-8 overflow-hidden rounded-2xl border border-white/5 bg-night-card shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <span
                className="motion-safe:animate-[gentle-bob_5s_ease-in-out_infinite]"
                aria-hidden="true"
              >
                ⭐
              </span>
              <h2 className="font-display text-sm font-semibold tracking-wide text-slate-300 uppercase">
                {category}
              </h2>
            </div>
            <ul className="divide-y divide-white/5">
              {categoryProblems.map((problem) => (
                <li
                  key={problem.slug}
                  className="group flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors hover:bg-lavender/[0.06]"
                >
                  <a
                    href={problem.neetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate decoration-lavender/60 underline-offset-4 group-hover:underline"
                  >
                    {problem.name}
                  </a>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className={`w-14 text-right text-xs font-semibold ${difficultyColor[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    {participants.map((participant, index) => {
                      const configured = isParticipantConfigured(participant)
                      const completion = completionByParticipant[participant.name]
                      if (!configured || !completion) {
                        return (
                          <span
                            key={participant.name}
                            title={`${participant.name}: ${configured ? "progress unavailable" : "GitHub info not added yet"}`}
                            className="w-6 text-center text-slate-700"
                          >
                            –
                          </span>
                        )
                      }
                      const isComplete = completion.has(problem.slug)
                      const justCompleted = recentlyCompleted.has(`${participant.name}:${problem.slug}`)
                      const accent = accentClasses[getParticipantAccent(index)]
                      return (
                        <span
                          key={participant.name}
                          title={participant.name}
                          className={`relative w-6 text-center ${
                            isComplete ? accent.text : 'text-slate-700'
                          } ${justCompleted ? 'motion-safe:animate-[pop-celebrate_0.6s_ease-out]' : ''}`}
                        >
                          {isComplete ? '✓' : '○'}
                          {justCompleted && <CelebrationBurst />}
                        </span>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </>
  )
}
