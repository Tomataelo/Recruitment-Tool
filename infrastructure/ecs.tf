resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.app_name}-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.app_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_task_s3" {
  name = "${var.app_name}-ecs-s3-policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.cv_storage.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "ecs_task_exec" {
  name = "${var.app_name}-ecs-exec-policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssmmessages:CreateControlChannel",
          "ssmmessages:CreateDataChannel",
          "ssmmessages:OpenControlChannel",
          "ssmmessages:OpenDataChannel"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_security_group" "ecs" {
  name = "${var.app_name}-ecs-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.app_name}-backend"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "worker" {
  name              = "/ecs/${var.app_name}-worker"
  retention_in_days = 7
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.app_name}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "nginx"
      image = "${aws_ecr_repository.nginx.repository_url}:latest"

      portMappings = [
        {
          containerPort = 80
          protocol      = "tcp"
        }
      ]

      dependsOn = [
        {
          containerName = "backend"
          condition     = "START"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "nginx"
        }
      }
    },
    {
      name  = "backend"
      image = "${aws_ecr_repository.backend.repository_url}:latest"

      portMappings = [
        {
          containerPort = 9000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "APP_ENV",             value = "prod" },
        { name = "APP_SECRET",          value = var.jwt_secret },
        { name = "DATABASE_URL",        value = "postgresql://recruitment:${var.db_password}@${aws_db_instance.postgres.endpoint}/recruitment?serverVersion=16" },
        { name = "ELASTICSEARCH_URL",   value = "http://localhost:9200" },
        { name = "CLAUDE_API_KEY",      value = var.claude_api_key },
        { name = "AWS_BUCKET_NAME",     value = aws_s3_bucket.cv_storage.bucket },
        { name = "AWS_DEFAULT_REGION",  value = var.aws_region },
        { name = "CORS_ALLOW_ORIGIN",   value = "https://www.recruitment-tool.pl" },
        { name = "DEFAULT_URI", value = "http://localhost" },
        { name = "JWT_SECRET_KEY", value = "/app/config/jwt/private.pem" },
        { name = "JWT_PUBLIC_KEY", value = "/app/config/jwt/public.pem" },
        { name = "JWT_SECRET_KEY_CONTENT", value = var.jwt_secret_key },
        { name = "JWT_PUBLIC_KEY_CONTENT", value = var.jwt_public_key },
        { name = "JWT_PASSPHRASE", value = "e1d4c6fec2ecf3e4e98eb6a8182dffcd4142b080bbac3306d9aca5d6fa8721fe" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "backend"
        }
      }
    },
    {
      name  = "elasticsearch"
      image = "docker.elastic.co/elasticsearch/elasticsearch:8.11.0"

      environment = [
        { name = "discovery.type",         value = "single-node" },
        { name = "xpack.security.enabled", value = "false" },
        { name = "ES_JAVA_OPTS",           value = "-Xms256m -Xmx256m" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "elasticsearch"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "backend" {
  name            = "${var.app_name}-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  enable_execute_command = true

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "nginx"
    container_port   = 80
  }

  depends_on = [aws_lb_listener.https]
}

resource "aws_ecs_task_definition" "worker" {
  family                   = "${var.app_name}-worker"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name    = "worker"
      image   = "${aws_ecr_repository.backend.repository_url}:latest"
      command = ["php", "bin/console", "messenger:consume", "async", "--memory-limit=256M", "-vv"]

      environment = [
        { name = "APP_ENV",            value = "prod" },
        { name = "APP_SECRET",         value = var.jwt_secret },
        { name = "DATABASE_URL",       value = "postgresql://recruitment:${var.db_password}@${aws_db_instance.postgres.endpoint}/recruitment?serverVersion=16" },
        { name = "ELASTICSEARCH_URL",  value = "http://localhost:9200" },
        { name = "CLAUDE_API_KEY",     value = var.claude_api_key },
        { name = "AWS_BUCKET_NAME",    value = aws_s3_bucket.cv_storage.bucket },
        { name = "AWS_DEFAULT_REGION", value = var.aws_region },
        { name = "DEFAULT_URI", value = "http://localhost" },
        { name = "JWT_PASSPHRASE", value = "" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.worker.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "worker"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "worker" {
  name            = "${var.app_name}-worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }
}