
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
  api_id = "api-cfg"
}

resource "google_api_gateway_api_config" "api_cfg" {
  provider = google-beta
  api = google_api_gateway_api.api_cfg.api_id
  api_config_id = "cfg"

  openapi_documents {
    document {
      path = "spec.yaml"
      contents = filebase64("api.yaml")
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}