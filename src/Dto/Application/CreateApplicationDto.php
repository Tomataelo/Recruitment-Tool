<?php

namespace App\Dto\Application;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateApplicationDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'Field "jobOfferId" is required.')]
        #[Assert\Positive]
        public int $jobOfferId,
    ) {}
}
