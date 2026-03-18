################################################################################
# DNS Module
# Creates the Route53 hosted zone, ACM wildcard certificate, and DNS validation
# records for the domain.
################################################################################

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# -----------------------------------------------------------------------------
# Route53 Hosted Zone
# -----------------------------------------------------------------------------

resource "aws_route53_zone" "main" {
  name    = var.domain
  comment = "Managed by Terraform — ${var.domain}"

  tags = {
    Project = "sharpei"
    Domain  = var.domain
  }
}

# -----------------------------------------------------------------------------
# ACM Certificate (covers apex + wildcard)
# -----------------------------------------------------------------------------

resource "aws_acm_certificate" "main" {
  domain_name               = var.domain
  subject_alternative_names = ["*.${var.domain}"]
  validation_method         = "DNS"

  tags = {
    Project = "sharpei"
    Domain  = var.domain
  }

  lifecycle {
    create_before_destroy = true
  }
}

# -----------------------------------------------------------------------------
# DNS Validation Records
# -----------------------------------------------------------------------------

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = aws_route53_zone.main.zone_id
  name            = each.value.name
  type            = each.value.type
  ttl             = 300
  records         = [each.value.record]
  allow_overwrite = true
}

# -----------------------------------------------------------------------------
# Wait for Validation
# -----------------------------------------------------------------------------

resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}
