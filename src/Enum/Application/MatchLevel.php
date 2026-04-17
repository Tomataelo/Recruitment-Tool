<?php

namespace App\Enum\Application;

enum MatchLevel: string
{
    case STRONG = 'strong';
    case PARTIAL = 'partial';
    case NO_MATCH = 'no_match';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
