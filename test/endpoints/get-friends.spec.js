const fortune = require('fortune');
const _ = require('lodash');
const restify = require('restify');
const restifyClients = require('restify-clients');

const amigoServer = require('../../src/amigo-server');
const record = require('../../src/data/record-types');

describe('Endpoint: Get Friends', () => {
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
      .find(record.typeNames.friend)
      .then(result => {
        const ids = _.map(result.payload.records, 'id');
        return ids;
      })
      .then(ids => {
        if (ids.length > 0) {
          return store.delete(record.typeNames.friend, ids);
        }

        return null;
      })
      .then(() => {
        return store.create(record.typeNames.friend, [
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
      })
      .then(done);
  });

  afterAll(done => {
    client.close();
    server.close(done);
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
      (err, req, res) => {
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
      (err, req, res, obj) => {
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
      (err, req, res, obj) => {
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
