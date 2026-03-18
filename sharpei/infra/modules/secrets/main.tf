################################################################################
# Secrets Module
# Creates Secrets Manager secret shells for the given environment.
# Values are set manually via the AWS CLI — Terraform only manages the resource
# lifecycle.
################################################################################

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

locals {
  secret_names = {
    supabase_url         = "${var.project}/${var.environment}/supabase-url"
    supabase_service_key = "${var.project}/${var.environment}/supabase-service-key"
    supabase_anon_key    = "${var.project}/${var.environment}/supabase-anon-key"
    anthropic_api_key    = "${var.project}/${var.environment}/anthropic-api-key"
  }
}

# -----------------------------------------------------------------------------
# Secrets Manager Secrets
# -----------------------------------------------------------------------------

resource "aws_secretsmanager_secret" "this" {
  for_each = local.secret_names

  name        = each.value
  description = "Managed by Terraform. Value set via CLI."

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}
