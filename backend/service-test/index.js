const axios = require('axios');
const functions = require('@google-cloud/functions-framework');
const cors = require('cors')({ origin: true });
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

functions.http('helloHttp', (req, res) => {
  cors(req, res, async () => {

    // GCP cloud function wich should trigger GPT API to generate random quote
    // and return it to the client
    try {

      // Create a client for the Secret Manager API
      const client = new SecretManagerServiceClient();

      // Retrieve the value of a secret
      const [version] = await client.accessSecretVersion({
        name: 'projects/397907536090/secrets/openai-secret/versions/latest',
      });

      const secretValue = version.payload.data.toString();
      // Make a POST request to the GPT API endpoint
      const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        prompt: `Write a 2Pac quote about life:`,
        max_tokens: 50,
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${version}`,
        },
      });

      // Extract the generated quote from the response
      const generatedQuote = response.data.choices[0].text.trim();

      res.status(200).json({ quote: generatedQuote + "!!!" + secretValue, author: "GPT" });

    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal server error: ' + error });
    }
  })
});
