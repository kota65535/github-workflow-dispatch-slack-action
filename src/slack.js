const core = require("@actions/core");
const axios = require("axios");

const SLACK_API_URL = "https://slack.com/api/chat.postMessage";

const send = async (channel, token, message) => {
  message.channel = channel;

  core.debug(message);

  const res = await axios.post(SLACK_API_URL, message, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!(res.status === 200 && res.data && res.data.ok)) {
    throw new Error(`failed to send to Slack: status=${res.status}, data=${JSON.stringify(res.data)}`);
  }
  return res.data;
};

module.exports = send;
