locals {
  # If you do not provide an explicit cluster name, Terraform builds one
  # automatically from the project and environment.
  name_prefix  = "${var.project_name}-${var.environment}"
  cluster_name = trimspace(var.cluster_name) != "" ? var.cluster_name : "${local.name_prefix}-eks"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.tags
  )

  # Create simple, predictable public/private subnet ranges from the VPC CIDR.
  # Example with the default VPC CIDR 10.30.0.0/16:
  # - public  subnets become 10.30.0.0/20, 10.30.16.0/20, 10.30.32.0/20
  # - private subnets become 10.30.48.0/20, 10.30.64.0/20, 10.30.80.0/20
  selected_azs = slice(data.aws_availability_zones.available.names, 0, var.availability_zone_count)

  public_subnet_cidrs = [
    for index in range(var.availability_zone_count) :
    cidrsubnet(var.vpc_cidr, 4, index)
  ]

  private_subnet_cidrs = [
    for index in range(var.availability_zone_count) :
    cidrsubnet(var.vpc_cidr, 4, index + var.availability_zone_count)
  ]
}
