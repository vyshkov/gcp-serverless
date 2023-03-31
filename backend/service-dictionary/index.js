const functions = require('@google-cloud/functions-framework');
const Firestore = require('@google-cloud/firestore');
const jwt = require('jsonwebtoken');
const cors = require('cors')({ origin: true });

const firestore = new Firestore({
  timestampsInSnapshots: true
});

const WORDS_COLLECTION = 'words';
const USERS_COLLECTION = 'users';

function wrap(req, res, fn) {
  cors(req, res, () => {
    // Get the JWT token from the Authorization header
    const authHeader = req.get('x-forwarded-authorization') || req.get('Authorization');

    if (authHeader) {
      // Decode the JWT token
      const decodedToken = jwt.decode(authHeader.split(' ')[1], { complete: true });
      const email = decodedToken.payload.email;

      firestore.collection(USERS_COLLECTION).where('email', '==', email).get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const user = querySnapshot.docs[0].data();
            return fn(req, res, { decodedToken, user });
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
      res.send(403, { error: "Failed to get users auth token." });
    }
  });
}

const defaulErrorHandler = (err, res) => {
  console.error(err);
  return res.status(500).send({
    error: 'Unable to execute operation',
    err
  });
}

functions.http('main', (req, res) => {
  wrap(req, res, (req, res, { decodedToken, user }) => {
    // CRUD operations
    switch (req.method) {
      case 'GET':
        // Get all the documents
        firestore.collection(WORDS_COLLECTION).where('userId', '==', decodedToken.payload.email).get()
          .then(querySnapshot => {
            res.status(200).send(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
          }).catch(err => defaulErrorHandler(err, res));
        break;
      case 'POST':
        firestore.collection(WORDS_COLLECTION).add({ 
          ...req.body, 
          userId: decodedToken.payload.email, 
          lastUpdated: new Date().getTime() 
        })
        .then(docRef => {
          res.status(200).send({ id: docRef.id });
        }).catch(err => defaulErrorHandler(err, res));
        break;
      case 'PUT':
        // Update a document
        firestore.collection(WORDS_COLLECTION).doc(req.body.id).update(req.body)
          .then(() => {
            res.status(200).send({ id: req.body.id });
          }).catch(err => defaulErrorHandler(err, res));
        break;
      case 'DELETE':
        // Delete a document
        const id = req.path.split('/').pop();
        console.log(">> Deleting document with id", id);
        firestore.collection(WORDS_COLLECTION).doc(id).delete()
          .then(() => {
            res.status(200).send({ id });
          }
          ).catch(err => defaulErrorHandler(err, res));
        break;

      default:
        res.status(405).send({ error: 'Method not allowed' });
        break;
    }
  });
});
