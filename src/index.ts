import { Router } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from 'discord-interactions';
import fetch from "node-fetch"
import commands from './commands';
import { env } from 'process';

export interface Env {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  TOKEN: string;
  PUBLIC_KEY: string;
  PASSWORD: string
}

class JsonResponse extends Response {
  constructor(body: Object, init: ResponseInit = {}) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = Router();
router.post('/', async (request, env) => {
  const message = await request.json();

  if (message.type === InteractionType.PING) {
    // The `PING` message is used during the initial webhook handshake, and is
    // required to configure the webhook in the developer portal.
    console.log('Handling Ping request');
    return new JsonResponse({
      type: InteractionResponseType.PONG,
    });
  }

  if (message.type === InteractionType.APPLICATION_COMMAND) {
    console.log('Handling Application Command request');

    const command = commands.find((c) => c.data.name === message.data.name);

    if (!command) {
      return new JsonResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Unknown command',
        },
      });
    }

    console.log('Handling command: ', message.data.name);

    const data = await command.execute(message);

    const response = await fetch(`https://discord.com/api/v8/interactions/${message.id}/${message.token}/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bot ${env.TOKEN}`
      },
      body: JSON.stringify({
        data,
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
      })
    }).then(res => res.json())

    //I dont know the real reason why its not working
    //return new JsonResponse({
    //  type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //  data
    //});
  }
});

router.get("/invite", async (request, env) => {
  let url = `https://discord.com/api/oauth2/authorize?client_id=${env.CLIENT_ID}&permissions=2147485696&scope=bot%20applications.commands`
  
  return Response.redirect(url, 302)
})

router.get(`/register/*`, async (request: Request, env: Env) => {
  let url = new URL(request.url)
  let password = url.pathname.split("/")[2]
  if (password !== env.PASSWORD) {
    return new JsonResponse({ error: 'Invalid Password' }, { status: 400 });
  }

  const data = JSON.stringify(commands.map(c => c.data))

  const res = await fetch(`https://discord.com/api/v10/applications/${env.CLIENT_ID}/commands`, {
    method: "PUT",
    headers: {
      "Authorization": `Bot ${env.TOKEN}`,
      "Content-Type": "application/json"
    },
    body: data
  })
  return new JsonResponse({
    data,
    res: await res.json()
  })
})

router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'POST') {
      // Using the incoming headers, verify this request actually came from discord.
      const signature = request.headers.get('x-signature-ed25519');
      const timestamp = request.headers.get('x-signature-timestamp');
      const body = await request.clone().arrayBuffer();
      const isValidRequest = verifyKey(
        body,
        signature,
        timestamp,
        env.PUBLIC_KEY
      );
      if (!isValidRequest) {
        console.error('Invalid Request');
        return new Response('Bad request signature.', { status: 401 });
      }
    }

    return router.handle(request, env);
  },
};