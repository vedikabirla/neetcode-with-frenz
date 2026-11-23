import type { Participant } from '../types'

export class GitHubApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

type ConfiguredParticipant = Participant & { githubUsername: string; repo: string }

interface GitTreeEntry {
  path: string
  type: 'blob' | 'tree' | 'commit'
}

interface GitTreeResponse {
  tree: GitTreeEntry[]
  truncated: boolean
}

interface CommitSummary {
  commit: { committer: { date: string } | null; author: { date: string } | null }
}

async function fetchJson<T>(url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  } catch {
    throw new GitHubApiError('Could not reach GitHub. Check your internet connection and try again.')
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError('Repository not found. Check the username and repo name in participants.ts.', response.status)
    }
    if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
      const resetHeader = response.headers.get('x-ratelimit-reset')
      const resetTime = resetHeader
        ? new Date(Number(resetHeader) * 1000).toLocaleTimeString()
        : 'later'
      throw new GitHubApiError(`GitHub API rate limit exceeded. Try again after ${resetTime}.`, response.status)
    }
    throw new GitHubApiError(`GitHub API error (${response.status} ${response.statusText}).`, response.status)
  }

  return response.json() as Promise<T>
}

export interface ParticipantGithubData {
  folderNames: string[]
  truncated: boolean
  /** Most recent commit touching the solution directory, or null for an empty/unpushed repo. */
  lastSolutionCommitDate: Date | null
}

/**
 * Fetches a participant's solution folder names and their most recent
 * commit date under the configured solution directory.
 *
 * Folder names come from the Git Trees API (recursive) - one call to
 * resolve the default branch, one to fetch the full tree - independent of
 * how many problems exist. The commit date comes from a separate, path-
 * scoped Commits API call run in parallel. Three requests per participant
 * total, comfortably within the unauthenticated rate limit.
 */
export async function fetchParticipantGithubData(
  participant: ConfiguredParticipant,
): Promise<ParticipantGithubData> {
  const { githubUsername, repo, solutionDir } = participant
  const encodedPath = solutionDir ? `&path=${encodeURIComponent(solutionDir)}` : ''

  const [tree, lastSolutionCommitDate] = await Promise.all([
    fetchJson<{ default_branch: string }>(`https://api.github.com/repos/${githubUsername}/${repo}`).then(
      (repoInfo) =>
        fetchJson<GitTreeResponse>(
          `https://api.github.com/repos/${githubUsername}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`,
        ),
    ),
    fetchJson<CommitSummary[]>(
      `https://api.github.com/repos/${githubUsername}/${repo}/commits?per_page=1${encodedPath}`,
    )
      .then((commits) => {
        const date = commits[0]?.commit.committer?.date ?? commits[0]?.commit.author?.date
        return date && Number.isFinite(Date.parse(date)) ? new Date(date) : null
      })
      .catch((error: unknown) => {
        if (error instanceof GitHubApiError && error.status === 409) return null
        throw error
      }),
  ])

  const prefix = solutionDir ? `${solutionDir}/` : ''
  const folderNames = new Set<string>()

  for (const entry of tree.tree) {
    if (entry.type !== 'blob') continue
    if (prefix && !entry.path.startsWith(prefix)) continue

    const relativePath = prefix ? entry.path.slice(prefix.length) : entry.path
    const segments = relativePath.split('/')
    if (segments.length < 2) continue // a file directly in solutionDir, not inside a problem folder

    folderNames.add(segments[0])
  }

  return { folderNames: [...folderNames], truncated: tree.truncated, lastSolutionCommitDate }
}
