import { Next, Request, RequestHandler, Response } from 'restify';

export function NoContentResponseHandler(): RequestHandler {
  return (req: Request, res: Response, next: Next) => {
    res.send(204);

    next();
  };
}
