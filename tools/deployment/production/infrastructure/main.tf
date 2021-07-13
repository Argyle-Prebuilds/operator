terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "3.74.0"
    }
  }
  backend "remote" {}
}

provider "google" {
  credentials = var.credentials_file

  project = var.project
  region = var.region
  zone = var.zone
}

resource "random_id" "instance_id" {
  byte_length = 8
}

# Create a Google Compute Firewall
resource "google_compute_firewall" "django" {
  name = "api-${var.terraform_workspace}"
  network = "default"

  source_ranges = [
    "0.0.0.0/0"]

  allow {
    protocol = "tcp"
    ports = [
      "80",
      "443"]
  }
}

# A single Compute Engine instance
resource "google_compute_instance" "vm-instance" {
  name = "django-vm-main-${var.terraform_workspace}"
  machine_type = var.machine_types[var.environment]

  boot_disk {
    initialize_params {
      image = "ubuntu-2004-lts"
    }
  }

  metadata = {
    ssh-keys = "ubuntu:${file(var.ssh_public_key)}"
  }

  network_interface {
    network = "default"
    access_config {}
  }

}

output "ip" {
  value = google_compute_instance.vm-instance.network_interface.0.access_config.0.nat_ip
}