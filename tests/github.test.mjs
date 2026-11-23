import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fetchParticipantGithubData } from '../src/services/github.ts'
import { fixtureCommitDate, githubFixtureResponse } from './github-response.mjs'

test('reads the tree and latest commit for a participant from sample responses', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async (input) => githubFixtureResponse(new URL(input)))
  const result = await fetchParticipantGithubData({
    name: 'Layla',
    githubUsername: 'laylaxh',
    repo: 'neetcode-submissions',
    solutionDir: 'Data Structures & Algorithms',
  })

  assert.deepEqual(result.folderNames, ['duplicate-integer', 'two-integer-sum'])
  assert.equal(result.lastSolutionCommitDate.getTime(), Date.parse(fixtureCommitDate))
  assert.equal(fetch.mock.callCount(), 3)
})
