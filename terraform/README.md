# Terraform EKS Setup

This folder creates a production-minded Amazon EKS cluster in `us-east-1` using:

- `terraform-aws-modules/vpc/aws`
- `terraform-aws-modules/eks/aws`

The code is designed to stay simple while still following safer defaults:

- worker nodes run in private subnets
- EKS API access is restricted by CIDR
- Kubernetes secrets are encrypted with KMS
- control plane logs go to CloudWatch
- IRSA is enabled
- deletion protection is enabled on the cluster

## Files

- `versions.tf` -> Terraform and provider version pinning
- `providers.tf` -> AWS provider configuration
- `variables.tf` -> all configurable inputs
- `locals.tf` -> naming, tags, and subnet calculations
- `main.tf` -> VPC and EKS modules
- `outputs.tf` -> important outputs after apply
- `terraform.tfvars.example` -> values you should copy and customize
- `backend-s3.tf.example` -> optional remote state example for production
- `.gitignore` -> prevents state and secrets from being committed

## What You Must Update

Before you run Terraform, copy the example values file:

```powershell
cd c:\xampp\htdocs\FOOD-ORDERING-SYS\terraform
Copy-Item terraform.tfvars.example terraform.tfvars
```

Then update these values in `terraform.tfvars`:

- `cluster_name`
- `cluster_endpoint_public_access_cidrs`
- `cluster_admin_principal_arn` if you want a second admin principal
- `tags.Owner`
- node size/type values if needed

## Optional But Recommended For Production

Use remote state in S3:

1. Copy `backend-s3.tf.example` to `backend.tf`
2. Update the bucket, key, and lock table names
3. Run `terraform init -reconfigure`

## Commands

Initialize Terraform:

```powershell
terraform init
```

Check formatting:

```powershell
terraform fmt -recursive
```

Validate the configuration:

```powershell
terraform validate
```

Preview the deployment:

```powershell
terraform plan -out tfplan
```

Create the EKS platform:

```powershell
terraform apply tfplan
```

After the cluster is created, configure `kubectl`:

```powershell
aws eks update-kubeconfig --region us-east-1 --name <your-cluster-name>
```

Destroy everything later if needed:

```powershell
terraform destroy
```

## Notes

- The default setup creates a new VPC dedicated to EKS.
- The node group uses `ON_DEMAND` capacity for more stable production behavior.
- `single_nat_gateway = false` is more resilient but costs more.
- The default CIDR values are only examples. Adjust them to your network plan.
- No AWS credentials are stored in this folder. Use AWS CLI profiles, environment variables, or an IAM role.
