<?php

namespace App\Controller;

use App\Service\JobOfferService;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Enum\JobOffer\JobOfferStatus;
use App\Enum\User\UserRole;
use App\Entity\User;
use App\Entity\JobOffer;
use App\Security\Voter\JobOfferVoter;
use App\Dto\JobOffer\CreateJobOfferDto;
use App\Dto\JobOffer\UpdateJobOfferDto;

#[Route('/api/job-offers')]
class JobOfferController extends AbstractController
{
    public function __construct(
        private readonly JobOfferService $jobOfferService
    ){}

    #[Route('', methods: ['GET'])]
    public function getJobOffers(Request $request): JsonResponse
    {
        $page = $request->query->get('page', 1);
        $limit = $request->query->get('limit', 5);

        $user = $this->getUser();

        $status = JobOfferStatus::ACTIVE;
        if ($user instanceof User && $user->getRole() === UserRole::RECRUITER) {
            $status = null;
        }

        return $this->json(
            $this->jobOfferService->getPaginated($page, $limit, $status),
            context: ['groups' => ['jobOffer:read', 'jobOffer:write']]
        );
    }

    #[Route('/{id}', methods: ['GET'])]
    public function getJobOffer(JobOffer $jobOffer): JsonResponse
    {
        return $this->json($jobOffer, context: ['groups' => ['jobOffer:read']]);
    }

    #[Route('', methods: ['POST'])]
    public function createJobOffer(#[MapRequestPayload] CreateJobOfferDto $dto): JsonResponse
    {
        $this->denyAccessUnlessGranted(JobOfferVoter::CREATE);

        $jobOffer = $this->jobOfferService->create($dto, $this->getUser());

        return $this->json(
            $jobOffer, 201,
            context: ['groups' => ['jobOffer:read']]
        );
    }

    #[Route('/{id}', methods: ['PATCH'])]
    public function updateJobOffer(JobOffer $jobOffer, #[MapRequestPayload] UpdateJobOfferDTO $dto): JsonResponse
    {
        $this->denyAccessUnlessGranted(JobOfferVoter::EDIT, $jobOffer);

        return $this->json(
            $this->jobOfferService->update($jobOffer, $dto),
            context: ['groups' => ['jobOffer:read']]
        );
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function deleteJobOffer(JobOffer $jobOffer): JsonResponse
    {
        $this->denyAccessUnlessGranted(JobOfferVoter::DELETE, $jobOffer);

        $this->jobOfferService->delete($jobOffer);

        return $this->json(1, 204);
    }
}
