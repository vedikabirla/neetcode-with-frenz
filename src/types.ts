export interface Problem {
  slug: string
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  neetcodeUrl: string
  leetcodeUrl: string
}

export interface Participant {
  name: string
  /** Omit along with repo until this person's GitHub info is known. */
  githubUsername?: string
  repo?: string
  /** Path within the repo where solutions live, e.g. "Data Structures & Algorithms" */
  solutionDir?: string
}

export function isParticipantConfigured(
  participant: Participant,
): participant is Participant & { githubUsername: string; repo: string } {
  return Boolean(participant.githubUsername && participant.repo)
}

export type WeeklyCategory = 'Algorithm' | 'System Design' | 'Behavioral' | 'Meeting'

export interface WeeklyLink {
  label: string
  url: string
}

export interface WeeklyAssignment {
  /** Stable within a week, including when the assignment is edited. */
  id: string
  date: string
  title: string
  instructions: string
  category: WeeklyCategory
  duration: string
  required: boolean
  resources?: WeeklyLink[]
  submissionLink?: WeeklyLink
  submissionLabel?: string
}

export interface WeeklyWeek {
  label: string
  /** Local calendar date in YYYY-MM-DD format, starting on a Monday. */
  startDate: string
  restDays?: Record<string, string>
  dayNotes?: Record<string, string>
  assignments: WeeklyAssignment[]
}

export interface AssignmentProgress {
  completed?: boolean
  submissionUrl?: string
}

/** Week start → assignment ID → participant name. */
export type WeeklyProgress = Record<string, Record<string, Record<string, AssignmentProgress>>>
