
# FN 1
module "function_test_service" {
  source = "./modules/function"
  function_name = "httptest1"
  function_description = "http_test1 desc"
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
