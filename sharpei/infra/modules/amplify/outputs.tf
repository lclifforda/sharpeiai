################################################################################
# Amplify Module — Outputs
################################################################################

output "app_id" {
  description = "Unique ID of the Amplify app."
  value       = aws_amplify_app.web.id
}

output "default_domain" {
  description = "Default domain assigned by Amplify (e.g. <id>.amplifyapp.com)."
  value       = aws_amplify_app.web.default_domain
}

output "app_arn" {
  description = "ARN of the Amplify app."
  value       = aws_amplify_app.web.arn
}
