# gcp-serverless
Sample project for learing serverless approach in GCP

## Setting up Identity Federation for GitHub Actions

To use the new GitHub Actions auth action, you need to set up and configure Workload Identity Federation by creating a Workload Identity Pool and Workload Identity Provider:

```shell
gcloud iam workload-identity-pools create "my-pool" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --display-name="Demo pool"

gcloud iam workload-identity-pools providers create-oidc "my-provider" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="my-pool" \
  --display-name="Demo provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.aud=assertion.aud" \
  --issuer-uri="https://token.actions.githubusercontent.com"
  ```

The attribute mappings map claims in the GitHub Actions JWT to assertions you can make about the request (like the repository or GitHub username of the principal invoking the GitHub Action). These can be used to further restrict the authentication using `--attribute-condition` flags. For example, you can map the attribute repository value (which can be used later to restrict the authentication to specific repositories):

`--attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository"`
Finally, allow authentications from the Workload Identity Provider to impersonate the desired Service Account:

```shell
gcloud iam service-accounts add-iam-policy-binding "my-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/1234567890/locations/global/workloadIdentityPools/my-pool/attribute.repository/my-org/my-repo"
  ```
  
For more configuration options, see the Workload Identity Federation documentation. If you are using Terraform to automate your infrastructure provisioning, check out the GitHub OIDC Terraform module too.