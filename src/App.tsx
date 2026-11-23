import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ALL_CATEGORIES, CategoryFilter } from './components/CategoryFilter'
import { CursorTrail } from './components/CursorTrail'
import { Sparkle, StarfieldBackground } from './components/decorations'
import { ProblemTable } from './components/ProblemTable'
import { ProgressSummary } from './components/ProgressSummary'
import { participants } from './data/participants'
import problemsData from './data/problems.json'
import { fetchParticipantGithubData, GitHubApiError } from './services/github'
import { isParticipantConfigured, type Problem } from './types'
import { buildCompletionSet } from './utils/problemMatcher'

const problems = problemsData as Problem[]
const configuredParticipants = participants.filter(isParticipantConfigured)
const categoryOrder = [...new Set(problems.map((p) => p.category))]
const RECENTLY_COMPLETED_DISPLAY_MS = 1500

interface ParticipantError {
  participantName: string
  message: string
}

function App() {
  const [completionByParticipant, setCompletionByParticipant] = useState<Record<string, Set<string>>>({})
  const [lastSubmissionByParticipant, setLastSubmissionByParticipant] = useState<Record<string, Date | null>>({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ParticipantError[]>([])
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)

  const previousCompletionRef = useRef<Record<string, Set<string>> | null>(null)
  const hasLoadedOnceRef = useRef(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setErrors([])

    const results = await Promise.allSettled(
      configuredParticipants.map((participant) => fetchParticipantGithubData(participant)),
    )

    const nextCompletion: Record<string, Set<string>> = {}
    const nextLastSubmission: Record<string, Date | null> = {}
    const nextErrors: ParticipantError[] = []

    results.forEach((result, index) => {
      const participant = configuredParticipants[index]
      if (result.status === 'fulfilled') {
        nextCompletion[participant.name] = buildCompletionSet(problems, result.value.folderNames)
        nextLastSubmission[participant.name] = result.value.lastSolutionCommitDate
      } else {
        const message =
          result.reason instanceof GitHubApiError
            ? result.reason.message
            : 'Unexpected error fetching GitHub data.'
        nextErrors.push({ participantName: participant.name, message })
      }
    })

    if (hasLoadedOnceRef.current) {
      const newlyCompleted = new Set<string>()
      for (const participant of configuredParticipants) {
        const prevSet = previousCompletionRef.current?.[participant.name] ?? new Set<string>()
        const nextSet = nextCompletion[participant.name] ?? new Set<string>()
        for (const slug of nextSet) {
          if (!prevSet.has(slug)) newlyCompleted.add(`${participant.name}:${slug}`)
        }
      }
      if (newlyCompleted.size > 0) {
        setRecentlyCompleted(newlyCompleted)
        setTimeout(() => setRecentlyCompleted(new Set()), RECENTLY_COMPLETED_DISPLAY_MS)
      }
    }
    previousCompletionRef.current = nextCompletion
    hasLoadedOnceRef.current = true

    setCompletionByParticipant(nextCompletion)
    setLastSubmissionByParticipant(nextLastSubmission)
    setErrors(nextErrors)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      if (selectedCategory !== ALL_CATEGORIES && problem.category !== selectedCategory) return false
      return true
    })
  }, [selectedCategory])

  return (
    <div className="isolate min-h-screen bg-night text-slate-100">
      <StarfieldBackground completionByParticipant={completionByParticipant} />
      <CursorTrail />

      <header className="mx-auto max-w-3xl px-4 pt-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display flex items-center gap-2 text-2xl font-bold text-slate-50">
              NeetCode with Frenz
              <Sparkle className="h-5 w-5 text-butter motion-safe:animate-[gentle-bob_4s_ease-in-out_infinite]" />
            </h1>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="font-display shrink-0 rounded-full border border-lavender/30 bg-night-card px-4 py-1.5 text-sm font-semibold text-lavender shadow-sm transition-colors hover:bg-lavender/10 disabled:opacity-50"
          >
            {loading ? 'Refreshing…' : '✨ Refresh'}
          </button>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 space-y-1 rounded-2xl border border-blush/30 bg-blush/10 px-3 py-2 text-sm text-blush">
            {errors.map((e) => (
              <p key={e.participantName}>
                {e.participantName}: {e.message}
              </p>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-12">
        <ProgressSummary
          participants={participants}
          completionByParticipant={completionByParticipant}
          lastSubmissionByParticipant={lastSubmissionByParticipant}
          totalProblems={problems.length}
        />

        <CategoryFilter
          categories={categoryOrder}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          participants={participants}
        />

        <ProblemTable
          problems={filteredProblems}
          participants={participants}
          completionByParticipant={completionByParticipant}
          recentlyCompleted={recentlyCompleted}
        />
      </main>
    </div>
  )
}

export default App
