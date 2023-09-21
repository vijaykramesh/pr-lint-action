# pr-lint-action

A GitHub Action that verifies your pull request contains a reference to a ticket.  You can use this to (optionally) check:

* The PR title contains `[PROJ-1234]`
* The branch name contains `PROJ-1234` or `PROJ_1234`
* Each commit contains `[PROJ-1234]`



## Usage

Add `.github/workflows/main.yml` with the following:

```
name: PR Lint
on: [pull_request]
jobs:
  pr_lint:
    runs-on: ubuntu-latest
    steps:
    - uses: vijaykramesh/pr-lint-action@v1.0
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

## Configuration

Configure by creating a `.github/pr-lint.yml` file:

For example:

```yml
projects: ['PROJ', 'ABC']
check_title: true
check_branch: true
check_commits: true
ignore_case: true
require_brackets: true
```

## Local Development

Run `yarn install` to install any dependencies needed.

## Testing

Run `yarn test` to test:

```
 PASS  ./index.test.js
  pr-lint-action
    ✓ fails if check_title is true and title does not match (15 ms)
    ✓ fails if bad title and branch (14 ms)
    ✓ passes if check_title is false and title does not match (6 ms)
    ✓ passes if check_title is true and title matches (5 ms)
    ✓ fails if check_branch is true and branch does not match (5 ms)
    ✓ passes if check_branch is false and branch does not match (5 ms)
    ✓ passes if check_branch is true and branch matches (5 ms)
    ✓ passes if check_commits is true and all commits match (7 ms)
    ✓ fails if check_commits is true and some commits do not match (9 ms)
    ✓ passes if check_commits is false and all commits match (4 ms)
    ✓ passes if check_commits is false and some commits do not match (5 ms)
    ✓ fails if check_branch and check_title is true and title does not match (7 ms)
    ✓ fails if check_branch and check_title is true and title does not match (8 ms)
    ✓ passes if check_branch and check_title is true and both match (10 ms)
    ✓ passes if ignore_case and lower case title/branch (6 ms)
    ✓ passes if ignore_case and lower case commits (7 ms)
    ✓ fails if not ignore_case and lower case title/branch (4 ms)
    ✓ passes if require_brakcets is false and title matches without brackets (5 ms)
    ✓ fails if require_brackets is true or default and title matches without brackets (4 ms)
```

## Lint

Run `yarn lint` to run ESLint.  Run `yarn lint --fix` to fix any issues that it can.

## Contributing

If you have other things worth automatically checking for in your PRs, please submit a pull request.
