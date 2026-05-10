<?php

namespace App\Dto\Auth;

use App\Enum\User\UserRole;
use Symfony\Component\Validator\Constraints as Assert;

readonly class RegisterUserDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,

        #[Assert\NotBlank]
        #[Assert\Length(min: 8)]
        public string $password,

        #[Assert\NotBlank]
        #[Assert\Choice(
            callback: [UserRole::class, 'values'],
            message: 'Field "role" must be one of: ROLE_RECRUITER, ROLE_CANDIDATE.'
        )]
        public string $role,
    ) {}
}
