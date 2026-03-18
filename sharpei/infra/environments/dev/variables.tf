################################################################################
# Dev Environment — Input Variables
# Sensitive values should be passed via environment variables or -var flags,
# NOT committed to source control.
#
#   export TF_VAR_supabase_service_key="..."
#   export TF_VAR_supabase_anon_key="..."
#   export TF_VAR_github_access_token="..."
################################################################################

variable "supabase_url" {
  description = "Supabase project URL."
  type        = string
}

variable "supabase_service_key" {
  description = "Supabase service-role key."
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

variable "github_access_token" {
  description = "GitHub personal access token for Amplify repo connection."
  type        = string
  sensitive   = true
}
