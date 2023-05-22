# Raindrop-Slack Daily Notification

A simple script to send a notification to Slack containing a list of articles read that day on Raindrop.io

## Usage

1. Copy .env.sample to .env:

```
$ cp .env.sample .env
```

2. Set `RAINDROP_ACCESS_KEY` and `SLACK_WEBHOOK_URL` in the .env file:

Provide the access key for your Raindrop.io account and the webhook URL for the Slack integration.

For example, your .env file should look like this:

```
RAINDROP_ACCESS_KEY=abcd1234
SLACK_WEBHOOK_URL=https://hooks.slack.com/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

3. Deploy to AWS Lambda:

Please set up your AWS credential in advance. Then, run the following commands to install the dependencies and deploy the project:

```
$ yarn install
$ yarn run sls deploy
```

Now, the script will send daily notifications to your designated Slack channel with the articles you read on Raindrop.io that day.

If you want to change the schedule, you can modify the `rate` option in the `serverless.yml` file.

```
functions:
  main:
    handler: handler.main
    events:
      - schedule: rate(1 day)
```

For example, to send the notification every 6 hours, you can change the rate to `rate(6 hours)`.

### Troubleshooting

If you encounter any issues during the deployment or usage of the script, consider the following steps to help identify and fix the problem:

1. Ensure that your AWS credentials are correctly set up and have the necessary permissions to create a new Lambda function.
2. Check that your Raindrop.io API access key and Slack webhook URL are correct and properly formatted in your `.env` file.
3. Verify that your Slack webhook is correctly configured: it should be set up as an "Incoming Webhook" app in your workspace.

If the problem persists, feel free to open a GitHub issue with a description of the issue you are facing, and any error messages or logs that you may have. Make sure to remove any sensitive information, such as API keys or webhook URLs, before sharing any logs.

## License

This project is released under the MIT License. For more information, please refer to the [LICENSE](./LICENSE) file.
