<?php

namespace App\Dto\JobOffer;

use App\Enum\JobOffer\WorkMode;
use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateJobOfferDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 255)]
        public string $title,

        #[Assert\NotBlank]
        public string $description,

        #[Assert\NotBlank]
        #[Assert\Type('array')]
        public array $requirements,

        #[Assert\NotBlank]
        #[Assert\Positive]
        public int $experienceMin,

        #[Assert\Length(max: 255)]
        public ?string $location,

        #[Assert\NotBlank]
        #[Assert\Choice(
            callback: [WorkMode::class, 'values'],
            message: 'Field "workMode" must be one of: remote, hybrid, onsite.'
        )]
        public string $workMode,
    ) {}
}
