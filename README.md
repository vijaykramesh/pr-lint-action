# pr-lint-action

A GitHub Action that verifies your pull request contains a reference to a ticket.  It will optionally check the PR title contains `[PROJ-1234]` and the branch contains `PROJ-1234` or `PROJ_1234`.  This helps ensure every PR gets mapped to a ticket in Jira.

## Usage

Add `.github/main.workflow` with the following:

```
workflow "Lint your PRs" {
  on = "pull_request"
  resolves = "PR Lint Action"
}

action "PR Lint Action" {
  uses = "vijaykramesh/pr-lint-action@master"
  secrets = ["GITHUB_TOKEN"]
}
```

## Configuration

Configure by creating a `.github/pr-lint.yml` file:

For example:

```yml
projects: ['PROJ', 'ABC']
check_title: true
check_branch: true
ignore_case: true
```

## Testing

Run `jest test` to test:

```
PASS  ./index.test.js
  pr-lint-action
    ✓ fails if check_title is true and title does not match (106ms)
    ✓ passes if check_title is false and title does not match (67ms)
    ✓ passes if check_title is true and title matches (61ms)
    ✓ fails if check_branch is true and branch does not match (57ms)
    ✓ passes if check_branch is false and branch does not match (59ms)
    ✓ passes if check_branch is true and branch matches (57ms)
    ✓ fails if check_branch and check_title is true and title does not match (59ms)
    ✓ fails if check_branch and check_title is true and title does not match (59ms)
    ✓ passes if check_branch and check_title is true and both match (58ms)
    ✓ passes if ignore_case and lower case title/branch (55ms)
    ✓ fails if not ignore_case and lower case title/branch (109ms)
```

## Contributing

If you have other things worth automatically checking for in your PRs, please submit a pull request.