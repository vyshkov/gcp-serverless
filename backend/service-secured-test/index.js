// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START functions_helloworld_http]
const functions = require('@google-cloud/functions-framework');
const escapeHtml = require('escape-html');
const jwt = require('jsonwebtoken');

const cors = require('cors')({ origin: true });
/**
 * Responds to an HTTP request using data from the request body parsed according
 * to the "content-type" header.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http('helloHttp', (req, res) => {
    cors(req, res, () => {
        // Get the JWT token from the Authorization header
        const authHeader = req.get('x-forwarded-authorization') || req.get('Authorization');

        console.log(req.headers)

        if (authHeader) {
            // Decode the JWT token
            const decodedToken = jwt.decode(authHeader.split(' ')[1], { complete: true });

            res.send(decodedToken);
        } else {
            res.send(403, { error: "Failed to get users auth token "});
        }
    })
});
// [END functions_helloworld_http]
