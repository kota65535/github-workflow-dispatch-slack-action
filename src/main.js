const core = require("@actions/core");
const { getOctokit } = require("@actions/github");
const send = require("./slack");
const createMessage = require("./slack_message");

let octokit;

const initOctokit = (token) => {
  octokit = getOctokit(token);
};

const getDefaultBranch = async (owner, repo) => {
  const res = await octokit.rest.repos.get({
    owner,
    repo,
  });
  return res.data.default_branch;
};

const getWorkflowName = async (owner, repo, workflowId) => {
  const res = await octokit.rest.actions.getWorkflow({
    owner,
    repo,
    workflow_id: workflowId,
  });
  return res.data.name;
};

const main = async () => {
  const repository = core.getInput("repository");
  const workflow = core.getInput("workflow", { required: true });
  const inputs = core.getInput("inputs");
  let ref = core.getInput("ref");
  let githubToken = core.getInput("github-token");
  const defaultGithubToken = core.getInput("default-token");
  const channel = core.getInput("channel");
  let slackBotToken = core.getInput("slack-bot-token");
  let slackWebhookUrl = core.getInput("slack-webhook-url");
  const mention = core.getInput("mention");

  const [owner, repo] = repository.split("/");

  githubToken = githubToken || process.env.GITHUB_TOKEN || defaultGithubToken;
  if (!githubToken) {
    throw new Error("No GitHub token provided");
  }

  slackBotToken = slackBotToken || process.env.SLACK_BOT_TOKEN;
  slackWebhookUrl = slackWebhookUrl || process.env.SLACK_WEBHOOK_URL;
  if (!(slackBotToken && channel) && !slackWebhookUrl) {
    throw new Error("Need to specify the Slack bot token and the channel name, or the webhook URL.");
  }

  initOctokit(githubToken);

  // if ref not given, use the default branch
  if (ref === "") {
    ref = await getDefaultBranch(owner, repo);
  }

  const workflowName = await getWorkflowName(owner, repo, workflow);

  const message = createMessage(owner, repo, workflow, workflowName, ref, inputs, mention);

  await send(channel, slackBotToken, message);
};

module.exports = main;
