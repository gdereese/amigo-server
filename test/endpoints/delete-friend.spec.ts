import { Next, Request, Response } from 'restify';
import * as restifyClients from 'restify-clients';

import { AmigoServer } from '../../src/amigo-server';
import { InMemoryDatastore } from '../../src/data/in-memory/in-memory-datastore';
import { Friend } from '../../src/models/friend';

describe('Endpoint: Delete Friend', () => {
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
      }
    ]);
  });

  afterAll(done => {
    client.close();
    server.stop(done);
  });

  it('returns 404 if friend is not found', done => {
    const id = 123;

    client.del(`/friend/${id}`, (err, req: Request, res: Response, obj) => {
      expect(res.statusCode).toBe(404);

      expect(err).toBeTruthy();

      done();
    });
  });

  it('returns 204 if successful', done => {
    const id = 1;

    client.del(`/friend/${id}`, (err, req: Request, res: Response, obj) => {
      expect(res.statusCode).toBe(204);

      done();
    });
  });
});
