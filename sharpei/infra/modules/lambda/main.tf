################################################################################
# Lambda Module
# Creates the Lambda function, IAM role, Function URL, and CloudWatch log group.
################################################################################

locals {
  function_name = "${var.project}-${var.environment}-api"
}

# -----------------------------------------------------------------------------
# IAM Role
# -----------------------------------------------------------------------------

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${local.function_name}-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# Basic execution — CloudWatch Logs write access
resource "aws_iam_role_policy_attachment" "basic_execution" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Secrets Manager read-only access
data "aws_iam_policy_document" "secrets_read" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = ["arn:aws:secretsmanager:*:*:secret:${var.project}/${var.environment}/*"]
  }
}

resource "aws_iam_policy" "secrets_read" {
  name   = "${local.function_name}-secrets-read"
  policy = data.aws_iam_policy_document.secrets_read.json

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "secrets_read" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.secrets_read.arn
}

# -----------------------------------------------------------------------------
# CloudWatch Log Group (created before the function so retention is enforced)
# -----------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.function_name}"
  retention_in_days = 14

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# Lambda Function
# -----------------------------------------------------------------------------

resource "aws_lambda_function" "api" {
  function_name = local.function_name
  role          = aws_iam_role.lambda.arn

  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  runtime       = "nodejs20.x"
  handler       = "index.handler"
  architectures = ["arm64"]
  memory_size   = 512
  timeout       = 30

  environment {
    variables = {
      NODE_ENV              = var.environment
      SUPABASE_URL          = var.supabase_url
      SUPABASE_SERVICE_KEY  = var.supabase_service_key
      SUPABASE_ANON_KEY     = var.supabase_anon_key
      CORS_ORIGINS          = var.cors_origins
      DATABASE_URL          = var.database_url
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.basic_execution,
    aws_iam_role_policy_attachment.secrets_read,
    aws_cloudwatch_log_group.lambda,
  ]

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# Lambda Function URL (RESPONSE_STREAM for SSE support)
# -----------------------------------------------------------------------------

resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"
  invoke_mode        = "RESPONSE_STREAM"

  cors {
    allow_origins = split(",", var.cors_origins)
    allow_methods = ["*"]
    allow_headers = ["*"]
    max_age       = 86400
  }
}
