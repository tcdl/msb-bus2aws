# msb-bus2aws
Generic adapter to send messages from the [microservicebus](https://github.com/tcdl/msb) to AWS services.

## Installation

To use globally from the command line:

```
$ npm install msb-aws -g
```

## Running

```
$ msb2aws examples/lambda.json
```

Arguments:

- *-d* or *--dump* Default: false – print the config
- **...** e.g. `examples/lamdba.json` A JSON/JS configuration file path.

## Configuration

### microservicebus

The msb framework can be configured by a combination of standard [environment variables](https://github.com/tcdl/msb#environment-variables) and the config file.

- **channelMonitorEnabled** Boolean Default: true – Enables or disables the microservicebus [channelMonitorAgent](https://github.com/tcdl/msb#channel-monitor-agent)
- **bus** Object – To be loaded with [msb.configure()](https://github.com/tcdl/msb#msbconfigureconfig)
- **routes.bus** Object – Configuration for responders/listeners

Example:

```js
{
  "channelMonitorEnabled": false,
  "bus": { ... }
  "routes": [
    {
      "bus": {
        "namespace": "some:topic"
      },
      "s3": { ... }
    }
  ]
}
```

### AWS

Common configuration such as access key and secret can be configured either or as combination of global [AWS SDK configuration](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html) or from the config file.

- **aws** Object – Defaults loaded per service, overrides global config
- **routes.aws** Object - Overrides defaults per service

```js
{
  "aws": { ... }
  "routes": [
    {
      "aws": { ... }
    }
  ]
}
```

### Lambda

See [examples/lambda.json](examples/lambda.json).

### S3

See [examples/s3.json](examples/s3.json).
