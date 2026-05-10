<?php

namespace App\Exception;

class ApplicationAlreadyExistsException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct('You have already applied for this job offer.');
    }
}
