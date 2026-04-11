<?php

namespace App\Enum\JobOffer;

enum JobOfferStatus: string
{
    case ACTIVE = 'active';
    case CLOSED = 'closed';
}
