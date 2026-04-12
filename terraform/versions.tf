terraform {
  # Terraform 1.5.7+ is required by the pinned EKS module version used here.
  required_version = ">= 1.5.7"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      # Keep the provider on the AWS 6.x line that the current EKS module expects.
      version = "~> 6.28"
    }
  }
}
