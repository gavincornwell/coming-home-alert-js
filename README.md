# Welcome

The code in this repository represents a system to alert someone you are leaving a location to come home, for example to alert your wife you're leaving the office at the end of the day.

The alert is triggered by a simple REST API, this could be done manually or automated, for example using GPS features of [IFTTT](https://ifttt.com).

# Prerequisites

* AWS CLI
* NodeJS 6.10 or later
* SAM Local

# Build

Copy ```.npmrc.template``` to ```.npmrc``` and change the variables accordingly

```bash
npm install
npm run build
```

# Deploy

```bash
npm run deploy
```

# Test

Copy ```testEnv.sh.template``` to ```testEnv.sh``` and change the variables accordingly.

Execute ```testEnv.sh``` in the terminal you'll be running the tests.

## Unit

```bash
npm test
```

## Integration

```bash
sam local start-api
npm run integration-test
```

