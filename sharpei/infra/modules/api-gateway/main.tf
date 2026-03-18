################################################################################
# API Gateway Module
# Creates an HTTP API (v2) with Lambda proxy integration, custom domain,
# Route53 alias record, and the Lambda invoke permission.
################################################################################

# -----------------------------------------------------------------------------
# HTTP API
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_api" "this" {
  name          = "${var.project}-${var.environment}-api"
  protocol_type = "HTTP"

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# Lambda Integration (AWS_PROXY, payload format 2.0)
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# -----------------------------------------------------------------------------
# Default Route — catches all requests and forwards to Lambda
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# -----------------------------------------------------------------------------
# Auto-deploy Stage
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# Lambda Permission — allow API Gateway to invoke the function
# -----------------------------------------------------------------------------

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

# -----------------------------------------------------------------------------
# Custom Domain Name
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_domain_name" "this" {
  domain_name = "api.${var.domain}"

  domain_name_configuration {
    certificate_arn = var.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# API Mapping — map the custom domain to the $default stage
# -----------------------------------------------------------------------------

resource "aws_apigatewayv2_api_mapping" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  domain_name = aws_apigatewayv2_domain_name.this.id
  stage       = aws_apigatewayv2_stage.default.id
}

# -----------------------------------------------------------------------------
# Route53 Alias Record — api.{domain} -> API Gateway regional domain
# -----------------------------------------------------------------------------

resource "aws_route53_record" "api" {
  zone_id = var.zone_id
  name    = "api.${var.domain}"
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.this.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
