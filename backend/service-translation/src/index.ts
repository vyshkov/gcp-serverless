import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

const functions = require('@google-cloud/functions-framework');
const jwt = require('jsonwebtoken');
const Firestore = require('@google-cloud/firestore');

import cors from '@fastify/cors'
import { QuerySnapshot } from "@google-cloud/firestore";

const COLLECTION_NAME = 'users';

const firestore = new Firestore({
    timestampsInSnapshots: true
    // NOTE: Don't hardcode your project credentials here.
    // If you have to, export the following to your shell:
    //   GOOGLE_APPLICATION_CREDENTIALS=<path>
    // keyFilename: '/cred/cloud-functions-firestore-000000000000.json',
});

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

fastify.get('/translate', async (request: FastifyRequest , reply: FastifyReply) => {
  return { translation: request.headers }
});

const main = async (request: FastifyRequest , reply: FastifyReply) => {
    await fastify.ready();
    fastify.server.emit('request', request, reply)
}

module.exports = {
    main
}