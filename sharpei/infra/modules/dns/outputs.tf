################################################################################
# DNS Module — Outputs
################################################################################

output "zone_id" {
  description = "Route53 hosted zone ID."
  value       = aws_route53_zone.main.zone_id
}

output "certificate_arn" {
  description = "ARN of the validated ACM certificate."
  value       = aws_acm_certificate_validation.main.certificate_arn
}

output "nameservers" {
  description = "Nameservers for the hosted zone (delegate from your registrar)."
  value       = aws_route53_zone.main.name_servers
}
