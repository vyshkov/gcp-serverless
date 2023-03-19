variable "project_id" {
  type    = string
  default = "learning-words-trial-2"
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "functions_bucket" {
  type    = string
  default = "vovanoktk-functions"
}

variable "default_service_account" {
  type    = string
  default = "397907536090-compute@developer.gserviceaccount.com"
}