data "aws_availability_zones" "available" {
  state = "available"

  # Keeps the deployment on standard AZs that are generally available.
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

data "aws_partition" "current" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.5.1"

  # Update this name if your organization uses a naming convention.
  name = "${local.name_prefix}-vpc"
  cidr = var.vpc_cidr

  azs             = local.selected_azs
  public_subnets  = local.public_subnet_cidrs
  private_subnets = local.private_subnet_cidrs

  enable_dns_support   = true
  enable_dns_hostnames = true

  # NAT gateways let private worker nodes reach the internet for package/image pulls.
  enable_nat_gateway = true
  single_nat_gateway = var.single_nat_gateway

  # Production-friendly default:
  # - false => one NAT gateway per AZ for better availability
  # - true  => one shared NAT gateway to reduce cost
  one_nat_gateway_per_az = var.single_nat_gateway ? false : true

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                      = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"             = "1"
  }

  tags = local.common_tags
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.14.0"

  # Change this if you want a custom cluster name.
  name               = local.cluster_name
  kubernetes_version = var.cluster_version

  authentication_mode = "API_AND_CONFIG_MAP"
  deletion_protection = true

  # Good default for real environments:
  # - private access enabled for workloads inside the VPC
  # - public access enabled only for the CIDR ranges you allow below
  endpoint_private_access                  = true
  endpoint_public_access                   = true
  endpoint_public_access_cidrs             = var.cluster_endpoint_public_access_cidrs
  enable_cluster_creator_admin_permissions = true

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.private_subnets
  control_plane_subnet_ids = module.vpc.private_subnets

  # Enable the standard EKS managed addons.
  addons = {
    coredns = {}
    eks-pod-identity-agent = {
      before_compute = true
    }
    kube-proxy = {}
    vpc-cni = {
      before_compute = true
    }
  }

  # Encrypt Kubernetes secrets with a customer-managed KMS key.
  create_kms_key          = true
  enable_kms_key_rotation = true
  encryption_config = {
    resources = ["secrets"]
  }

  create_cloudwatch_log_group            = true
  cloudwatch_log_group_retention_in_days = var.cloudwatch_log_retention_days
  enabled_log_types                      = var.cluster_enabled_log_types

  enable_irsa = true

  # Optional: grant another IAM role or user cluster-admin access.
  access_entries = var.cluster_admin_principal_arn == null ? {} : {
    additional-admin = {
      principal_arn = var.cluster_admin_principal_arn

      policy_associations = {
        cluster-admin = {
          policy_arn = "arn:${data.aws_partition.current.partition}:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
          access_scope = {
            type = "cluster"
          }
        }
      }
    }
  }

  eks_managed_node_groups = {
    default = {
      # Starting with newer EKS versions, AL2023 is the recommended managed node OS.
      ami_type       = "AL2023_x86_64_STANDARD"
      instance_types = var.node_instance_types
      capacity_type  = var.node_capacity_type

      min_size     = var.node_min_size
      max_size     = var.node_max_size
      desired_size = var.node_desired_size
      disk_size    = var.node_disk_size

      # Keep nodes private. They will live in the VPC private subnets above.
      subnet_ids = module.vpc.private_subnets

      labels = {
        workload = "general"
      }

      tags = {
        Name = "${local.cluster_name}-default-node-group"
      }
    }
  }

  tags = local.common_tags
}
