import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { FriendRequest } from '../../src/models/friend-request';
import { MemoryStore } from '../../src/modules/memory-store';

describe('Endpoint: Accept Friend Request', () => {
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
    MemoryStore.friends = [];
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

    client.post(
      `/request/${id}/accept`,
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(404);

        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 409 if friend request is already accepted', done => {
    const id = 1;
    MemoryStore.friendRequests[0].accepted = new Date();

    client.post(
      `/request/${id}/accept`,
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(409);

        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 200 with created friends if successful', done => {
    const id = 1;
    const friendRequest = MemoryStore.friendRequests[0];

    client.post(
      `/request/${id}/accept`,
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(200);

        expect(obj).toBeTruthy();

        expect(obj.senderFriend).toBeTruthy();
        expect(obj.senderFriend.created).toBeTruthy();
        expect(obj.senderFriend.friendUserId).toBe(
          friendRequest.recipientUserId
        );
        expect(obj.senderFriend.id).toBeTruthy();
        expect(obj.senderFriend.userId).toBe(friendRequest.senderUserId);

        expect(obj.recipientFriend).toBeTruthy();
        expect(obj.recipientFriend.created).toBeTruthy();
        expect(obj.recipientFriend.friendUserId).toBe(
          friendRequest.senderUserId
        );
        expect(obj.recipientFriend.id).toBeTruthy();
        expect(obj.recipientFriend.userId).toBe(friendRequest.recipientUserId);

        done();
      }
    );
  });
});
