#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/deploy-cognito.sh [stack-name] [project-name] [admin-group]
# Defaults: stack-name=karoo-lodge-cognito, project-name=karoo-lodge, admin-group=admin

STACK_NAME=${1:-karoo-lodge-cognito}
PROJECT_NAME=${2:-karoo-lodge}
ADMIN_GROUP=${3:-admin}
TEMPLATE="infra/cognito-stack.yaml"

if ! command -v aws >/dev/null 2>&1; then
  echo "aws CLI is required. Install it then authenticate with AWS credentials." >&2
  exit 1
fi

REGION=${AWS_REGION:-${AWS_DEFAULT_REGION:-}}
if [[ -z "${REGION}" ]]; then
  echo "Set AWS_REGION or AWS_DEFAULT_REGION before running this script." >&2
  exit 1
fi

echo "Deploying Cognito stack '${STACK_NAME}' in region ${REGION}..."

aws cloudformation deploy \
  --stack-name "${STACK_NAME}" \
  --template-file "${TEMPLATE}" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides ProjectName="${PROJECT_NAME}" AdminGroupName="${ADMIN_GROUP}" \
  --region "${REGION}"

./scripts/export-cognito-env.sh "${STACK_NAME}" .env.cognito

echo "Deployment complete. Merge .env.cognito into your backend/frontend environment files." >&2
