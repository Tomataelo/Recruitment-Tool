<?php

namespace App\Enum\Application;

enum matchLevel: string
{
    case STRONG = 'strong';
    case PARTIAL = 'partial';
    case NO_MATCH = 'no_match';
}
