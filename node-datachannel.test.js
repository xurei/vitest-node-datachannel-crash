import {describe, expect, test, afterEach, afterAll} from 'vitest';
import Peer from 'simple-peer';
import nodeDatachannelPolyfill from 'node-datachannel/polyfill';
import nodeDataChannel from 'node-datachannel';

describe('vitest-node-datachannel-crash', () => {
  test('coredump', async () => {
    nodeDataChannel.initLogger('Verbose');

    var peer1 = new Peer({initiator: true, wrtc: nodeDatachannelPolyfill});
    var peer2 = new Peer({wrtc: nodeDatachannelPolyfill});

    peer1.on('signal', (data) => {
      // when peer1 has signaling data, give it to peer2 somehow
      peer2.signal(data);
    });

    peer2.on('signal', (data) => {
      // when peer2 has signaling data, give it to peer1 somehow
      peer1.signal(data);
    });

    peer1.on('connect', () => {
      // wait for 'connect' event before using the data channel
      peer1.send('hey peer2, how is it going?');
    });

    peer2.on('data', (data) => {
      // got a data channel message
      console.log('got a message from peer1: ' + data);
    });

    await new Promise(r => setTimeout(r, 3000));

    peer1.destroy();
    peer2.destroy();
    await new Promise(r => setTimeout(r, 1000));
  }, 30000);
  
  afterAll(() => {
    nodeDataChannel.cleanup();
  });
});
