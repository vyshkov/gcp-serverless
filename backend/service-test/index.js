'use strict';

// [START functions_http_method]
const functions = require('@google-cloud/functions-framework');

/**
 * Responds to a GET request with "Hello World!". Forbids a PUT request.
 *
 * @example
 * gcloud functions call helloHttp
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http('helloHttp', (req, res) => {
  switch (req.method) {
    case 'GET':
      res.status(200).sendFile('./static/index.html', { root: __dirname });
      break;
    case 'PUT':
      res.status(403).send('Forbidden!');
      break;
    default:
      res.status(405).send({error: 'Something blew up!'});
      break;
  }
});
// [END functions_http_method]
