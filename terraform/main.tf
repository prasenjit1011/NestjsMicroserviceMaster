terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

provider "google" {
  project = "terraform-497011"
  region  = "asia-south1"
}

# ------------------------------------
# Enable Required APIs
# ------------------------------------
resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "iamcredentials.googleapis.com"
  ])

  project = "terraform-497011"
  service = each.value

  disable_on_destroy = false
}

# ------------------------------------
# Artifact Registry
# ------------------------------------
resource "google_artifact_registry_repository" "repo" {
  depends_on = [google_project_service.services]

  location      = "asia-south1"
  repository_id = "nestjs-repo"
  description   = "Docker repository for NestJS"
  format        = "DOCKER"
}

# ------------------------------------
# Cloud Run Service
# ------------------------------------
resource "google_cloud_run_v2_service" "app" {

  depends_on = [
    google_project_service.services,
    google_artifact_registry_repository.repo
  ]

  name     = "nestjs-cloudrun"
  location = "asia-south1"

  ingress = "INGRESS_TRAFFIC_ALL"

  template {

    service_account = "cloudrun@terraform-497011.iam.gserviceaccount.com"

    timeout = "300s"

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    containers {

      # Placeholder image
      # GitHub Actions replaces this image during deployment
      image = "gcr.io/cloudrun/hello"

      ports {
        container_port = 50051
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "GRPC_URL"
        value = "0.0.0.0:50051"
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "1024Mi"
        }
      }

      startup_probe {
        timeout_seconds   = 240
        period_seconds    = 10
        failure_threshold = 24

        tcp_socket {
          port = 50051
        }
      }

      liveness_probe {
        tcp_socket {
          port = 50051
        }

        initial_delay_seconds = 20
        timeout_seconds       = 5
        period_seconds        = 10
        failure_threshold     = 3
      }
    }
  }
}

# ------------------------------------
# Public Access
# ------------------------------------
resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.app.name
  location = google_cloud_run_v2_service.app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ------------------------------------
# Output
# ------------------------------------
output "cloud_run_url" {
  value = google_cloud_run_v2_service.app.uri
}