# gcp-serverless
Sample project for learing serverless approach in GCP

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