<?php

namespace App\Enum\JobOffer;

enum WorkMode: string
{
    case REMOTE = 'remote';
    case HYBRID = 'hybrid';
    case ONSITE = 'onsite';
}
