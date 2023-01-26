const BASE_URL = "https://github.com";

const createMessage = (owner, repo, workflow, workflowName, ref, inputs, mention) => {
  const headText = "Following workflow will be executed.";
  const inputsJson = inputs ? JSON.parse(inputs) : undefined;
  const message = {
    text: headText,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${mention ? `${mention} ` : ""}:rocket: ${headText}`,
        },
      },
    ],
    attachments: [
      {
        color: "#3AA3E3",
        blocks: [
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Repository*\n<${BASE_URL}/${owner}/${repo}|${owner}/${repo}>`,
              },
              {
                type: "mrkdwn",
                text: `*Workflow Name*\n<${BASE_URL}/${owner}/${repo}/actions/workflows/${workflow}|${workflowName}>`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Ref*\n<${BASE_URL}/${owner}/${repo}/tree/${ref}|${ref}>`,
              },
            ],
          },
        ],
      },
    ],
  };

  if (inputs) {
    const prettyInput = JSON.stringify(inputsJson, null, 2);
    message.attachments[0].blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Workflow Inputs*\n\`\`\`${prettyInput}\`\`\``,
      },
    });
  }

  message.attachments[0].blocks.push(
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Do you want to approve?",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "OK",
          },
          style: "primary",
          value: JSON.stringify({
            choice: true,
            request: {
              owner,
              repo,
              workflow_id: workflow,
              ref,
              inputs: inputsJson,
            },
          }),
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Cancel",
          },
          style: "danger",
          value: JSON.stringify({
            choice: false,
          }),
        },
      ],
    }
  );

  return message;
};

module.exports = createMessage;
