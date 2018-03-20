import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { InMemoryDatastore } from '../../src/data/in-memory/in-memory-datastore';
import { FriendRequest } from '../../src/models/friend-request';

describe('Endpoint: Get Friend Request', () => {
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
    datastore.friendRequests.initialize([
      {
        accepted: null,
        id: 1,
        recipientUserId: '1',
        senderUserId: '2'
      }
    ]);
  });

  afterAll(done => {
    client.close();
    server.stop(done);
  });

  it('returns 404 if friend request is not found', done => {
    const id = 123;

    client.get(`/request/${id}`, (err, req: Request, res: Response, obj) => {
      expect(res.statusCode).toBe(404);

      expect(err).toBeTruthy();

      done();
    });
  });

  it('returns 200 with friend request if successful', done => {
    const id = 1;

    client.get(`/request/${id}`, (err, req: Request, res: Response, obj) => {
      expect(res.statusCode).toBe(200);

      expect(obj).toBeTruthy();

      expect(obj.id).toBe(id);

      done();
    });
  });
});
