import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { InMemoryDatastore } from '../../src/data/in-memory/in-memory-datastore';
import { Friend } from '../../src/models/friend';

describe('Endpoint: Get Friends', () => {
  const datastore = new InMemoryDatastore();

  const server: AmigoServer = new AmigoServer({
    datastoreModule: '../../src/data/in-memory/in-memory-datastore'
  });
  let client = null;

  beforeAll(done => {
    server.start((address, port) => {
      client = restifyClients.createJsonClient({
        url: `http://${address}:${port}`
      });

      done();
    });
  });

  beforeEach(() => {
    datastore.friends.initialize([
      {
        created: new Date(),
        friendUserId: '2',
        id: 1,
        userId: '1'
      },
      {
        created: new Date(),
        friendUserId: '1',
        id: 2,
        userId: '2'
      }
    ]);
  });

  afterAll(done => {
    client.close();
    server.stop(done);
  });

  it('returns 400 if userId and friendUserId are equal', done => {
    client.get(
      {
        path: '/friend',
        query: {
          friendUserId: '1',
          userId: '1'
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(400);

        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 200 with friends by userId', done => {
    const userId = '1';

    client.get(
      {
        path: '/friend',
        query: {
          userId
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(200);

        expect(obj).toBeTruthy();

        for (const friend of obj) {
          expect(friend.userId).toBe(userId);
        }

        done();
      }
    );
  });

  it('returns 200 with friends by friendUserId', done => {
    const friendUserId = '1';

    client.get(
      {
        path: '/friend',
        query: {
          friendUserId
        }
      },
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(200);

        expect(obj).toBeTruthy();

        for (const friend of obj) {
          expect(friend.friendUserId).toBe(friendUserId);
        }

        done();
      }
    );
  });
});
