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

variable "source_dir" {
  type = string
}