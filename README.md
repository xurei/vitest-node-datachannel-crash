Simple example related to issue https://github.com/murat-dogan/node-datachannel/issues/222

### How to reproduce the issue
```
npm install
npm test
```
You should see `Aborted (core dumped)` at the end of the execution of the test.

### UPDATE
With version `0.5.4`, adding this does not trigger a core dump
```js
  afterAll(() => {
    nodeDataChannel.cleanup();
  });
```
See branch `v0.5.4-fix`

With version `0.5.5`, the bug seems to be fixed without the need of the `cleanup` function.
See branch `v0.5.5-fix`

