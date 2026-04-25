<?php

namespace App\Dto\Candidate;

use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateCandidateDto
{
    public function __construct(
        #[Assert\Length(max: 100)]
        public ?string $fullName = null,

        #[Assert\Length(max: 20)]
        public ?string $phone = null,

        #[Assert\Type('array')]
        public ?array $skills = null,

        #[Assert\Positive]
        public ?int $experienceMonths = null,

        #[Assert\Type('array')]
        public ?array $languages = null,

        public ?string $summary = null,
    ) {}
}
