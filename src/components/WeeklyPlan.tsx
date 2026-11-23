import { useState } from 'react'
import { weeklyPlan } from '../data/weeklyPlan'
import type { AssignmentProgress, Participant, WeeklyAssignment, WeeklyLink } from '../types'
import { accentClasses, getParticipantAccent } from '../utils/participantColors'
import { currentWeekStart, isWebUrl, parseDate, readWeeklyProgress, shiftDate, weeklyStorageKey } from '../utils/weeklyPlan'

const dateRange = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
const dayLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
const buttonClasses = 'min-h-10 rounded-full border border-lavender/30 px-3 text-sm font-semibold text-lavender hover:bg-lavender/10 focus-visible:outline-2 focus-visible:outline-lavender disabled:opacity-50'
const linkClasses = 'text-lavender underline underline-offset-4 hover:text-slate-100'

function ExternalLink({ label, url }: WeeklyLink) {
  return <a className={linkClasses} href={url} target="_blank" rel="noreferrer">{label}</a>
}

interface AssignmentCardProps {
  assignment: WeeklyAssignment
  participants: Participant[]
  progress?: Record<string, AssignmentProgress>
  onChange: (participant: string, patch: AssignmentProgress) => void
}

function AssignmentCard({ assignment, participants, progress, onChange }: AssignmentCardProps) {
  const { title, category, duration, required, instructions, resources, submissionLink, submissionLabel } = assignment

  return (
    <article aria-label={title} className="rounded-2xl border border-lavender/20 bg-night-card p-4">
      <details>
        <summary className="cursor-pointer rounded-lg text-slate-100 focus-visible:outline-2 focus-visible:outline-lavender">
          <span className="font-display text-base font-bold">{title}</span>
          <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 pl-4 text-xs text-slate-300">
            <span>{category}</span>
            <span>{duration}</span>
            <span className={required ? 'text-lavender' : 'text-butter'}>{required ? 'Required' : 'Optional'}</span>
          </span>
        </summary>
        <div className="mt-3 space-y-3 pl-4 text-sm">
          <p className="whitespace-pre-line text-slate-200">{instructions}</p>
          {(Boolean(resources?.length) || submissionLink) && (
            <ul className="space-y-1">
              {resources?.map((link) => <li key={link.url}><ExternalLink {...link} /></li>)}
              {submissionLink && <li><ExternalLink {...submissionLink} /></li>}
            </ul>
          )}
          {submissionLabel && (
            <div className="space-y-2">
              {participants.map(({ name }) => {
                const url = progress?.[name]?.submissionUrl
                return (
                  <form
                    key={name}
                    className="space-y-1"
                    onSubmit={(event) => {
                      event.preventDefault()
                      const value = String(new FormData(event.currentTarget).get('url') ?? '').trim()
                      const input = event.currentTarget.querySelector('input')
                      if (value && !isWebUrl(value)) {
                        input?.setCustomValidity('Enter a link that starts with https:// or http://.')
                        input?.reportValidity()
                        return
                      }
                      onChange(name, { submissionUrl: value })
                    }}
                  >
                    <label className="block text-xs text-slate-300" htmlFor={`${assignment.id}-${name}-url`}>
                      {name} · {submissionLabel}
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        id={`${assignment.id}-${name}-url`}
                        className="min-h-10 min-w-0 flex-1 rounded-lg border border-lavender/30 bg-night px-3 focus-visible:outline-2 focus-visible:outline-lavender"
                        type="url"
                        name="url"
                        placeholder="https://…"
                        defaultValue={url}
                        onChange={(event) => event.currentTarget.setCustomValidity('')}
                      />
                      <button className={buttonClasses} type="submit" aria-label={`Save ${name}’s design link`}>Save</button>
                      {url && isWebUrl(url) && <ExternalLink label={`Open ${name}’s design`} url={url} />}
                    </div>
                  </form>
                )
              })}
            </div>
          )}
        </div>
      </details>

      <div className="mt-3 flex flex-wrap gap-x-3 border-t border-lavender/15 pt-1">
        {participants.map(({ name }, index) => {
          const accent = accentClasses[getParticipantAccent(index)]
          return (
            <label key={name} className={`flex min-h-10 cursor-pointer items-center gap-2 text-sm ${accent.text}`}>
              <input
                type="checkbox"
                className="size-4 accent-lavender focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
                aria-label={`${name}: ${title} complete`}
                checked={progress?.[name]?.completed ?? false}
                onChange={(event) => onChange(name, { completed: event.currentTarget.checked })}
              />
              {name}
            </label>
          )
        })}
      </div>
    </article>
  )
}

