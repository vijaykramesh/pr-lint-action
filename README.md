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
```

## Testing

Run `jest test` to test:

```
PASS  ./index.test.js
  pr-lint-action
    ✓ fails if check_title is true and title does not match (180ms)
    ✓ passes if check_title is false and title does not match (66ms)
    ✓ passes if check_title is true and title matches (67ms)
    ✓ fails if check_branch is true and branch does not match (66ms)
    ✓ passes if check_branch is false and branch does not match (61ms)
    ✓ passes if check_branch is true and branch matches (64ms)
    ✓ passes if check_commits is true and all commits match (66ms)
    ✓ fails if check_commits is true and some commits do not match (59ms)
    ✓ passes if check_commits is false and all commits match (61ms)
    ✓ passes if check_commits is false and some commits do not match (62ms)
    ✓ fails if check_branch and check_title is true and title does not match (59ms)
    ✓ fails if check_branch and check_title is true and title does not match (63ms)
    ✓ passes if check_branch and check_title is true and both match (61ms)
    ✓ passes if ignore_case and lower case title/branch (58ms)
    ✓ passes if ignore_case and lower case commits (65ms)
    ✓ fails if not ignore_case and lower case title/branch (66ms)
```

## Contributing

If you have other things worth automatically checking for in your PRs, please submit a pull request.