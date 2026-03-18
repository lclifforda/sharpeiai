################################################################################
# Secrets Module — Variables
################################################################################

variable "project" {
  description = "Project name used for secret path prefixes and tagging."
  type        = string
  default     = "sharpei"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
}
