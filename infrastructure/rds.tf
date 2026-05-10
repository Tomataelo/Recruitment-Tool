resource "aws_db_instance" "postgres" {
  identifier        = "${var.app_name}-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = "recruitment"
  username = "recruitment"
  password = var.db_password

  publicly_accessible    = true
  skip_final_snapshot    = true
  deletion_protection    = false

  vpc_security_group_ids = [aws_security_group.rds.id]

  tags = {
    Name = "${var.app_name}-db"
  }
}

resource "aws_security_group" "rds" {
  name = "${var.app_name}-rds-sg"

  ingress {
    from_port   = 5432
    to_port     = 5432
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

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}