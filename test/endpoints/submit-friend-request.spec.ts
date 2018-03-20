import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { InMemoryDatastore } from '../../src/data/in-memory/in-memory-datastore';
import { FriendRequest } from '../../src/models/friend-request';
import { SubmitFriendRequest } from '../../src/models/submit-friend-request';

describe('Endpoint: Submit Friend Request', () => {
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
    datastore.friendRequests.initialize();
  });

  afterAll(done => {
    client.close();
    server.stop(done);
  });

  it('returns 400 if sender and recipient are the same user', done => {
    const submitRequest: SubmitFriendRequest = {
      recipientUserId: '1',
      senderUserId: '1'
    };

    client.post(
      '/request',
      submitRequest,
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(400);

        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 409 if an existing friend request is pending', done => {
    datastore.friendRequests.create({
      accepted: null,
      id: 1,
      recipientUserId: '2',
      senderUserId: '1'
    });

    const submitRequest: SubmitFriendRequest = {
      recipientUserId: '2',
      senderUserId: '1'
    };

    client.post(
      '/request',
      submitRequest,
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(409);

        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 409 if an existing friend request is accepted', done => {
    datastore.friendRequests.create({
      accepted: new Date(),
      id: 1,
      recipientUserId: '2',
      senderUserId: '1'
    });

    const submitRequest: SubmitFriendRequest = {
      recipientUserId: '2',
      senderUserId: '1'
    };

    client.post(
      '/request',
      submitRequest,
      (err, req: Request, res: Response, obj) => {
        expect(res.statusCode).toBe(409);

        expect(err).toBeTruthy();

        done();
      }
    );
  });

  it('returns 201 with friend request and location header when successful', done => {
    const submitRequest: SubmitFriendRequest = {
      recipientUserId: '2',
      senderUserId: '1'
    };

    client.post('/request', submitRequest, (err, req: Request, res, obj) => {
      expect(res.statusCode).toBe(201);

      expect(obj).toBeTruthy();

      expect(obj.accepted).toBeFalsy();
      expect(obj.id).toBeTruthy();
      expect(obj.recipientUserId).toBe(submitRequest.recipientUserId);
      expect(obj.senderUserId).toBe(submitRequest.senderUserId);

      expect(res.headers.location).toBeTruthy();

      done();
    });
  });
});
