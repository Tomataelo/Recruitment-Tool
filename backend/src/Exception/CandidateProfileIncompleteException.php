<?php

namespace App\Exception;

class CandidateProfileIncompleteException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('You must upload your CV before applying.');
    }
}
