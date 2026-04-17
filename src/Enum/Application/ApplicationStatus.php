<?php

namespace App\Enum\Application;

enum ApplicationStatus: string
{
    case PENDING = 'pending';
    case REVIEWED = 'reviewed';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
