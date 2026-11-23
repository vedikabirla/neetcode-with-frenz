import { githubFixtureResponse } from './github-response.mjs'

const browserFetch = globalThis.fetch.bind(globalThis)

globalThis.fetch = async (input, options) => {
  const url = new URL(input instanceof Request ? input.url : input, location.href)
  return url.hostname === 'api.github.com' ? githubFixtureResponse(url) : browserFetch(input, options)
}
