<?php

namespace App\Dto\JobOffer;

use App\Enum\JobOffer\WorkMode;
use App\Enum\JobOffer\JobOfferStatus;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateJobOfferDto
{
    public function __construct(
        #[Assert\Length(max: 255)]
        public ?string $title = null,

        public ?string $description = null,

        #[Assert\Type('array')]
        public ?array $requirements = null,

        #[Assert\Positive]
        public ?int $experienceMin = null,

        #[Assert\Length(max: 255)]
        public ?string $location = null,

        #[Assert\Choice(
            callback: [WorkMode::class, 'values'],
            message: 'Field "workMode" must be one of: remote, hybrid, onsite.'
        )]
        public ?string $workMode = null,

        #[Assert\Choice(
            callback: [JobOfferStatus::class, 'values'],
            message: 'Field "status" must be one of: active, closed.'
        )]
        public ?string $status = null,
    ) {}
}
