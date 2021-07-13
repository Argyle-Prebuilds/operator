resource "google_dns_record_set" "backend" {
  name = "api.${var.domain_name}."
  type = "A"
  ttl = 5

  managed_zone = var.dns_zone

  rrdatas = [
    google_compute_instance.vm-instance.network_interface[0].access_config[0].nat_ip]
}

resource "google_dns_record_set" "frontend" {
  name = "${var.domain_name}."
  type = "A"
  ttl = 5

  managed_zone = var.dns_zone

  rrdatas = [
    google_compute_instance.vm-instance.network_interface[0].access_config[0].nat_ip]
}

resource "google_dns_record_set" "frontend_www" {
  name = "www.${var.domain_name}."
  type = "CNAME"
  ttl = 300

  managed_zone = var.dns_zone

  rrdatas = [
    google_dns_record_set.frontend.name
  ]
}
