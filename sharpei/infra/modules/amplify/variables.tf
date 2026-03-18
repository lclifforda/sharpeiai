################################################################################
# Amplify Module — Variables
################################################################################

variable "project" {
  description = "Project name used for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
}

variable "github_repo_url" {
  description = "HTTPS URL of the GitHub repository."
  type        = string
  default     = "https://github.com/lclifforda/sharpeiai"
}

variable "github_access_token" {
  description = "GitHub personal access token for Amplify to connect to the repository."
  type        = string
  sensitive   = true
}

variable "domain" {
  description = "Custom domain name to associate with the Amplify app (e.g. sharpei.ai). Set to empty string to skip."
  type        = string
  default     = ""
}

variable "api_url" {
  description = "Backend API URL exposed as VITE_API_URL to the frontend build."
  type        = string
}

variable "supabase_url" {
  description = "Supabase project URL exposed as VITE_SUPABASE_URL to the frontend build."
  type        = string
}

variable "supabase_anon_key" {
  description = "Supabase anonymous/public key exposed as VITE_SUPABASE_ANON_KEY to the frontend build."
  type        = string
  sensitive   = true
}
