################################################################################
# Lambda Module — Outputs
################################################################################

output "function_name" {
  description = "Name of the Lambda function."
  value       = aws_lambda_function.api.function_name
}

output "function_arn" {
  description = "ARN of the Lambda function."
  value       = aws_lambda_function.api.arn
}

output "invoke_arn" {
  description = "Invoke ARN of the Lambda function (used by API Gateway integration)."
  value       = aws_lambda_function.api.invoke_arn
}

output "function_url" {
  description = "Lambda Function URL (direct invocation endpoint)."
  value       = aws_lambda_function_url.api.function_url
}
