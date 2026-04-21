<?php

namespace App\Service;

use App\Dto\JobOffer\CreateJobOfferDto;
use App\Dto\JobOffer\UpdateJobOfferDto;
use App\Entity\JobOffer;
use App\Entity\User;
use App\Repository\JobOfferRepository;
use App\Enum\JobOffer\JobOfferStatus;
use App\Enum\JobOffer\WorkMode;

readonly class JobOfferService
{
    public function __construct(
        private JobOfferRepository $jobOfferRepository,
        private PaginatorService   $paginatorService
    ){}

    public function create(CreateJobOfferDTO $dto, User $owner): JobOffer
    {
        $jobOffer = new JobOffer();
        $jobOffer->setTitle($dto->title);
        $jobOffer->setDescription($dto->description);
        $jobOffer->setRequirements($dto->requirements);
        $jobOffer->setExperienceMin($dto->experienceMin);
        $jobOffer->setLocation($dto->location);
        $jobOffer->setWorkMode(WorkMode::from($dto->workMode));
        $jobOffer->setStatus(JobOfferStatus::ACTIVE);
        $jobOffer->setOwner($owner);

        $this->jobOfferRepository->save($jobOffer);

        return $jobOffer;
    }

    public function update(JobOffer $jobOffer, UpdateJobOfferDTO $dto): JobOffer
    {
        if ($dto->title !== null) {
            $jobOffer->setTitle($dto->title);
        }
        if ($dto->description !== null) {
            $jobOffer->setDescription($dto->description);
        }
        if ($dto->requirements !== null) {
            $jobOffer->setRequirements($dto->requirements);
        }
        if ($dto->experienceMin !== null) {
            $jobOffer->setExperienceMin($dto->experienceMin);
        }
        if ($dto->location !== null) {
            $jobOffer->setLocation($dto->location);
        }
        if ($dto->workMode !== null) {
            $jobOffer->setWorkMode(WorkMode::from($dto->workMode));
        }
        if ($dto->status !== null) {
            $jobOffer->setStatus(JobOfferStatus::from($dto->status));
        }

        $this->jobOfferRepository->save($jobOffer);

        return $jobOffer;
    }

    public function delete(JobOffer $jobOffer): void
    {
        $this->jobOfferRepository->delete($jobOffer);
    }

    public function getPaginated(int $page, int $limit, ?JobOfferStatus $status): array
    {
        $qb = $this->jobOfferRepository->findByStatus($status);
        return $this->paginatorService->paginate($qb, $page, $limit);
    }
}
