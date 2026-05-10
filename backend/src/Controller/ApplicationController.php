<?php

namespace App\Controller;

use App\Dto\Application\CreateApplicationDto;
use App\Dto\Application\OverrideMatchDto;
use App\Entity\Application;
use App\Entity\JobOffer;
use App\Entity\User;
use App\Enum\Application\ApplicationStatus;
use App\Repository\ApplicationRepository;
use App\Security\Voter\ApplicationVoter;
use App\Service\ApplicationService;
use App\Service\PaginatorService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ApplicationController extends AbstractController
{
    public function __construct(
        private readonly ApplicationService    $applicationService,
        private readonly ApplicationRepository $applicationRepository,
        private readonly PaginatorService      $paginatorService,
    ) {}

    #[Route('/applications', methods: ['POST'])]
    public function apply(
        #[MapRequestPayload] CreateApplicationDto $dto,
    ): JsonResponse {
        $this->denyAccessUnlessGranted(ApplicationVoter::APPLY);

        /** @var User $user */
        $user = $this->getUser();

        $application = $this->applicationService->apply($dto, $user);

        return $this->json($application, 201, context: ['groups' => ['application:read']]);
    }

    #[Route('/applications/my', methods: ['GET'])]
    public function myApplications(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(ApplicationVoter::APPLY);

        /** @var User $user */
        $user = $this->getUser();

        $page  = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));

        $candidate = $user->getCandidate();

        if (!$candidate) {
            return $this->json(['message' => 'Candidate profile not found.'], 404);
        }

        $qb = $this->applicationRepository->findByCandidate($candidate);

        return $this->json(
            $this->paginatorService->paginate($qb, $page, $limit),
            context: ['groups' => ['application:read', 'application:jobOffer']]
        );
    }

    #[Route('/job-offers/{id}/applications', methods: ['GET'])]
    public function jobOfferApplications(JobOffer $jobOffer, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(ApplicationVoter::VIEW, $jobOffer);

        $page  = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));

        $qb = $this->applicationRepository->findByJobOffer($jobOffer);

        return $this->json(
            $this->paginatorService->paginate($qb, $page, $limit),
            context: ['groups' => ['application:read', 'application:candidate']]
        );
    }

    #[Route('/applications/{id}/candidate', methods: ['GET'])]
    public function candidateProfile(Application $application): JsonResponse
    {
        $this->denyAccessUnlessGranted(ApplicationVoter::OVERRIDE, $application);

        return $this->json(
            $application->getCandidate(),
            context: ['groups' => ['candidate:read']]
        );
    }

    #[Route('/applications/{id}/override', methods: ['PATCH'])]
    public function override(
        Application $application,
        #[MapRequestPayload] OverrideMatchDto $dto,
    ): JsonResponse {
        $this->denyAccessUnlessGranted(ApplicationVoter::OVERRIDE, $application);

        return $this->json(
            $this->applicationService->override($application, $dto),
            context: ['groups' => ['application:read']]
        );
    }

    #[Route('/applications/{id}/status', methods: ['PATCH'])]
    public function updateStatus(Application $application, Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(ApplicationVoter::OVERRIDE, $application);

        $data = json_decode($request->getContent(), true);
        $status = ApplicationStatus::from($data['status']);

        $application->setStatus($status);
        $this->applicationRepository->save($application);

        return $this->json($application, context: ['groups' => ['application:read']]);
    }
}
