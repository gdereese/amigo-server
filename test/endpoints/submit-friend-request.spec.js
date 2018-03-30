const fortune = require('fortune');
const _ = require('lodash');
const restify = require('restify');
const restifyClients = require('restify-clients');

const amigoServer = require('../../src/amigo-server');
const record = require('../../src/data/record-types');

describe('Endpoint: Submit Friend Request', () => {
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
      .then(done);
  });

  afterAll(done => {
    client.close();
    server.close(done);
  });

  it('returns 400 if sender and recipient are the same user', done => {
    const submitRequest = {
      recipientUserId: '1',
      senderUserId: '1'
    };

    client.post('/request', submitRequest, (err, req, res) => {
      expect(res.statusCode).toBe(400);

      expect(err).toBeTruthy();

      done();
    });
  });

  it('returns 409 if an existing friend request is pending', done => {
    store
      .create(record.typeNames.friendRequest, {
        accepted: null,
        id: 1,
        recipientUserId: '2',
        senderUserId: '1'
      })
      .then(() => {
        const submitRequest = {
          recipientUserId: '2',
          senderUserId: '1'
        };

        client.post('/request', submitRequest, (err, req, res) => {
          expect(res.statusCode).toBe(409);

          expect(err).toBeTruthy();

          done();
        });
      });
  });

  it('returns 409 if an existing friend request is accepted', done => {
    store
      .create(record.typeNames.friendRequest, {
        accepted: new Date(),
        id: 1,
        recipientUserId: '2',
        senderUserId: '1'
      })
      .then(() => {
        const submitRequest = {
          recipientUserId: '2',
          senderUserId: '1'
        };

        client.post('/request', submitRequest, (err, req, res) => {
          expect(res.statusCode).toBe(409);

          expect(err).toBeTruthy();

          done();
        });
      });
  });

  it('returns 201 with friend request and location header when successful', done => {
    const submitRequest = {
      recipientUserId: '2',
      senderUserId: '1'
    };

    client.post('/request', submitRequest, (err, req, res, obj) => {
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
