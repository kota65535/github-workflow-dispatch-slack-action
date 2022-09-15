const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');
const send = require('./slack');
const createMessage = require('./slack_message');

let octokit

const initOctokit = (token) => {
  octokit = getOctokit(token);
}

const getDefaultBranch = async (owner, repo) => {
  const res = await octokit.rest.repos.get({
    owner,
    repo
  });
  return res.data.default_branch;
};

const getWorkflowName = async (owner, repo, workflowId) => {
  const res = await octokit.rest.actions.getWorkflow({
    owner,
    repo,
    workflow_id: workflowId
  });
  return res.data.name;
};


const main = async () => {
  const repository = core.getInput('repository').trim();
  const workflow = core.getInput('workflow').trim();
  const inputs = core.getInput('inputs').trim();
  let ref = core.getInput('ref').trim();
  const channel = core.getInput('channel').trim();
  const mention = core.getInput('mention').trim();
  let githubToken = core.getInput('github-token').trim();
  let slackBotToken = core.getInput('slack-bot-token').trim();

  // if repository not given, use this repository
  let owner, repo;
  if (repository === '') {
    owner = context.repo.owner;
    repo = context.repo.repo;
  } else {
    [owner, repo] = repository.split('/');
  }

  // github token can be also given via env
  githubToken = githubToken || process.env.GITHUB_TOKEN;
  if (githubToken === '') {
    throw new Error('Need to provide one of github-token or GITHUB_TOKEN environment variable');
  }

  // slack bot token can be also given via env
  slackBotToken = slackBotToken || process.env.SLACK_BOT_TOKEN;
  if (slackBotToken === '') {
    throw new Error('Need to provide one of slack-bot-token or SLACK_BOT_TOKEN environment variable');
  }

  initOctokit(githubToken)

  // if ref not given, use the default branch
  if (ref === '') {
    ref = await getDefaultBranch(owner, repo);
  }

  const workflowName = await getWorkflowName(owner, repo, workflow);

  const message = createMessage(owner, repo, workflow, workflowName, ref, inputs, mention);

  await send(channel, slackBotToken, message);
};

module.exports = main;
