<?php

namespace App\Dto\Candidate;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateCandidateDto
{
    public function __construct(
        #[Assert\NotBlank(message: 'Field "fullName" is required.')]
        #[Assert\Length(max: 100)]
        public string $fullName,

        #[Assert\Length(max: 20)]
        public ?string $phone = null,
    ) {}
}
