<?php

namespace App\Exception;

class JobOfferNotActiveException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('This job offer is no longer active.');
    }
}
