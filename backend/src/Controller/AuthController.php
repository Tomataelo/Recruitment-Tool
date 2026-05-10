<?php

namespace App\Controller;

use App\Dto\Auth\RegisterUserDto;
use App\Service\UserService;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/auth')]
class AuthController extends AbstractController
{
    #[Route('/register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterUserDto $dto,
        UserService $userService,
        JWTTokenManagerInterface $jwtManager,
    ): JsonResponse
    {
        $user = $userService->register($dto);

        return $this->json([
            'token' => $jwtManager->create($user),
            'user'  => [
                'id'    => $user->getId(),
                'email' => $user->getEmail(),
                'role'  => $user->getRole()->value,
            ],
        ], 201);
    }
}
