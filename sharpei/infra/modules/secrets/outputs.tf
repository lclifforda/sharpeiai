################################################################################
# Secrets Module — Outputs
################################################################################

output "secret_arns" {
  description = "Map of secret key to ARN (e.g. supabase_url => arn:aws:...)."
  value       = { for k, v in aws_secretsmanager_secret.this : k => v.arn }
}
