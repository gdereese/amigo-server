const fortune = require('fortune');
const _ = require('lodash');
const restify = require('restify');
const restifyClients = require('restify-clients');

const amigoServer = require('../../src/amigo-server');
const record = require('../../src/data/record-types');

describe('Endpoint: Get Pending Friend Requests', () => {
  let server = null;
  let client = null;
  let store = null;

  beforeAll(done => {
    store = fortune(record.types);

    server = restify.createServer();
    amigoServer(server, { store });

    server.listen(0, '127.0.0.1', () => {
      client = restifyClients.createJsonClient({
        url: `http://${server.address().address}:${server.address().port}`
      });

      done();
    });
  });

  beforeEach(done => {
    store
      .find(record.typeNames.friendRequest)
      .then(result => {
        const ids = _.map(result.payload.records, 'id');
        return ids;
      })
      .then(ids => {
        if (ids.length > 0) {
          return store.delete(record.typeNames.friendRequest, ids);
        }

        return null;
      })
      .then(() => {
        return store.create(record.typeNames.friendRequest, [
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
      })
      .then(done);
  });

  afterAll(done => {
    client.close();
    server.close(done);
  });

  it('returns 400 if invalid by value', done => {
    client.get(
      {
        path: '/request',
        query: {
          by: 'xxx'
        }
      },
      err => {
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
      err => {
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
      (err, req, res, obj) => {
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
      (err, req, res, obj) => {
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
      (err, req, res, obj) => {
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
