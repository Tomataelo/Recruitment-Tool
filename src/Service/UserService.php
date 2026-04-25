<?php

namespace App\Service;

use App\Dto\Auth\RegisterUserDto;
use App\Entity\User;
use App\Enum\User\UserRole;
use App\Exception\UserAlreadyExistsException;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

readonly class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher,
    ){}

    public function register(RegisterUserDto $registerUserDto): User
    {
        if ($this->isUserExistsByEmail($registerUserDto->email)) {
            throw new UserAlreadyExistsException($registerUserDto->email);
        }

        $newUser = new User();
        $newUser->setEmail($registerUserDto->email);
        $newUser->setPassword($this->passwordHasher->hashPassword($newUser, $registerUserDto->password));
        $newUser->setRole(UserRole::from($registerUserDto->role));
        $this->userRepository->save($newUser);

        return $newUser;
    }

    public function isUserExistsByEmail(string $email): bool
    {
        return $this->userRepository->findByEmail($email) !== null;
    }
}
