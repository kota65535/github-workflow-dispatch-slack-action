const axios = require("axios");

const SLACK_API_URL = "https://slack.com/api/chat.postMessage";

const sendByBotToken = async (token, channel, message) => {
  message.channel = channel;
  let res;
  try {
    res = await axios.post(SLACK_API_URL, message, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    if (e.response) {
      throw new Error(`failed to send to Slack: status=${e.response.status}, data=${JSON.stringify(e.response.data)}`);
    } else {
      throw new Error(`failed to send to Slack: no response.`);
    }
  }
  if (!(res.status === 200 && res.data && res.data.ok)) {
    throw new Error(`failed to send to Slack: status=${res.status}, data=${JSON.stringify(res.data)}`);
  }
  return res.data;
};

const sendByWebhookUrl = async (url, message) => {
  let res;
  try {
    res = await axios.post(url, message);
  } catch (e) {
    if (e.response) {
      throw new Error(`failed to send to Slack: status=${e.response.status}, data=${JSON.stringify(e.response.data)}`);
    } else {
      throw new Error(`failed to send to Slack: no response`);
    }
  }
  if (!(res.status === 200 && res.data === "ok")) {
    throw new Error(`failed to send to Slack: status=${res.status}, data=${JSON.stringify(res.data)}`);
  }
  return res.data;
};

module.exports = {
  sendByBotToken,
  sendByWebhookUrl,
};
