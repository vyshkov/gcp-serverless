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
            const email = decodedToken.payload.email;

            firestore.collection(COLLECTION_NAME).where('email', '==', email).get()
                .then(querySnapshot => {
                    if(!querySnapshot.empty) {
                        const user = querySnapshot.docs[0].data()
                        return res.status(200).send({ ...decodedToken.payload, ...user }); 
                    } else {
                        return res.status(403).send({
                            error: 'The user is not in the database'
                        });
                    }
                }).catch(err => {
                    console.error(err);
                    return res.status(500).send({
                        error: 'Unable to retrieve the document',
                        err
                    });
                });
            
        } else {
            res.send(403, { error: "Failed to get users auth token "});
        }
    })
});
// [END functions_helloworld_http]
