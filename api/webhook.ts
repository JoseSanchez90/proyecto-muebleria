// /api/webhook.ts
import type { IncomingMessage, ServerResponse } from 'http';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: IncomingMessage & { method?: string; body?: any; url?: string }, res: ServerResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    console.log('Webhook received:', body);

    try {
      const accessToken = process.env.MP_ACCESS_TOKEN_TEST;
      if (!accessToken) {
        res.statusCode = 500;
        res.end('Access token missing');
        return;
      }

      res.statusCode = 200;
      res.end('ok');
    } catch (err) {
      console.error('Webhook error:', err);
      res.statusCode = 500;
      res.end('Internal error');
    }
  });
}
