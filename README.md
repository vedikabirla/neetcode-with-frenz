# NeetCode with Frenz

Practice on [NeetCode.io](https://neetcode.io/practice?tab=neetcode150) and save accepted solutions in your own public GitHub repo. The [shared dashboard](https://vedikabirla.github.io/neetcode-with-frenz/) reads that repo and shows your NeetCode 150 progress.

## Join the dashboard

1. Use one public GitHub repo for your solutions. If NeetCode's GitHub Sync has already created one for you, use that repo. If you prefer to push files yourself, create a public repo such as `neetcode-submissions`.
2. Add your repo to [the participant list](src/data/participants.ts) and open a pull request against this dashboard repo. Once the change is merged and deployed, your progress will appear on the live dashboard.

   ```ts
   { name: 'Your name', githubUsername: 'your-username', repo: 'your-repo' }
   ```

   For NeetCode GitHub Sync, use `solutionDir: 'Data Structures & Algorithms'`. For manual uploads, set `solutionDir` to the folder containing your problem folders, or omit it if those folders are at the repo root.

## Track a solve

Save the accepted solution to your solutions repo, then click **Refresh** on the dashboard. No pull request is needed for individual solves.

- **With GitHub Sync**, turn on **Auto-commit** and choose **Accepted only** for automatic tracking. The dashboard counts any matching problem folder containing a file as solved, so syncing failed attempts can publish them and count them as solves. [GitHub Sync settings](https://neetcode.io/profile/github)
- **If you push files yourself**, use one folder per problem, named for the slug in the NeetCode URL. For Two Sum, save a file such as `two-integer-sum/solution.py` under your solutions directory. Any filename or extension works. The dashboard accepts case, hyphen, and underscore variations of the slug.

## Improve the dashboard

Make and test your changes in a local clone. If you have write access, push your branch to the shared repo. Otherwise, push it to your fork. Either way, open the pull request against the shared repo. Ask the repo owner for write access if you want to maintain it with the group.

Requires Node 20+ (this project is developed on Node 24 LTS via `nvm`).

```bash
npm install
npm run dev      # starts the dev server
npm run build    # typecheck + production build
```

Run `npm test` on Node 24 to test with sample GitHub responses. For browser checks, start `npm run dev -- --mode fixtures` and use the URL it prints. In this mode, the tracker shows sample data and **Refresh** uses the same fixtures without calling GitHub.
