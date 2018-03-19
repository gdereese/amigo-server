import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { FriendRequest } from '../../src/models/friend-request';
import { MemoryStore } from '../../src/modules/memory-store';

describe('Endpoint: Get Friend Request', () => {
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
    MemoryStore.friendRequests = [
      {
        accepted: null,
        id: 1,
        recipientUserId: '1',
        senderUserId: '2'
      }
    ];
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
