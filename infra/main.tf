
# FN 1
module "function_test_service" {
  source = "./modules/function"
  function_name = "httptest1"
  function_description = "http_test1 desc"
}
output "function_uri_1" { 
  value = function_test_service.google_cloudfunctions2_function.function.service_config[0].uri
}

#FN 2
module "function_test_service_2" {
  source = "./modules/function"
  function_name = "httptest2"
  function_description = "http_test2 desc"
}

output "function_uri_2" { 
  value = function_test_service_2.google_cloudfunctions2_function.function.service_config[0].uri
}