export function WeeklyPlan({ participants }: { participants: Participant[] }) {
  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart)
  const [progress, setProgress] = useState(readWeeklyProgress)
  const [storageError, setStorageError] = useState(false)

  const todayWeek = currentWeekStart()
  const week = weeklyPlan.find((entry) => entry.startDate === selectedWeek)
  const weekProgress = progress[selectedWeek]
  const requiredAssignments = week?.assignments.filter((assignment) => assignment.required) ?? []
  const restDays = week?.restDays ?? {}
  const days = [...new Set([...Object.keys(restDays), ...(week?.assignments.map(({ date }) => date) ?? [])])].sort()

  function saveProgress(assignmentId: string, participant: string, patch: AssignmentProgress) {
    // Read the latest stored values so an edit keeps changes saved in another tab.
    const latest = storageError ? progress : readWeeklyProgress()
    const latestWeek = latest[selectedWeek]
    const assignmentProgress = latestWeek?.[assignmentId]
    const next = {
      ...latest,
      [selectedWeek]: {
        ...latestWeek,
        [assignmentId]: {
          ...assignmentProgress,
          [participant]: { ...assignmentProgress?.[participant], ...patch },
        },
      },
    }
    setProgress(next)
    try {
      localStorage.setItem(weeklyStorageKey, JSON.stringify(next))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  return (
    <div className="space-y-5">
      <section aria-labelledby="weekly-date" className="space-y-4 rounded-2xl border border-lavender/20 bg-night-card p-4 sm:p-5">
        <div aria-live="polite">
          <p className="text-sm font-semibold text-lavender">
            {week?.label ?? (selectedWeek === todayWeek ? 'Current week' : selectedWeek < todayWeek ? 'Past week' : 'Upcoming week')}
            {week && selectedWeek === todayWeek && ' · Current week'}
          </p>
          <h2 id="weekly-date" className="font-display mt-1 text-xl font-bold text-slate-50">
            {dateRange.formatRange(parseDate(selectedWeek), parseDate(shiftDate(selectedWeek, 4)))}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Week navigation" role="group">
          <button type="button" className={buttonClasses} onClick={() => setSelectedWeek((date) => shiftDate(date, -7))}>Previous week</button>
          <button type="button" className={buttonClasses} onClick={() => setSelectedWeek(currentWeekStart())} disabled={selectedWeek === todayWeek}>Current week</button>
          <button type="button" className={buttonClasses} onClick={() => setSelectedWeek((date) => shiftDate(date, 7))}>Next week</button>
        </div>
        <p className="text-xs text-slate-300">Check off your name when you finish. Progress and design links are saved only in this browser.</p>
        {storageError && <p role="status" className="text-sm text-blush">Browser storage is unavailable. These changes may be lost after refresh.</p>}
      </section>

      {requiredAssignments.length > 0 && (
        <section aria-labelledby="weekly-progress" className="rounded-2xl border border-lavender/20 bg-night-card p-4 sm:p-5">
          <h3 id="weekly-progress" className="font-display font-bold">Weekly progress</h3>
          <p className="mt-1 text-xs text-slate-300">Required assignments only</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {participants.map(({ name }, index) => {
              const accent = accentClasses[getParticipantAccent(index)]
              const complete = requiredAssignments.filter(({ id }) => weekProgress?.[id]?.[name]?.completed).length
              const percentage = Math.round(100 * complete / requiredAssignments.length)
              return (
                <div key={name}>
                  <div className="flex justify-between gap-2 text-sm">
                    <span className={accent.text}>{name}</span>
                    <span className="text-slate-300">{percentage}%</span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${name}’s weekly progress`}
                    aria-valuenow={percentage}
                    aria-valuetext={`${complete} of ${requiredAssignments.length} required assignments complete`}
                    className="mt-2 h-2 overflow-hidden rounded-full bg-night"
                  >
                    <div className={`h-full rounded-full ${accent.bar}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {days.length === 0 && (
        <section className="rounded-2xl border border-lavender/20 bg-night-card p-5">
          <h3 className="font-display font-bold">No assignments scheduled</h3>
          <p className="mt-1 text-sm text-slate-300">Choose another week to see its assignments.</p>
        </section>
      )}

      {days.map((date) => (
        <section key={date} aria-labelledby={`plan-day-${date}`} className="space-y-2">
          <h3 id={`plan-day-${date}`} className="font-display text-sm font-bold text-lavender">{dayLabel.format(parseDate(date))}</h3>
          {week?.dayNotes?.[date] && <p className="text-sm text-slate-300">{week.dayNotes[date]}</p>}
          {restDays[date] && (
            <p className="rounded-2xl border border-lavender/20 bg-night-card p-4 text-sm text-slate-300">{restDays[date]}</p>
          )}
          {week?.assignments.filter((assignment) => assignment.date === date).map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              participants={participants}
              progress={weekProgress?.[assignment.id]}
              onChange={(name, patch) => saveProgress(assignment.id, name, patch)}
            />
          ))}
        </section>
      ))}
    </div>
  )
}
