const core = require('@actions/core');
const github = require('@actions/github');



async function run() {
  try {
    const { repository, pull_request } = github.context.payload;

    const repoInfo = {
      owner: repository.owner.login,
      repo: repository.name,
      ref: pull_request.head.ref
    };

    const baseRegexp = `(${projects})-\d+`;

    let success = true;
    
    [
      ...checkTitle(),
      ...checkBranch(),
      ...(await checkCommits()),
    ].forEach((msg) => {
      success = false;
      core.warning(msg);
    });
    
    if (!success) {
      core.setFailed('PR Linting Failed');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}


function i() {
  return core.getInput('ignore-case') ? 'i' : '';
}

function checkTitle() {
  if (!core.getInput('check-title')) return [];

  const re = new RegExp('\\[(' + core.getInput('projects') + ')-\\d+\\]', i());
  const title = github.context.payload.pull_request.title;
  
  if (!title.match(re)) {
    return [`PR title '${title}' does not contain an approved project`];
  } else {
    return [];
  }
}

function checkBranch() {
  if (!core.getInput('check-branch')) return [];

  const re = new RegExp('(' + core.getInput('projects') + ')-\\d+', i());
  const branchName = github.context.payload.pull_request.head.ref;
  
  if (!branchName.match(re)) {
    return [`Branch name ${branchName} does not contain an approved project`];
  } else {
    return [];
  }
}

async function checkCommits() {
  if (!core.getInput('check-commits')) return [];

  const re = new RegExp('\\[(' + core.getInput('projects') + ')-\\d+\\]', i());
  
  const {data} = await github.pulls.listCommits({
          owner: github.context.payload.repository.owner.login,
          repo: github.context.payload.repository.name,
          pull_number: github.context.payload.pull_request.number
        })
  
  return data
    .filter(commit => !commit.commit.message.match(re))
    .map(commit => `Commit message '${commit.commit.message}' does not contain an approved project`);
}

