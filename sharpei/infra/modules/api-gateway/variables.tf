################################################################################
# API Gateway Module — Variables
################################################################################

variable "project" {
  description = "Project name used for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
}

variable "domain" {
  description = "Base domain name (e.g. sharpei.ai). The API will be exposed at api.{domain}."
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Invoke ARN of the Lambda function to integrate with."
  type        = string
}

variable "lambda_function_name" {
  description = "Name of the Lambda function (used for the invoke permission)."
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the ACM certificate covering api.{domain}."
  type        = string
}

variable "zone_id" {
  description = "Route53 hosted zone ID for the domain."
  type        = string
}
