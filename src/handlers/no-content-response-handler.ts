import { Next, Request, RequestHandler, Response } from 'restify';

export function noContentResponseHandler(): RequestHandler {
  return (req: Request, res: Response, next: Next) => {
    res.send(204);

    next();
  };
}
