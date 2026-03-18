################################################################################
# DNS Module — Variables
################################################################################

variable "domain" {
  description = "Root domain for the hosted zone and ACM certificate."
  type        = string
  default     = "sharpei.ai"
}
