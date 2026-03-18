################################################################################
# API Gateway Module — Outputs
################################################################################

output "api_url" {
  description = "Default invoke URL of the HTTP API (auto-generated domain)."
  value       = aws_apigatewayv2_api.this.api_endpoint
}

output "api_gateway_domain_name" {
  description = "Regional domain name of the custom API Gateway domain (for DNS aliasing)."
  value       = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].target_domain_name
}

output "api_gateway_hosted_zone_id" {
  description = "Hosted zone ID of the API Gateway regional domain (for Route53 alias records)."
  value       = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].hosted_zone_id
}
