# Project name provided in Google Cloud
variable "project" {
  default = ""
}

# Terraform Cloud Credentials
variable "terraform_credentials" {
  default = ""
}

# Terraform workspace
variable "terraform_workspace" {
  default = ""
}

# JSON Key file downloaded from IAM & Admin > Service Accounts
variable "credentials_file" {
  default = "credentials-file.json"
}

variable "region" {
  default = "us-west1"
}

variable "zone" {
  default = "us-west1-c"
}

# Deployment environment, choices are: dev, staging, prod
# prod uses machine with more memory and CPU availability
variable "environment" {
  type = string
  default = "prod"
}

variable "machine_types" {
  type = map
  default = {
    dev = "e2-micro"
    staging = "e2-micro"
    prod = "e2-small"
  }
}

# DNS zone name created in https://console.cloud.google.com/net-services/dns/zones/
variable "dns_zone" {
  default = ""
}
# Domain name used in DNS zone (frontend)
variable "domain_name" {
  default = ""
}

variable "sql_master_db" {
  default = "main"
}

variable "sql_master_user" {
  default = "root"
}

variable "sql_master_password" {
  default = "root"
}

variable "ssh_public_key" {
  default = "~/.ssh/id_rsa.pub"
}