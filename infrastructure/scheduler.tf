resource "aws_iam_role" "scheduler" {
  name = "${var.app_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "scheduler" {
  name = "${var.app_name}-scheduler-policy"
  role = aws_iam_role.scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["ecs:UpdateService"]
        Resource = [
          aws_ecs_service.backend.id,
          aws_ecs_service.worker.id
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "rds:StopDBInstance",
          "rds:StartDBInstance"
        ]
        Resource = aws_db_instance.postgres.arn
      }
    ]
  })
}

resource "aws_scheduler_schedule" "stop_backend" {
  name = "${var.app_name}-stop-backend"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(0 0 * * ? *)"
  schedule_expression_timezone = "Europe/Warsaw"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ecs:updateService"
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      Cluster      = aws_ecs_cluster.main.name
      Service      = aws_ecs_service.backend.name
      DesiredCount = 0
    })
  }
}

resource "aws_scheduler_schedule" "stop_worker" {
  name = "${var.app_name}-stop-worker"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(0 0 * * ? *)"
  schedule_expression_timezone = "Europe/Warsaw"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ecs:updateService"
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      Cluster      = aws_ecs_cluster.main.name
      Service      = aws_ecs_service.worker.name
      DesiredCount = 0
    })
  }
}

resource "aws_scheduler_schedule" "start_backend" {
  name = "${var.app_name}-start-backend"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(0 7 * * ? *)"
  schedule_expression_timezone = "Europe/Warsaw"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ecs:updateService"
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      Cluster      = aws_ecs_cluster.main.name
      Service      = aws_ecs_service.backend.name
      DesiredCount = 1
    })
  }
}

resource "aws_scheduler_schedule" "start_worker" {
  name = "${var.app_name}-start-worker"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(0 7 * * ? *)"
  schedule_expression_timezone = "Europe/Warsaw"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:ecs:updateService"
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      Cluster      = aws_ecs_cluster.main.name
      Service      = aws_ecs_service.worker.name
      DesiredCount = 1
    })
  }
}

resource "aws_scheduler_schedule" "stop_rds" {
  name = "${var.app_name}-stop-rds"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(5 0 * * ? *)"
  schedule_expression_timezone = "Europe/Warsaw"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:rds:stopDBInstance"
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      DbInstanceIdentifier = aws_db_instance.postgres.identifier
    })
  }
}

resource "aws_scheduler_schedule" "start_rds" {
  name = "${var.app_name}-start-rds"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "cron(50 6 * * ? *)"
  schedule_expression_timezone = "Europe/Warsaw"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:rds:startDBInstance"
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      DbInstanceIdentifier = aws_db_instance.postgres.identifier
    })
  }
}