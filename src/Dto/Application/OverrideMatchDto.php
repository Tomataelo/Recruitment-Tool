<?php

namespace App\Dto\Application;

use App\Enum\Application\MatchLevel;
use Symfony\Component\Validator\Constraints as Assert;

readonly class OverrideMatchDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Choice(
            callback: [MatchLevel::class, 'values'],
            message: 'Field "matchLevel" must be one of: strong, partial, no_match.'
        )]
        public string $matchLevel,

        public ?string $recruiterNote = null,
    ) {}
}
