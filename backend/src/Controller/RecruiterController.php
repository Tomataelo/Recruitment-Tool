<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\Application\ApplicationStatus;
use App\Enum\JobOffer\JobOfferStatus;
use App\Repository\ApplicationRepository;
use App\Repository\JobOfferRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/recruiter')]
class RecruiterController extends AbstractController
{
    public function __construct(
        private readonly JobOfferRepository    $jobOfferRepository,
        private readonly ApplicationRepository $applicationRepository,
    ) {}

    #[Route('/stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $activeOffers = $this->jobOfferRepository->countByRecruiterAndStatus(
            $user,
            JobOfferStatus::ACTIVE
        );

        $totalApplications = $this->applicationRepository->countByRecruiter($user);
        $pendingApplications = $this->applicationRepository->countByRecruiterAndStatus($user, ApplicationStatus::AI_REVIEWED);
        $acceptedApplications = $this->applicationRepository->countByRecruiterAndStatus($user, ApplicationStatus::ACCEPTED);

        return $this->json([
            'activeOffers'       => $activeOffers,
            'totalApplications'  => $totalApplications,
            'pendingApplications' => $pendingApplications,
            'acceptedApplications' => $acceptedApplications,
        ]);
    }

    #[Route('/recent-applications', methods: ['GET'])]
    public function recentApplications(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        $applications = $this->applicationRepository->findRecentByRecruiter($user, 5);

        return $this->json($applications, context: ['groups' => ['application:read', 'application:candidate', 'application:jobOffer']]);
    }
}
