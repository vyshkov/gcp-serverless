locals {
  name_suffix = "17"
}

# FN 1
module "function_test_service" {
  source = "./modules/function"
  function_name = "httptest1"
  function_description = "http_test1 desc"
  archive = "test-service.zip"
}
output "function_uri_1" { 
  value = module.function_test_service.function_uri
}

#FN 2
module "function_test_service_2" {
  source = "./modules/function"
  function_name = "httptest2"
  function_description = "http_test2 desc"
}

output "function_uri_2" { 
  value = module.function_test_service_2.function_uri
}


resource "google_api_gateway_api" "api_cfg" {
  provider = google-beta
  api_id = "api-gw-main"
}

resource "google_api_gateway_api_config" "api_cfg" {
  provider = google-beta
  api = google_api_gateway_api.api_cfg.api_id
  api_config_id = "api-gw-${local.name_suffix}"


  openapi_documents {
    document {
      path = "spec.yaml"
      contents = "${base64encode(templatefile("api.yaml", {
        function_test_service = module.function_test_service.function_uri
        function_test_service_2 = module.function_test_service_2.function_uri
        managed_service = google_api_gateway_api.api_cfg.managed_service
      }))}"
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "google_api_gateway_gateway" "api_gw" {
  provider = google-beta
  api_config = google_api_gateway_api_config.api_cfg.id
  gateway_id = "api-gw-main"
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