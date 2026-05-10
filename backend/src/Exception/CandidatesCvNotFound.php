<?php

namespace App\Exception;

class CandidatesCvNotFound extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('CV not found.');
    }
}
