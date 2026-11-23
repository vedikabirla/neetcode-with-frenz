const solutionDir = 'Data Structures & Algorithms'
const solvedByUser = {
  vedikabirla: ['duplicate-integer', 'is-anagram', 'two-integer-sum'],
  alitycast: ['duplicate-integer'],
  laylaxh: ['duplicate-integer', 'two-integer-sum'],
}
export const fixtureCommitDate = '2026-11-23T12:00:00Z'

export function githubFixtureResponse(url) {
  const [section, username, repo, endpoint, resource, branch] = url.pathname.split('/').slice(1)
  const slugs = solvedByUser[username]
  if (url.hostname !== 'api.github.com' || section !== 'repos' || repo !== 'neetcode-submissions' || !slugs) {
    return new Response(null, { status: 404 })
  }

  if (!endpoint) return Response.json({ default_branch: 'main' })
  if (endpoint === 'git' && resource === 'trees' && branch === 'main' && url.searchParams.get('recursive') === '1') {
    const files = slugs.map((slug) => ({ path: `${solutionDir}/${slug}/submission.py`, type: 'blob' }))
    return Response.json({
      tree: [...files, { path: 'Other Topic/binary-search/submission.py', type: 'blob' }],
      truncated: false,
    })
  }
  if (endpoint === 'commits' && url.searchParams.get('path') === solutionDir && url.searchParams.get('per_page') === '1') {
    return Response.json([{ commit: { committer: { date: fixtureCommitDate }, author: null } }])
  }
  return new Response(null, { status: 404 })
}
