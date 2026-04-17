<?php

namespace App\Enum\JobOffer;

enum WorkMode: string
{
    case REMOTE = 'remote';
    case HYBRID = 'hybrid';
    case ONSITE = 'onsite';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
