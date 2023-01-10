# github-workflow-dispatch-slack-action

GitHub Action for triggering
GitHub [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch)
event by Slack.

This action is assumed to be used with a Slack app that handles its interaction payload and trigger the workflow.
This can be easily done by Terraform with [github-workflow-dispatch-slack](https://registry.terraform.io/modules/kota65535/github-workflow-dispatch-slack/aws/latest)
Terraform module.

## Inputs

| Name                | Description                                           | Required | Default                                                 |
|---------------------|-------------------------------------------------------|----------|---------------------------------------------------------|
| `repository`        | Owner and repository name                             | No       | `${{ github.repository }}`                              |
| `workflow`          | Workflow ID or file name                              | Yes      | N/A                                                     |
| `ref`               | Git reference for the workflow                        | No       | See (*1)                                                |
| `inputs`            | Input keys and values configured in the workflow file | No       | N/A                                                     |
| `github-token`      | GitHub token                                          | No       | `${{ env.GITHUB_TOKEN }}` or<br/> `${{ github.token }}` | 
| `channel`           | Slack channel name                                    | No (*2)  | N/A                                                     | 
| `slack-bot-token`   | Slack bot token                                       | No (*2)  | `${{ env.SLACK_BOT_TOKEN }}`                            | 
| `slack-webhook-url` | Slack webhook URL                                     | No (*2)  | `${{ env.SLACK_WEBHOOK_URL }}`                          | 
| `mention`           | Slack user ID to mention                              | No       | N/A                                                     | 

1. `ref` default value are determined by the `repository` input and the event type as follows:

| `repository` value             | Event type         | `ref` default value                         |
|--------------------------------|--------------------|---------------------------------------------|
| `${{ github.repository }}`     | `pull_request`     | `${{ github.event.pull_request.head.ref }}` |
| `${{ github.repository }}`     | Not `pull_request` | `${{ github.ref }}`                         |
| Not `${{ github.repository }}` | *                  | Default branch of the repository            |

2. Need to specify `channel` and `slack-bot-token` both or `slack-webhook-url`.

## Usage

1. Create a Slack app in your workspace. Then get its bot token or webhook URL.
2. Create related AWS resources by Terraform with [github-workflow-dispatch-slack](https://registry.terraform.io/modules/kota65535/github-workflow-dispatch-slack/aws/latest)
   Terraform module.
3. Enable interactivity of the Slack app. Use the API Gateway's invoke URL into as the Request URL.
4. Use this actions like this.

```yaml

  my-job:
    runs-on: ubuntu-latest
    needs:
      - plan
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Trigger the workflow by Slack bot
        uses: kota65535/github-workflow-dispatch-slack-action@v1
        with:
          workflow: do-something.yml
          inputs: '{"foo":"1","bar":"2"}'
          channel: my-ci
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
```
