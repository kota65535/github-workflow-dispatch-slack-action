# github-workflow-dispatch-slack-action

GitHub Action for triggering GitHub [workflow_dispatch](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#workflow_dispatch) 
event by Slack.

## Inputs

| Name                | Description                                           | Required | Default                                                                            |
|---------------------|-------------------------------------------------------|----------|------------------------------------------------------------------------------------|
| `repository`        | Owner and repository name                             | No       | `${{ github.repository }}`                                                         |
| `workflow`          | Workflow ID or file name                              | Yes      | N/A                                                                                |
| `ref`               | Git reference for the workflow                        | No       | On PR: `${{ github.event.pull_request.head.ref }}`<br/>Others: `${{ github.ref }}` |
| `inputs`            | Input keys and values configured in the workflow file | No       | N/A                                                                                |
| `github-token`      | GitHub token                                          | No       | `${{ env.GITHUB_TOKEN }}` or<br/> `${{ github.token }}`                            | 
| `channel`           | Slack channel name                                    | No (*1)  | N/A                                                                                | 
| `slack-bot-token`   | Slack bot token                                       | No (*1)  | `${{ env.SLACK_BOT_TOKEN }}`                                                       | 
| `slack-webhook-url` | Slack webhook URL                                     | No (*1)  | `${{ env.SLACK_WEBHOOK_URL }}`                                                     | 
| `mention`           | Slack user ID to mention                              | No       | N/A                                                                                | 

1. Need to specify `channel` and `slack-bot-token` both or `slack-webhook-url`.

## Usage

```yaml

  dispatch:
    runs-on: ubuntu-latest
    needs:
      - plan
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Dispatch workflow
        uses: kota65535/github-workflow-dispatch-slack-action@v1
        with:
          workflow: do-something.yml
          inputs: '{"foo":"1","bar":"2"}'
          channel: my-ci
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
```
