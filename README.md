# gcp-serverless
CDN https://gcp-serverless.surge.sh/
API GW https://api-gw-main-52snvftm.uc.gateway.dev/

Goals of this project:
 - Learn GCP
 - Use serverless approach to build scalable web-app
 - Use as less costs as possible for infra hosting
 - Use IaaC approach
 - Implement CI/CD for an app

## This project is not fully automated (its not possible)

You will have to maually setup some things:
 - Enable needed APIs in GCP
 - Create service accounts and setup roles for them
 - Create GCP bucket for terraform state
 - Create Identity Federation config for GitHub Actions
 - Setup GitHub Actions secrets
 - Create OAuth client ID for Google Sign In

## An idea of the architecture (implementation in progress)

![gcp serverless (4)](https://user-images.githubusercontent.com/7352031/226208196-ed342d2c-c7df-48da-88bb-95c863d6db82.png)

*Pros of the architecture:*
 - Free for small usage (~2M requests per month)
 - Very scalable
 - No need to manage servers
 - No need to have a domain name (you can use GCP API gateway domain name)
 - No need to manage SSL certificates
 - Free sign in with Google (Oauth2)
 - Can be provisioned in minutes
 - Easy to maintain
 - Open technology stack (Node.js, React, OpenAPI, Terraform, GitHub Actions, etc.)

*Cons of the architecture:*
 - Not fully automated (you will have to setup some things manually)
 - API geteway is hard to configure through openAPI yaml, no any API management UI
 - Not using CDN for cost optimization (but it can be easily added)
 - Browser caching files stored on the bucket (e.g. index.html) for 1 hour 
 - Using Surge.sh instead of GCP CDN to save costs
 
## Prerequisites 

In order to automate the deployment of the infrastructure, you need to install the following tools:
 - [Terraform](https://www.terraform.io/downloads.html)
 - [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (Optional)

Also you will need to create several service accounts
 - Github service account (for CI/CD)
 - Local service account (for local development)
 - You can also create separate service accounts for each component (e.g. for Cloud Functions, for API Gateway, etc.), but it is not required and for the simplicity of the project I will use only one service account for all components.

### Required API

You should enable couple APIs in GCP in order to be able to provusion API Gateway, Cloud Fuctions, Firestore and etc:
 - Cloud Resource Manager API 
 - Cloud Functions API 	
 - Service Control API 	
 - API Gateway API 
 - Cloud Run API 
 - Artifact Registry API
 - Cloud Build API
 - IAM Service Account Credentials API (for CI/CD identity federation) 
 - Secret Manager API

Your service account should have following roles
 - Owner (to create firestore database)


## Pricing

### GCP cloud funtions pricing 

Cloud Functions includes a perpetual free tier for invocations to allow you to experiment with the platform at no [charge](https://cloud.google.com/functions/pricing#:~:text=Cloud%20Functions%20includes%20a%20perpetual,require%20a%20valid%20billing%20account.)

| Invocations per month	| Price/million |
|-----------------------|---------------|
| First 2 million	      | Free          |
| Beyond 2 million 	    | $0.40         |

Once you exceed the free tier, you will be charged for any additional compute time and network egress used by your Cloud Functions. You can find more information about Cloud Functions pricing on the official Google Cloud pricing page.
E.g. 256MB	.167 vCPU will cost $0.000000648 per sec (which is ~$1.5 per month). So in case you use it for websocket long living connections, and you have many users, it may cost you lot of money.

### API gateway pricing 

| API calls per month per billing account	| Cost per million API calls |
|-----------------------------------------|----------------------------|
| 0-2M	                                  | Free                       |
| 2M-1B 	                                | $3.00                      |
| 1B+ 	                                  | $1.50                      |

Ingress is always free, but *Egress require some consts e.g. ~$0.1 per GB*

### Cloud Storage

- 5 GB-months of regional storage (US regions only) per month - is free

Other thatn that it will cost you ~$0.026 per GB-month

## Automate Terraform with GitHub Actions

GitHub Actions add continuous integration to GitHub repositories to automate software builds, tests, and deployments. Automating Terraform with CI/CD enforces configuration best practices, promotes collaboration and automates the Terraform workflow.

HashiCorp's "Setup Terraform" GitHub Action sets up and configures the Terraform CLI in Github Actions workflows. This allows most Terraform commands to work exactly like they do on your local command line.

A Cloud Storage backend stores the state as an object in a configurable prefix in a given bucket on Cloud Storage. This backend also supports state locking. This will lock state for all operations that could write state. This prevents others from acquiring the lock and potentially corrupting the state.

```
terraform {
  backend "gcs" {
    bucket  = "# REPLACE WITH YOUR BUCKET NAME"
    prefix  = "terraform/state"
  }
}
```


## Setting up Identity Federation for GitHub Actions

To use the new GitHub Actions auth action, you need to set up and configure Workload Identity Federation by creating a Workload Identity Pool and Workload Identity Provider:

```shell
gcloud iam workload-identity-pools create "idpool" \
  --project="learning-words-trial" \
  --location="global" \
  --display-name="idpool"

gcloud iam workload-identity-pools providers create-oidc "idprovider" \
  --project="learning-words-trial" \
  --location="global" \
  --workload-identity-pool="idpool" \
  --display-name="idprovider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
  ```

The attribute mappings map claims in the GitHub Actions JWT to assertions you can make about the request (like the repository or GitHub username of the principal invoking the GitHub Action). These can be used to further restrict the authentication using `--attribute-condition` flags. For example, you can map the attribute repository value (which can be used later to restrict the authentication to specific repositories):

`--attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository"`
Finally, allow authentications from the Workload Identity Provider to impersonate the desired Service Account:

```shell
gcloud iam service-accounts add-iam-policy-binding "githubsanew@learning-words-trial.iam.gserviceaccount.com" \
  --project="learning-words-trial" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/736194043976/locations/global/workloadIdentityPools/idpool/attribute.repository/vyshkov/gcp-serverless"
  ```
https://iam.googleapis.com/projects/736194043976/locations/global/workloadIdentityPools/githubactions/providers/github  

For more configuration options, see the Workload Identity Federation documentation. If you are using Terraform to automate your infrastructure provisioning, check out the GitHub OIDC Terraform module too.
