<?php

namespace App\Enum\Application;

enum ApplicationStatus: string
{
    case PENDING = 'pending';
    case AI_REVIEWED = 'ai_reviewed';
    case REVIEWED = 'reviewed';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
