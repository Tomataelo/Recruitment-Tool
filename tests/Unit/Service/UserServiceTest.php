<?php

namespace App\Tests\Unit\Service;

use App\DTO\Auth\RegisterUserDto;
use App\Entity\User;
use App\Enum\User\UserRole;
use App\Exception\UserAlreadyExistsException;
use App\Repository\UserRepository;
use App\Service\UserService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserServiceTest extends TestCase
{
    private UserService $userService;
    private UserRepository&MockObject $userRepository;
    private UserPasswordHasherInterface&MockObject $passwordHasher;

    protected function setUp(): void
    {
        $this->userRepository = $this->createMock(UserRepository::class);
        $this->passwordHasher = $this->createMock(UserPasswordHasherInterface::class);

        $this->userService = new UserService(
            $this->userRepository,
            $this->passwordHasher,
        );
    }

    public function testRegisterCreatesUserSuccessfully(): void
    {
        $dto = new RegisterUserDto(
            email: 'test@example.com',
            password: 'haslo1234',
            role: 'ROLE_CANDIDATE',
        );

        $this->userRepository
            ->expects($this->once())
            ->method('findByEmail')
            ->with('test@example.com')
            ->willReturn(null);

        $this->passwordHasher
            ->expects($this->once())
            ->method('hashPassword')
            ->willReturn('hashed_password');

        $this->userRepository
            ->expects($this->once())
            ->method('save');

        $user = $this->userService->register($dto);

        $this->assertInstanceOf(User::class, $user);
        $this->assertSame('test@example.com', $user->getEmail());
        $this->assertSame(UserRole::CANDIDATE, $user->getRole());
        $this->assertSame('hashed_password', $user->getPassword());
    }

    public function testRegisterThrowsExceptionWhenUserAlreadyExists(): void
    {
        $dto = new RegisterUserDto(
            email: 'existing@example.com',
            password: 'haslo1234',
            role: 'ROLE_CANDIDATE',
        );

        $this->userRepository
            ->expects($this->once())
            ->method('findByEmail')
            ->with('existing@example.com')
            ->willReturn(new User());

        $this->passwordHasher
            ->expects($this->never())
            ->method('hashPassword');

        $this->expectException(UserAlreadyExistsException::class);

        $this->userService->register($dto);
    }

    public function testRegisterHashesPassword(): void
    {
        $dto = new RegisterUserDto(
            email: 'test@example.com',
            password: 'plaintext_password',
            role: 'ROLE_RECRUITER',
        );

        $this->userRepository
            ->method('findByEmail')
            ->willReturn(null);

        $this->passwordHasher
            ->expects($this->once())
            ->method('hashPassword')
            ->willReturn('hashed_password');

        $this->userRepository
            ->expects($this->once())
            ->method('save');

        $user = $this->userService->register($dto);

        $this->assertSame('hashed_password', $user->getPassword());
        $this->assertNotSame('plaintext_password', $user->getPassword());
    }
}
