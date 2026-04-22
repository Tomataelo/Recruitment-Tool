<?php

namespace App\Exception;

class CandidateNotFoundException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('Candidate profile not found.');
    }
}
