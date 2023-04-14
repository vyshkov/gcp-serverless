import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { v2 as GoogleTranslate } from "@google-cloud/translate";

const jwt = require('jsonwebtoken');
const Firestore = require('@google-cloud/firestore');

import cors from '@fastify/cors'
import { QuerySnapshot } from "@google-cloud/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const COLLECTION_NAME = 'users';
const AZURE_TRANSLATE_SECRET_NAME = "azure-translation-token" ;

const firestore = new Firestore({
    timestampsInSnapshots: true
    // NOTE: Don't hardcode your project credentials here.
    // If you have to, export the following to your shell:
    //   GOOGLE_APPLICATION_CREDENTIALS=<path>
    // keyFilename: '/cred/cloud-functions-firestore-000000000000.json',
});

// function to get secret from GCP
async function getSecret(): Promise<string> {
  const client = new SecretManagerServiceClient();
  const projectId = process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  const [version] = await client.accessSecretVersion({
    name: `projects/${projectId}/secrets/${AZURE_TRANSLATE_SECRET_NAME}/versions/latest`,
  });

  if (!version || !version.payload || !version.payload.data) {
    throw new Error(`Secret ${AZURE_TRANSLATE_SECRET_NAME} not found`);
  }

  return version.payload.data.toString();
}

const fastify = require("fastify")({
    logger: true // you can also define the level passing an object configuration to logger: {level: 'debug'}
});

fastify.register(cors, {
    // put your options here
});

fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    let token = request.headers['x-forwarded-authorization'] || request.headers['authorization'];
    console.log('token', request.headers)

    if (!token) {
        reply.code(401).send({ message: 'Unauthorized' });
        return;
    }

    const tokenParts = (token as string).split(' ');

    try {
      const decodedToken = jwt.decode(tokenParts[1], { complete: true });
      const email = decodedToken.payload.email;

      const querySnapshot: QuerySnapshot = await firestore
        .collection(COLLECTION_NAME).where('email', '==', email).get();
        
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();
        console.log('???', user);
        request.headers['x-user-email'] = email;
        request.headers['x-user-id'] = user.id;
        request.headers['x-user-roles'] = JSON.stringify(user.roles);
        done();
      } else {
        reply.code(403).send({ message: 'The user is not in the database' });
        return;
      }
    } catch (err) {
        reply.code(500).send({ message: 'Failed to check auth' });
        return;
    }
});

fastify.addContentTypeParser('application/json', {}, (req: FastifyRequest, body: any, done: any) => {
    done(null, body.body);
});

fastify.get('/', async (request: FastifyRequest , reply: FastifyReply) => {
    return { hello: request.headers }
});

fastify.post('/translateGoogle', async (request: FastifyRequest , reply: FastifyReply) => {
  const requestBody = request.body as { text: string, from: string, to: string };
  const { text, from, to } = requestBody;

  const {Translate} = GoogleTranslate;
  const translate = new Translate();

  return await translate.translate(text, { from, to });
});

fastify.post('/translate', async (request: FastifyRequest , reply: FastifyReply) => {
  const requestBody = request.body as { text: string, from: string, to: string };
  const text = requestBody.text;
  const from = requestBody.from;
  const to = requestBody.to;

  const token = await getSecret();
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}&to=${to}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': token,
        'Content-type': 'application/json',
        'Ocp-Apim-Subscription-Region': 'centralus'
      },
      body: JSON.stringify([{ 'Text': text }])
    });

    const data = await response.json();
    return data;
  } catch (err) {
    reply.code(500).send({ message: 'Failed to check auth' });
  }
});

const main = async (request: FastifyRequest , reply: FastifyReply) => {
    await fastify.ready();
    fastify.server.emit('request', request, reply)
}

module.exports = {
    main
}