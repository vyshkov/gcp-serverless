resource "google_cloudfunctions2_function" "function" {
  name        = var.function_name
  description = var.function_description
  location    = "us-central1"

  build_config {
    runtime     = "nodejs18"
    entry_point = "helloHttp" # Set the entry point
    source {
      storage_source {
        bucket = var.functions_bucket
        object = var.archive
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
  }
}

# Cloud run biding to make it able to call from anywhere
# resource "google_cloud_run_service_iam_binding" "default" {
#   location = google_cloudfunctions2_function.function.location
#   service  = google_cloudfunctions2_function.function.name
#   role     = "roles/run.invoker"
#   members = [
#     "allUsers"
#   ]
# }

# Output
output "function_uri" { 
  value = google_cloudfunctions2_function.function.service_config[0].uri
}