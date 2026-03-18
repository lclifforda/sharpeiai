################################################################################
# Sharpei Dev Environment
# Wires all infrastructure modules together for the dev deployment.
################################################################################

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "sharpei-tf-state-565710700642"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "sharpei-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = "eu-west-1"

  default_tags {
    tags = {
      Project     = "sharpei"
      Environment = "dev"
      ManagedBy   = "terraform"
    }
  }
}

locals {
  project     = "sharpei"
  environment = "dev"
  domain      = "sharpei.ai"
}

# =============================================================================
# DNS — Route53 hosted zone + ACM certificate (eu-west-1 for API Gateway)
# =============================================================================

module "dns" {
  source = "../../modules/dns"

  domain = local.domain
}

# =============================================================================
# Secrets — Secrets Manager shells (values set via CLI)
# =============================================================================

module "secrets" {
  source = "../../modules/secrets"

  project     = local.project
  environment = local.environment
}

# =============================================================================
# Lambda — API function
# =============================================================================

module "lambda" {
  source = "../../modules/lambda"

  project     = local.project
  environment = local.environment

  lambda_zip_path      = "../../../apps/api/lambda.zip"
  supabase_url         = var.supabase_url
  supabase_service_key = var.supabase_service_key
  supabase_anon_key    = var.supabase_anon_key
  database_url         = var.database_url
  cors_origins         = "https://${local.domain},https://www.${local.domain}"

  depends_on = [module.secrets]
}

# =============================================================================
# API Gateway — HTTP API with custom domain (api.sharpei.ai)
# =============================================================================

module "api_gateway" {
  source = "../../modules/api-gateway"

  project     = local.project
  environment = local.environment
  domain      = local.domain

  lambda_invoke_arn    = module.lambda.invoke_arn
  lambda_function_name = module.lambda.function_name
  certificate_arn      = module.dns.certificate_arn
  zone_id              = module.dns.zone_id
}

# =============================================================================
# Amplify — Frontend hosting (manages its own SSL)
# =============================================================================

module "amplify" {
  source = "../../modules/amplify"

  project     = local.project
  environment = local.environment
  domain      = ""  # Skip custom domain for now — use default Amplify URL

  github_access_token = var.github_access_token
  api_url             = module.api_gateway.api_url
  supabase_url        = var.supabase_url
  supabase_anon_key   = var.supabase_anon_key
}

# =============================================================================
# Outputs
# =============================================================================

output "nameservers" {
  description = "Delegate these NS records from your domain registrar."
  value       = module.dns.nameservers
}

output "api_url" {
  description = "API Gateway invoke URL."
  value       = module.api_gateway.api_url
}

output "api_custom_domain" {
  description = "Custom API domain."
  value       = "https://api.${local.domain}"
}

output "lambda_function_url" {
  description = "Direct Lambda Function URL (for debugging)."
  value       = module.lambda.function_url
}

output "amplify_default_domain" {
  description = "Default Amplify domain."
  value       = module.amplify.default_domain
}

output "amplify_app_id" {
  description = "Amplify app ID."
  value       = module.amplify.app_id
}

output "secret_arns" {
  description = "Map of secret name to ARN (populate values via AWS CLI)."
  value       = module.secrets.secret_arns
}
