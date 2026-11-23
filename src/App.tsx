import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ALL_CATEGORIES, CategoryFilter } from './components/CategoryFilter'
import { CursorTrail } from './components/CursorTrail'
import { Sparkle, StarfieldBackground } from './components/decorations'
import { ProblemTable } from './components/ProblemTable'
import { ProgressSummary } from './components/ProgressSummary'
import { WeeklyPlan } from './components/WeeklyPlan'
import { participants } from './data/participants'
import problemsData from './data/problems.json'
import { fetchParticipantGithubData, GitHubApiError } from './services/github'
import { isProgressFresh, readGitHubProgress, saveGitHubProgress, toCachedProgress } from './services/githubProgressCache'
import { isParticipantConfigured, type Problem } from './types'
import { buildCompletionSet } from './utils/problemMatcher'

const problems = problemsData as Problem[]
const configuredParticipants = participants.filter(isParticipantConfigured)
const cacheNamespace = import.meta.env.DEV && import.meta.env.MODE === 'fixtures' ? 'fixtures' : 'live'
const cacheKey = `frenz:github-progress:v1:${cacheNamespace}:${JSON.stringify(configuredParticipants)}`
const participantNames = configuredParticipants.map(({ name }) => name)
const categoryOrder = [...new Set(problems.map((p) => p.category))]
const RECENTLY_COMPLETED_DISPLAY_MS = 1500
const tabs = [
  { id: 'tracker', label: 'NeetCode 150' },
  { id: 'weekly-plan', label: 'Weekly Plan' },
] as const

interface ParticipantError {
  participantName: string
  message: string
}

function App() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('tracker')
  const [progress, setProgress] = useState(() => readGitHubProgress(cacheKey, participantNames))
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ParticipantError[]>([])
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)

  const progressRef = useRef(progress)
  const refreshInFlight = useRef(false)

  const refresh = useCallback(async (force = false) => {
    if (refreshInFlight.current) return

    const previous = progressRef.current
    const now = Date.now()
    const requested = configuredParticipants.filter(({ name }) => force || !isProgressFresh(previous[name], now))
    if (requested.length === 0) return

    refreshInFlight.current = true
    setLoading(true)
    setErrors([])

    const results = await Promise.allSettled(requested.map(fetchParticipantGithubData))
    const next = { ...previous }
    const nextErrors: ParticipantError[] = []
    const newlyCompleted = new Set<string>()
    const checkedAt = Date.now()

    results.forEach((result, index) => {
      const { name } = requested[index]
      if (result.status === 'fulfilled') {
        const oldEntry = previous[name]
        if (oldEntry) {
          const oldSolves = buildCompletionSet(problems, oldEntry.folderNames)
          for (const slug of buildCompletionSet(problems, result.value.folderNames)) {
            if (!oldSolves.has(slug)) newlyCompleted.add(`${name}:${slug}`)
          }
        }
        next[name] = toCachedProgress(result.value, checkedAt)
      } else {
        const message = result.reason instanceof GitHubApiError
          ? result.reason.message
          : 'Unexpected error fetching GitHub data.'
        nextErrors.push({ participantName: name, message: previous[name] ? `${message} Showing saved progress.` : message })
      }
    })

    if (newlyCompleted.size > 0) {
      setRecentlyCompleted(newlyCompleted)
      setTimeout(() => setRecentlyCompleted(new Set()), RECENTLY_COMPLETED_DISPLAY_MS)
    }
    progressRef.current = next
    setProgress(next)
    if (results.some((result) => result.status === 'fulfilled')) saveGitHubProgress(cacheKey, next)
    setErrors(nextErrors)
    setLoading(false)
    refreshInFlight.current = false
  }, [])

  useEffect(() => {
    // Schedule the initial refresh after render and cancel the Strict Mode probe.
    const timer = setTimeout(() => void refresh(), 0)
    return () => clearTimeout(timer)
  }, [refresh])

  const { completionByParticipant, lastSubmissionByParticipant, lastChecked } = useMemo(() => {
    const completionByParticipant: Record<string, Set<string>> = {}
    const lastSubmissionByParticipant: Record<string, Date | null> = {}
    let lastChecked: number | undefined

    for (const { name } of configuredParticipants) {
      const entry = progress[name]
      if (!entry) continue
      completionByParticipant[name] = buildCompletionSet(problems, entry.folderNames)
      lastSubmissionByParticipant[name] = entry.lastSubmission ? new Date(entry.lastSubmission) : null
      lastChecked = Math.min(lastChecked ?? entry.checkedAt, entry.checkedAt)
    }
    return { completionByParticipant, lastSubmissionByParticipant, lastChecked }
  }, [progress])

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
            {activeTab === 'tracker' && lastChecked !== undefined && (
              <p className="mt-1 text-xs text-slate-400">
                Progress last checked {new Date(lastChecked).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </div>
          {activeTab === 'tracker' && (
            <button
              type="button"
              onClick={() => void refresh(true)}
              disabled={loading}
              className="font-display shrink-0 rounded-full border border-lavender/30 bg-night-card px-4 py-1.5 text-sm font-semibold text-lavender shadow-sm transition-colors hover:bg-lavender/10 disabled:opacity-50"
            >
              {loading ? 'Refreshing…' : '✨ Refresh'}
            </button>
          )}
        </div>

        <div role="tablist" aria-label="Study dashboard" className="mt-4 flex gap-2">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              id={`tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              tabIndex={activeTab === id ? 0 : -1}
              className="font-display min-h-10 rounded-full border border-lavender/20 bg-night-card px-4 text-sm font-semibold text-slate-300 hover:bg-lavender/10 focus-visible:outline-2 focus-visible:outline-lavender aria-selected:border-lavender/40 aria-selected:bg-lavender/15 aria-selected:text-lavender"
              onClick={() => setActiveTab(id)}
              onKeyDown={(event) => {
                let nextTab: (typeof tabs)[number]['id']
                switch (event.key) {
                  case 'Home':
                    nextTab = tabs[0].id
                    break
                  case 'End':
                    nextTab = tabs[1].id
                    break
                  case 'ArrowLeft':
                  case 'ArrowRight':
                    nextTab = id === tabs[0].id ? tabs[1].id : tabs[0].id
                    break
                  default:
                    return
                }
                event.preventDefault()
                setActiveTab(nextTab)
                document.getElementById(`tab-${nextTab}`)?.focus()
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'tracker' && errors.length > 0 && (
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
        <section id="panel-tracker" role="tabpanel" aria-labelledby="tab-tracker" hidden={activeTab !== 'tracker'}>
          <ProgressSummary
            participants={participants}
            completionByParticipant={completionByParticipant}
            lastSubmissionByParticipant={lastSubmissionByParticipant}
            totalProblems={problems.length}
            loading={loading}
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
        </section>
        <section id="panel-weekly-plan" role="tabpanel" aria-labelledby="tab-weekly-plan" hidden={activeTab !== 'weekly-plan'}>
          <WeeklyPlan participants={participants} />
        </section>
      </main>
    </div>
  )
}

export default App
