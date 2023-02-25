terraform {
  required_providers {
    google = {
      version = "4.52.0"
    }
  }
}

provider "google" {
    credentials = file("gcp-service-account-credentials.json")
    project     = var.project_id
    region      = var.region
}