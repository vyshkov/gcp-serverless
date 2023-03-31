import { FastifyReply, FastifyRequest } from "fastify";

const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');
const jwt = require('jsonwebtoken');
const Firestore = require('@google-cloud/firestore');

const cors = require('cors')({ origin: true });

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

fastify.addContentTypeParser('application/json', {}, (req: FastifyRequest, body: any, done: any) => {
    done(null, body.body);
});

fastify.get('/', { prefix: "/test" }, async (request: FastifyRequest , reply: FastifyReply) => {
    return { hello: '4' }
});

const main = async (request: FastifyRequest , reply: FastifyReply) => {
    await fastify.ready();
    fastify.server.emit('request', request, reply)
}

module.exports = {
    main
}