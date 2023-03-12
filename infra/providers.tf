terraform {
  required_providers {
    google = {
      version = "4.52.0"
    }
  }
  backend "gcs" {
    bucket      = "vovanoktk-tfstate"
    prefix      = "terraform/state"
    credentials = "gcp-service-account-credentials.json"
  }
}

provider "google" {
  credentials = file("gcp-service-account-credentials.json")
  project     = var.project_id
  region      = var.region
}

provider "google-beta" {
  credentials = file("gcp-service-account-credentials.json")
  project     = var.project_id
  region      = var.region
}
