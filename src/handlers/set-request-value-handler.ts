import { Next, Request, RequestHandler, Response } from 'restify';

export function SetRequestValueHandler(
  key: string,
  value?: any
): RequestHandler {
  return (req: any, res: Response, next: Next) => {
    req[key] = value;

    next();
  };
}
