module "function_test_service" {
  source = "./modules/function"
  function_name = "httptest1"
  function_description = "http_test1 desc"
}

module "function_test_service_2" {
  source = "./modules/function"
  function_name = "httptest2"
  function_description = "http_test2 desc"
}