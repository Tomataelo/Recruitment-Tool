variable "aws_region" {
  default = "eu-central-1"
}

variable "app_name" {
  default = "recruitment-tool"
}

variable "db_password" {
  sensitive = true
}

variable "claude_api_key" {
  sensitive = true
}

variable "jwt_secret" {
  sensitive = true
}

variable "jwt_secret_key" {
  description = "JWT private key content"
  sensitive   = true
}

variable "jwt_public_key" {
  description = "JWT public key content"
  sensitive   = true
}

variable "jwt_passphrase" {
  description = "JWT passphrase"
  sensitive   = true
  default     = ""
}