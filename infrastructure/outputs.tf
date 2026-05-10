output "backend_url" {
  description = "Backend API URL"
  value       = "Check ECS service public IP in AWS Console"
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}