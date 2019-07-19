const { Toolkit } = require('actions-toolkit')
const getConfig = require('./utils/config')

const CONFIG_FILENAME = 'pr-lint.yml'

const defaults = {
  projects: ['PROJ'],
  check_title: true,
  check_branch: false,
  ignore_case: false
}

Toolkit.run(
  async tools => {
    const repoInfo = {
      owner: tools.context.payload.repository.owner.login,
      repo: tools.context.payload.repository.name
    }
    const config = {
      ...defaults,
      ...(await getConfig(tools.github, CONFIG_FILENAME, repoInfo))
    }

    const title = config.ignore_case ?
      tools.context.payload.pull_request.title.toLowerCase() :
      tools.context.payload.pull_request.title

    const head_branch = config.ignore_case ?
      tools.context.payload.pull_request.head_ref_name.toLowerCase() :
      tools.context.payload.pull_request.head_ref_name

    const projects = config.projects.map(project => config.ignore_case ? project.toLowerCase() : project)
    const title_passed = (() => {
      if (config.check_title) {
        // check the title matches [PROJECT-1234] somewhere
        if (!projects.some(project => title.match(new RegExp('\\[' + project + '-\\d*\\]')))) {
          tools.log('PR title does not contain approved project')
          return false
        }
      }
      return true
    })()

    const branch_passed = (() => {
      // check the branch matches PROJECT-1234 or PROJECT_1234 somewhere
      if (config.check_branch) {
        if (!projects.some(project => head_branch.match(new RegExp(project + '[-_]\\d*')))) {
          tools.log('PR branch does not contain an approved project')
          return false
        }
      }
      return true
    })()

    const statuses = [title_passed, branch_passed]

    if (statuses.some(status => status === false )){
      tools.exit.failure("PR Linting Failed")
    } else {
      tools.exit.success()
    }
  },
  { event: ['pull_request.opened', 'pull_request.edited', 'pull_request.synchronize'], secrets: ['GITHUB_TOKEN'] }
)
