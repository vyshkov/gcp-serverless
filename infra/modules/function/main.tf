data "archive_file" "src" {
  type        = "zip"
  source_dir  = var.source_dir
  output_path = ".build/${var.function_name}.zip"
}

resource "google_storage_bucket_object" "object" {
  name   = "${var.function_name}.zip"
  bucket = var.bucket_name
  source = data.archive_file.src.output_path
}

resource "google_cloudfunctions2_function" "function" {
  name        = var.function_name
  description = var.function_description
  location    = "us-central1"

  build_config {
    runtime     = "nodejs18"
    entry_point = var.entry_point # Set the entry point
    source {
      storage_source {
        bucket = var.bucket_name
        object = "${var.function_name}.zip"
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    environment_variables = {
        GOOGLE_CLOUD_PROJECT = var.project_id
        GOOGLE_CLOUD_PROJECT_NUMBER = var.project_number
    }
  }

  depends_on = [
    google_storage_bucket_object.object
  ]
}

# Cloud run biding to make it able to call from anywhere
resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloudfunctions2_function.function.location
  service  = google_cloudfunctions2_function.function.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

#Output
output "function_uri" { 
  value = google_cloudfunctions2_function.function.service_config[0].uri
}