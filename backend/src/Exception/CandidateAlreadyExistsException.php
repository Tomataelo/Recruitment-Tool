<?php

namespace App\Exception;

class CandidateAlreadyExistsException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('Candidate profile already exists for this user.');
    }
}
