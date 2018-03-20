import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { InMemoryDatastore } from '../../src/data/in-memory/in-memory-datastore';
import { FriendRequest } from '../../src/models/friend-request';

describe('Endpoint: Get Pending Friend Requests', () => {
  const datastore = new InMemoryDatastore();

  const server: AmigoServer = new AmigoServer();
  let client = null;

  beforeAll(done => {
    server.start(0, '127.0.0.1', () => {
      client = restifyClients.createJsonClient({
        url: `http://${server.server.address().address}:${
          server.server.address().port
        }`
      });

      done();
    });
  });

  beforeEach(() => {
    datastore.friendRequests.initialize([
      {
        accepted: null,
        id: 1,
        recipientUserId: '1',
        senderUserId: '2'
      },
      {
        accepted: null,
        id: 2,
        recipientUserId: '2',
        senderUserId: '1'
      }
    ]);
  });

  afterAll(done => {
    client.close();
    server.stop(done);
  });

  it('returns 400 if invalid by value', done => {
    client.get(
      {
        path: '/request',
        query: {
          by: 'xxx'
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 400 if by is specified but not userId', done => {
    client.get(
      {
        path: '/request',
        query: {
          by: 'sender'
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 200 with friend requests by sender', done => {
    const senderUserId = '1';

    client.get(
      {
        path: '/request',
        query: {
          by: 'sender',
          userId: senderUserId
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(obj).toBeTruthy();

        for (const friendRequest of obj) {
          expect(friendRequest.senderUserId).toBe(senderUserId);
        }

        done();
      }
    );
  });

  it('returns 200 with friend requests by recipient', done => {
    const recipientUserId = '1';

    client.get(
      {
        path: '/request',
        query: {
          by: 'recipient',
          userId: recipientUserId
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(obj).toBeTruthy();

        for (const friendRequest of obj) {
          expect(friendRequest.recipientUserId).toBe(recipientUserId);
        }

        done();
      }
    );
  });

  it('returns 200 with friend requests by user sender or recipient', done => {
    const userId = '1';

    client.get(
      {
        path: '/request',
        query: {
          userId
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(obj).toBeTruthy();

        for (const friendRequest of obj) {
          const isUserIdMatch =
            friendRequest.senderUserId === userId ||
            friendRequest.recipientUserId === userId;
          expect(isUserIdMatch).toBeTruthy();
        }

        done();
      }
    );
  });
});
