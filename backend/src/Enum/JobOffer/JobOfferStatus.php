<?php

namespace App\Enum\JobOffer;

enum JobOfferStatus: string
{
    case ACTIVE = 'active';
    case CLOSED = 'closed';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
