# Pushing a zero-sized file to S3 makes node exit with code 0

This repository contains a POC for making node "soft crash" by exiting with
error code 0.

Tested on node `18.8.0` and `19.4.0`.

# Step by step

These are my settings, ymmv.

*Get AWS credentials*

I do this:

```shell
# First
aws sso login --profile default
# Then
yawsso --default-only
```

But I don't think this is important for the POC, any auth will probably do.

*Node / Yarn*
```shell
# Node
node --version
v19.4.0
# Yarn
yarn --version
1.22.19
```

*Install command*
```shell
yarn install
```

*Run command*
```shell
yarn run poc
```

# Test output

```shell
yarn run poc
yarn run v1.22.19
$ TS_NODE_PROJECT="tsconfig.json" ts-node build.ts
START
DONE
START
DONE
START
DONE
START
DONE
START
DONE
START
DONE
START
✨  Done in 1.43s.
```

The test should just keep going forever, but it eventually fails with exit code 0.
