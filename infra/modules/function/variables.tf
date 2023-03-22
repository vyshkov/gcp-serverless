variable "bucket_name" {
  type = string
}

variable "function_name" {
  type = string
  default = "test-function"  
}

variable "function_description" {
  type = string
  default = "test-function"  
}
variable "entry_point" {
  type = string
  default = "helloHttp"  
}
variable "source_dir" {
  type = string
}