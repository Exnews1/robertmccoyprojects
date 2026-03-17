# Meridian KMS Demo — AWS Deployment Guide

## What This Deploys

The Meridian Industrial Group Knowledge Management System demo, accessible at:

- `/research/knowledge-systems` — Landing page
- `/research/knowledge-systems/demo` — AI/Human-in-the-loop ingestion pipeline
- `/research/knowledge-systems/meridian` — KMS Portal (Document Library, AR, AP)

## AWS Services Required

| Service | Purpose | Estimated Monthly Cost |
|---|---|---|
| ECR | Container image registry | ~$0.10/GB |
| ECS Fargate | Run the app (0.5 vCPU / 1 GB RAM) | ~$15–25 |
| RDS PostgreSQL (t3.micro) | Database | ~$13–20 |
| ALB (Application Load Balancer) | HTTPS termination | ~$18 |
| ACM (Certificate Manager) | SSL/TLS certificate | Free |
| Secrets Manager | Store API keys | ~$1.20 |
| CloudWatch | Logs | ~$1–3 |

**Estimated total: ~$50–70/month** for a small demo environment.

---

## Step 1 — Prerequisites

Install and configure:
```bash
# AWS CLI
brew install awscli        # macOS
aws configure              # enter your Access Key ID, Secret, Region

# Docker Desktop
# Download from https://docker.com/products/docker-desktop
```

Set your variables (replace all caps values):
```bash
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="123456789012"
export ECR_REPO="meridian-kms-demo"
export IMAGE_TAG="latest"
```

---

## Step 2 — Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name meridian-kms-demo \
  --region $AWS_REGION
```

---

## Step 3 — Build and Push the Docker Image

From the **root of this project** (one level up from this `aws/` folder):

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build the image (takes 3-5 minutes on first run)
docker build -t meridian-kms-demo .

# Tag it for ECR
docker tag meridian-kms-demo:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG

# Push to ECR
docker push \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
```

---

## Step 4 — Create RDS PostgreSQL Database

```bash
# Create a DB subnet group first (needs 2+ subnets in different AZs)
aws rds create-db-subnet-group \
  --db-subnet-group-name meridian-kms-subnet \
  --db-subnet-group-description "Meridian KMS DB subnet group" \
  --subnet-ids subnet-XXXXXX subnet-YYYYYY

# Create the database instance
aws rds create-db-instance \
  --db-instance-identifier meridian-kms-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version "16" \
  --master-username meridian \
  --master-user-password YOUR_SECURE_DB_PASSWORD \
  --db-name meridian_kms \
  --allocated-storage 20 \
  --db-subnet-group-name meridian-kms-subnet \
  --no-publicly-accessible \
  --backup-retention-period 7
```

Wait ~5 minutes for the DB to become available, then note the endpoint:
```bash
aws rds describe-db-instances \
  --db-instance-identifier meridian-kms-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
# Output: meridian-kms-db.XXXX.us-east-1.rds.amazonaws.com
```

Your DATABASE_URL will be:
```
postgresql://meridian:YOUR_SECURE_DB_PASSWORD@meridian-kms-db.XXXX.us-east-1.rds.amazonaws.com:5432/meridian_kms
```

---

## Step 5 — Store Secrets in AWS Secrets Manager

```bash
# Database URL
aws secretsmanager create-secret \
  --name meridian-kms/database-url \
  --secret-string "postgresql://meridian:YOUR_PASSWORD@YOUR_RDS_ENDPOINT:5432/meridian_kms"

# Session secret (generate a random 64-char string)
aws secretsmanager create-secret \
  --name meridian-kms/session-secret \
  --secret-string "$(openssl rand -hex 32)"

# OpenAI API Key
aws secretsmanager create-secret \
  --name meridian-kms/openai-api-key \
  --secret-string "sk-proj-YOUR_OPENAI_KEY"
```

---

## Step 6 — Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name meridian-kms-cluster \
  --capacity-providers FARGATE \
  --region $AWS_REGION
```

---

## Step 7 — Register Task Definition

Update `task-definition.json` in this folder — replace all three placeholders:
- `ACCOUNT_ID` → your 12-digit AWS account ID
- `REGION` → e.g. `us-east-1`

Then register it:
```bash
aws ecs register-task-definition \
  --cli-input-json file://aws/task-definition.json
```

---

## Step 8 — Create ECS Service with Load Balancer

```bash
# Create target group
aws elbv2 create-target-group \
  --name meridian-kms-tg \
  --protocol HTTP \
  --port 5000 \
  --target-type ip \
  --vpc-id vpc-XXXXXXXX \
  --health-check-path /api/health \
  --health-check-interval-seconds 30

# Create the load balancer
aws elbv2 create-load-balancer \
  --name meridian-kms-alb \
  --subnets subnet-XXXXXX subnet-YYYYYY \
  --security-groups sg-XXXXXXXX \
  --scheme internet-facing

# Create HTTPS listener (requires ACM certificate)
aws elbv2 create-listener \
  --load-balancer-arn ALB_ARN \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=ACM_CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=TG_ARN

# Create the ECS service
aws ecs create-service \
  --cluster meridian-kms-cluster \
  --service-name meridian-kms-service \
  --task-definition meridian-kms-demo \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-XXXXXX],securityGroups=[sg-XXXXXXXX],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=TG_ARN,containerName=meridian-kms,containerPort=5000"
```

---

## Step 9 — Point Your Domain (Optional)

In Route 53 (or your DNS provider), create a CNAME record:
```
kms.yourdomain.com → meridian-kms-alb-XXXX.us-east-1.elb.amazonaws.com
```

---

## Step 10 — First Run (Database Tables)

The app creates all database tables automatically on first boot — no manual migrations needed.  
Financial records (400 AR/AP entries) are seeded automatically on startup.

Check the logs:
```bash
aws logs tail /ecs/meridian-kms-demo --follow
```

Look for:
```
Database tables verified/created.
serving on port 5000
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | YES | PostgreSQL connection string |
| `SESSION_SECRET` | YES | Random string for session signing |
| `OPENAI_API_KEY` | YES | Powers the AI classification engine |
| `PORT` | No (default 5000) | HTTP port |
| `NODE_ENV` | No (default production) | Environment flag |

---

## Local Testing with Docker

Test the full stack locally before pushing to AWS:

```bash
# From the project root
cp .env.example .env   # fill in your values

docker-compose -f aws/docker-compose.aws.yml up --build
# App is now at http://localhost:5000
# KMS Demo at http://localhost:5000/research/knowledge-systems
```

---

## Updating the App

Push a new image and force a new ECS deployment:
```bash
# Rebuild and push (from project root)
docker build -t meridian-kms-demo .
docker tag meridian-kms-demo:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest

# Force new deployment (zero-downtime rolling update)
aws ecs update-service \
  --cluster meridian-kms-cluster \
  --service meridian-kms-service \
  --force-new-deployment
```

---

## Architecture Diagram

```
Internet
    │
    ▼
[ALB – HTTPS 443] ──── ACM Certificate
    │
    ▼
[ECS Fargate Task]  ←── ECR Image
    │  (Node.js Express + React)
    │  0.5 vCPU / 1 GB RAM
    │
    ├── /api/meridian/*   (classification, staging, approval)
    ├── /api/health        (ALB health check)
    └── /* → React SPA
         │
         ▼
    [RDS PostgreSQL t3.micro]
         meridian_staging
         meridian_repository
         meridian_audit
         meridian_financials
```
