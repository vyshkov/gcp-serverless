locals {
  name_suffix = "1"
  openapi_cfg = file("api.yaml")
}

# A bucket for SPA static files
resource "google_storage_bucket" "static_bucket" {
  name          = "vovanoktk-static"
  project       = var.project_id
  storage_class = "standard"
  location      = "US"
}

data "google_iam_policy" "viewer" {
  binding {
    role = "roles/storage.objectViewer"
    members = [
      "allUsers",
    ]
  }
}

resource "google_storage_bucket_iam_policy" "viewer" {
  bucket      = google_storage_bucket.static_bucket.name
  policy_data = data.google_iam_policy.viewer.policy_data
}

resource "google_storage_bucket" "functions_bucket" {
  name          = "vovanoktk-functions"
  project       = var.project_id
  storage_class = "standard"
  location      = "US"
}

# FN 1
module "function_test_service" {
  # the path to the module
  source = "./modules/function"

  # the path of the source code
  source_dir = "../backend/service-secured-test"

  # bucket where the function zip will be stored
  bucket_name = google_storage_bucket.functions_bucket.name

  function_name        = "httptest1"
  function_description = "http_test1 desc"
}
output "function_uri_1" {
  value = module.function_test_service.function_uri
}

# FN 2
module "function_test_service_2" {
  # the path to the module
  source = "./modules/function"

  # the path of the source code
  source_dir = "../backend/service-test"

  # bucket where the function zip will be stored
  bucket_name = google_storage_bucket.functions_bucket.name

  function_name        = "httptest2"
  function_description = "http_test2 desc"
}
output "function_uri_2" {
  value = module.function_test_service_2.function_uri
}


resource "google_project_service" "firestore" {
  provider = google-beta
  project  = var.project_id
  service  = "firestore.googleapis.com"
}

resource "google_firestore_database" "database" {
  provider                    = google-beta
  project                     = var.project_id
  name                        = "(default)"
  location_id                 = "nam5"
  type                        = "FIRESTORE_NATIVE"
  concurrency_mode            = "OPTIMISTIC"
  app_engine_integration_mode = "DISABLED"

  depends_on = [google_project_service.firestore]
}

resource "google_api_gateway_api" "api_cfg" {
  provider = google-beta
  api_id   = "api-gw-main"
}

resource "google_api_gateway_api_config" "api_cfg" {
  provider      = google-beta
  api           = google_api_gateway_api.api_cfg.api_id
  api_config_id = "cfg-${substr(sha256(local.openapi_cfg), 0, 5)}-${local.name_suffix}"


  openapi_documents {
    document {
      path = "spec.yaml"
      contents = (base64encode(templatefile("api.yaml", {
        function_test_service   = module.function_test_service.function_uri
        function_test_service_2 = module.function_test_service_2.function_uri
        managed_service         = google_api_gateway_api.api_cfg.managed_service
      })))
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "api_gw" {
  provider     = google-beta
  api_config   = google_api_gateway_api_config.api_cfg.id
  gateway_id   = "api-gw-main"
  display_name = "Dev API Gateway"
  labels = {
    environment = "dev"
  }
}

output "api_gateway_main" {
  value = google_api_gateway_api.api_cfg.managed_service
}
output "api_gateway" {
  value = google_api_gateway_gateway.api_gw.default_hostname
}
