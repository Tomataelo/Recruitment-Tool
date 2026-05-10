<?php

namespace App\Message;

readonly class ScoreCandidateMessage
{
    public function __construct(
        public int $applicationId,
    ) {}
}
