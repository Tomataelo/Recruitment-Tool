<?php

namespace App\EventListener;

use App\Exception\CandidateAlreadyExistsException;
use App\Exception\CandidateNotFoundException;
use App\Exception\UserAlreadyExistsException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

#[AsEventListener(event: 'kernel.exception')]
class ExceptionListener
{
    private const array CUSTOM_EXCEPTION_MAP = [
        CandidateNotFoundException::class          => 404,
        UserAlreadyExistsException::class          => 409,
        CandidateAlreadyExistsException::class     => 409
    ];

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof HttpExceptionInterface) {
            $event->setResponse(new JsonResponse([
                'message' => $exception->getMessage() ?: $this->getDefaultMessage($exception->getStatusCode()),
            ], $exception->getStatusCode()));
            return;
        }

        $statusCode = self::CUSTOM_EXCEPTION_MAP[$exception::class] ?? null;
        if ($statusCode === null) {
            return;
        }

        $event->setResponse(new JsonResponse([
            'message' => $exception->getMessage(),
        ], $statusCode));
    }

    private function getDefaultMessage(int $statusCode): string
    {
        return match ($statusCode) {
            400 => 'Bad request.',
            401 => 'Unauthorized.',
            403 => 'Access denied.',
            404 => 'Resource not found.',
            405 => 'Method not allowed.',
            422 => 'Unprocessable entity.',
            500 => 'Internal server error.',
            default => 'An error occurred.',
        };
    }
}
