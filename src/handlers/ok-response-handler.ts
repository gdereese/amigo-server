import { Next, Request, RequestHandler, Response } from 'restify';

export function okResponseHandler(reqKeyToBody: string): RequestHandler {
  return (req: any, res: Response, next: Next) => {
    res.send(200, req[reqKeyToBody]);

    next();
  };
}
