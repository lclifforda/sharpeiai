################################################################################
# Amplify Module
# Creates the Amplify app connected to GitHub, branch deployment, custom domain,
# and SPA rewrite rule for the Sharpei web frontend.
################################################################################

locals {
  app_name = "${var.project}-${var.environment}-web"
}

# -----------------------------------------------------------------------------
# Amplify App
# -----------------------------------------------------------------------------

resource "aws_amplify_app" "web" {
  name       = local.app_name
  repository = var.github_repo_url

  access_token = var.github_access_token

  platform = "WEB"

  # Monorepo: the frontend lives under sharpei/ in the repo
  build_spec = <<-YAML
    version: 1
    applications:
      - appRoot: sharpei
        frontend:
          phases:
            preBuild:
              commands:
                - npm install -g pnpm
                - pnpm install --frozen-lockfile
            build:
              commands:
                - pnpm turbo build --filter=@sharpei/web
          artifacts:
            baseDirectory: apps/web/dist
            files:
              - '**/*'
          cache:
            paths:
              - node_modules/**/*
              - .turbo/**/*
  YAML

  environment_variables = {
    VITE_API_URL            = var.api_url
    VITE_SUPABASE_URL       = var.supabase_url
    VITE_SUPABASE_ANON_KEY  = var.supabase_anon_key
  }

  # Serve actual files (js, css, images, etc.) as-is
  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|jpeg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>"
    target = "/index.html"
    status = "200"
  }

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# Branch — main (PRODUCTION)
# -----------------------------------------------------------------------------

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.web.id
  branch_name = "main"

  stage = "PRODUCTION"

  framework = "React"

  enable_auto_build = true

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# -----------------------------------------------------------------------------
# Custom Domain
# -----------------------------------------------------------------------------

resource "aws_amplify_domain_association" "custom" {
  count       = var.domain != "" ? 1 : 0
  app_id      = aws_amplify_app.web.id
  domain_name = var.domain

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = ""
  }

  sub_domain {
    branch_name = aws_amplify_branch.main.branch_name
    prefix      = "www"
  }

  wait_for_verification = false
}
