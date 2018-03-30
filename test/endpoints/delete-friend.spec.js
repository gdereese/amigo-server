const fortune = require('fortune');
const _ = require('lodash');
const restify = require('restify');
const restifyClients = require('restify-clients');

const amigoServer = require('../../src/amigo-server');
const record = require('../../src/data/record-types');

describe('Endpoint: Delete Friend', () => {
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
          }
        ]);
      })
      .then(done);
  });

  afterAll(done => {
    client.close();
    server.close(done);
  });

  it('returns 404 if friend is not found', done => {
    const id = 123;

    client.del(`/friend/${id}`, (err, req, res) => {
      expect(res.statusCode).toBe(404);

      expect(err).toBeTruthy();

      done();
    });
  });

  it('returns 204 if successful', done => {
    const id = 1;

    client.del(`/friend/${id}`, (err, req, res) => {
      expect(res.statusCode).toBe(204);

      done();
    });
  });
});
