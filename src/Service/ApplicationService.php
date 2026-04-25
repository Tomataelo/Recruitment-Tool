<?php

namespace App\Service;

use App\Dto\Application\CreateApplicationDto;
use App\Dto\Application\OverrideMatchDto;
use App\Entity\Application;
use App\Entity\User;
use App\Enum\Application\ApplicationStatus;
use App\Enum\Application\MatchLevel;
use App\Enum\JobOffer\JobOfferStatus;
use App\Exception\ApplicationAlreadyExistsException;
use App\Exception\CandidateNotFoundException;
use App\Exception\CandidateProfileIncompleteException;
use App\Exception\JobOfferNotActiveException;
use App\Repository\ApplicationRepository;
use App\Repository\CandidateRepository;
use App\Repository\JobOfferRepository;

readonly class ApplicationService
{
    public function __construct(
        private ApplicationRepository $applicationRepository,
        private CandidateRepository   $candidateRepository,
        private JobOfferRepository    $jobOfferRepository,
    ) {}

    public function apply(CreateApplicationDto $dto, User $user): Application
    {
        $candidate = $this->candidateRepository->findByUser($user);

        if (!$candidate) {
            throw new CandidateNotFoundException();
        }

        if (!$candidate->getCvFilePath()) {
            throw new CandidateProfileIncompleteException();
        }

        $jobOffer = $this->jobOfferRepository->find($dto->jobOfferId);

        if (!$jobOffer || $jobOffer->getStatus() !== JobOfferStatus::ACTIVE) {
            throw new JobOfferNotActiveException();
        }

        if ($this->applicationRepository->findByJobOfferAndCandidate($jobOffer, $candidate)) {
            throw new ApplicationAlreadyExistsException();
        }

        $application = new Application();
        $application->setCandidate($candidate);
        $application->setJobOffer($jobOffer);
        $application->setStatus(ApplicationStatus::PENDING);
        $application->setAppliedAt(new \DateTimeImmutable());

        $this->applicationRepository->save($application);

        return $application;
    }

    public function override(Application $application, OverrideMatchDto $dto): Application
    {
        $application->setRecruiterMatchOverride(MatchLevel::from($dto->matchLevel));
        $application->setRecruiterNote($dto->recruiterNote);

        $this->applicationRepository->save($application);

        return $application;
    }
}
