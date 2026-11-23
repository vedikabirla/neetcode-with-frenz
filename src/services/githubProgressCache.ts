import type { ParticipantGithubData } from './github'

const TEN_MINUTES = 10 * 60 * 1000

export interface CachedParticipantProgress {
  checkedAt: number
  folderNames: string[]
  lastSubmission: string | null
}

export type GitHubProgressCache = Record<string, CachedParticipantProgress | undefined>

export function isProgressFresh(progress: CachedParticipantProgress | undefined, now: number): boolean {
  return Boolean(progress && now >= progress.checkedAt && now - progress.checkedAt < TEN_MINUTES)
}

export function toCachedProgress(data: ParticipantGithubData, checkedAt: number): CachedParticipantProgress {
  return {
    checkedAt,
    folderNames: data.folderNames,
    lastSubmission: data.lastSolutionCommitDate?.toISOString() ?? null,
  }
}

function isCachedProgress(entry: unknown): entry is CachedParticipantProgress {
  if (!entry || typeof entry !== 'object') return false
  const { checkedAt, folderNames, lastSubmission } = entry as Partial<CachedParticipantProgress>
  return typeof checkedAt === 'number' && Number.isFinite(checkedAt) &&
    Array.isArray(folderNames) && folderNames.every((name) => typeof name === 'string') &&
    (lastSubmission === null || (typeof lastSubmission === 'string' && Number.isFinite(Date.parse(lastSubmission))))
}

export function readGitHubProgress(key: string, participantNames: string[]): GitHubProgressCache {
  try {
    const stored: GitHubProgressCache | null = JSON.parse(localStorage.getItem(key) ?? '{}')
    return Object.fromEntries(participantNames.flatMap((name) => {
      const entry = stored?.[name]
      return isCachedProgress(entry) ? [[name, entry]] : []
    }))
  } catch {
    return {}
  }
}

export function saveGitHubProgress(key: string, progress: GitHubProgressCache): void {
  try {
    localStorage.setItem(key, JSON.stringify(progress))
  } catch {
    // Keep the in-memory result when browser storage is unavailable.
  }
}
