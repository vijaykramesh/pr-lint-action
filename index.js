const { Toolkit } = require('actions-toolkit')
const getConfig = require('./utils/config')

const CONFIG_FILENAME = 'pr-lint.yml'

const defaults = {
  projects: ['PROJ'],
  check_title: true,
  check_branch: false,
  check_commits: false,
  ignore_case: false
}

Toolkit.run(
  async tools => {
    const { repository, pull_request } = tools.context.payload

    const repoInfo = {
      owner: repository.owner.login,
      repo: repository.name,
      ref: pull_request.head.ref
    }

    const config = {
      ...defaults,
      ...(await getConfig(tools.github, CONFIG_FILENAME, repoInfo))
    }

    const title = config.ignore_case ?
      pull_request.title.toLowerCase() :
      pull_request.title

    const head_branch = config.ignore_case ?
      pull_request.head.ref.toLowerCase() :
      pull_request.head.ref

    const projects = config.projects.map(project => config.ignore_case ? project.toLowerCase() : project)
    const title_passed = (() => {
      if (config.check_title) {
        // check the title matches [PROJECT-1234] somewhere
        if (!projects.some(project => title.match(createWrappedProjectRegex(project)))) {
          tools.log('PR title ' + title + ' does not contain approved project with format [PROJECT-1234]')
          return false
        }
        if (title.match(createMappedBranchRegex(head_branch))) {
          tools.log('PR title ' + title + ' is ambiguous, please set a more descriptive title')
          return false
        }
      }
      return true
    })()

    const branch_passed = (() => {
      if (config.check_branch) {
        if (head_branch.match(/dependabot\/.+/)) {
          return true
        }
        // check the branch matches PROJECT-1234 or PROJECT_1234 somewhere
        if (!projects.some(project => head_branch.match(createProjectRegex(project)))) {
          tools.log('PR branch ' + head_branch + ' does not contain an approved project with format PROJECT-1234 or PROJECT_1234')
          return false
        }
      }
      return true
    })()

    const commits_passed = await (async () => {
      // check the branch matches PROJECT-1234 or PROJECT_1234 somewhere
      if (config.check_commits) {
        const listCommitsParams = {
          owner: repository.owner.login,
          repo: repository.name,
          pull_number: pull_request.number
        }
        const commitsInPR = (await tools.github.pulls.listCommits(listCommitsParams)).data
        const failedCommits = findFailedCommits(projects, commitsInPR, config.ignore_case);

        if(failedCommits.length) {
          failedCommits.forEach(
            failedCommit => tools.log('Commit message \'' + failedCommit + '\' does not contain an approved project')
          )
          return false
        }
      }
      return true
    })()

    const statuses = [title_passed, branch_passed, commits_passed]

    if (statuses.some(status => status === false )){
      tools.exit.failure("PR Linting Failed")
    } else {
      tools.exit.success()
    }
  },
  { event: ['pull_request.opened', 'pull_request.edited', 'pull_request.synchronize'], secrets: ['GITHUB_TOKEN'] }
)

function findFailedCommits(projects, commitsInPR, ignoreCase) {
  const failedCommits = [];
  projects.forEach(project => {
    commitsInPR.forEach(commit => {
      const commitMessage = ignoreCase ? commit.commit.message.toLowerCase() : commit.commit.message
      if (!commitMessage.match(createProjectRegex(project))) {
        failedCommits.push(commitMessage);
      }
    });
  });
  return failedCommits;
}

function createProjectRegex(project) {
  return new RegExp(project + '[-_]\\d*')
}

function createWrappedProjectRegex(project) {
  return new RegExp('\\[' + project + '-\\d*\\]')
}

function createMappedBranchRegex(head_branch) {
  return new RegExp(head_branch.replace(/[^a-zA-Z0-9]/gi, ' '))
}
