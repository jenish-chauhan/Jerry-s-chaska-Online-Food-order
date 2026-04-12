provider "aws" {
  # The user asked for an EKS cluster in us-east-1.
  # If you need another region later, update `aws_region` in terraform.tfvars.
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}
