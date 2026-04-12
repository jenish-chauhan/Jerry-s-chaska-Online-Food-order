variable "aws_region" {
  description = "AWS region where the EKS cluster and networking resources will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short project name used in resource naming and tags."
  type        = string
  default     = "food-ordering"
}

variable "environment" {
  description = "Environment name such as dev, stage, or prod."
  type        = string
  default     = "prod"
}

variable "cluster_name" {
  description = "Exact EKS cluster name. Leave empty to auto-generate from project_name and environment."
  type        = string
  default     = "jerry-chaska-eks-cluster"
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS control plane."
  type        = string
  default     = "1.33"
}

variable "availability_zone_count" {
  description = "How many Availability Zones to use inside us-east-1. Three is a good production default."
  type        = number
  default     = 3

  validation {
    condition     = var.availability_zone_count >= 2 && var.availability_zone_count <= 4
    error_message = "availability_zone_count must be between 2 and 4."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC that will host the EKS cluster."
  type        = string
  default     = "10.30.0.0/16"
}

variable "cluster_endpoint_public_access_cidrs" {
  description = "CIDR blocks allowed to reach the public EKS API endpoint. Replace the example with your office, VPN, or bastion public IP range."
  type        = list(string)
  default     = ["203.0.113.10/32"]

  validation {
    condition     = length(var.cluster_endpoint_public_access_cidrs) > 0
    error_message = "Provide at least one CIDR block for EKS API access."
  }
}

variable "cluster_admin_principal_arn" {
  description = "Optional IAM principal ARN to grant cluster-admin access. Leave null if the Terraform caller should be the only initial admin."
  type        = string
  default     = null
  nullable    = true
}

variable "node_instance_types" {
  description = "EC2 instance types for the EKS managed node group."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_capacity_type" {
  description = "Capacity type for the EKS managed node group. Use ON_DEMAND for predictable production behavior."
  type        = string
  default     = "ON_DEMAND"

  validation {
    condition     = contains(["ON_DEMAND", "SPOT"], var.node_capacity_type)
    error_message = "node_capacity_type must be ON_DEMAND or SPOT."
  }
}

variable "node_desired_size" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Maximum number of worker nodes."
  type        = number
  default     = 4
}

variable "node_disk_size" {
  description = "Root disk size in GiB for each worker node."
  type        = number
  default     = 50
}

variable "single_nat_gateway" {
  description = "Set to true only if you want to reduce cost and accept a single NAT gateway as a failure point."
  type        = bool
  default     = false
}

variable "cloudwatch_log_retention_days" {
  description = "Retention period for EKS control plane logs."
  type        = number
  default     = 30
}

variable "cluster_enabled_log_types" {
  description = "EKS control plane logs to send to CloudWatch."
  type        = list(string)
  default     = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

variable "tags" {
  description = "Additional tags to apply to all supported resources."
  type        = map(string)
  default     = {}
}
