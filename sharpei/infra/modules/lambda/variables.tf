################################################################################
# Lambda Module — Variables
################################################################################

variable "project" {
  description = "Project name used for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
}

variable "lambda_zip_path" {
  description = "Local path to the Lambda deployment zip file."
  type        = string
}

variable "supabase_url" {
  description = "Supabase project URL."
  type        = string
}

variable "supabase_service_key" {
  description = "Supabase service-role key (secret)."
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anonymous/public key."
  type        = string
  sensitive   = true
}

variable "database_url" {
  description = "PostgreSQL connection string (Supabase session pooler)."
  type        = string
  sensitive   = true
}

variable "cors_origins" {
  description = "Comma-separated list of allowed CORS origins."
  type        = string
  default     = "*"
}
