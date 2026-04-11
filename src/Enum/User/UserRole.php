<?php

namespace App\Enum\User;

enum UserRole: string
{
    case RECRUITER = 'ROLE_RECRUITER';
    case CANDIDATE = 'ROLE_CANDIDATE';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
