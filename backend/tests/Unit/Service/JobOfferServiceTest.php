<?php

namespace App\Tests\Unit\Service;

use App\DTO\JobOffer\CreateJobOfferDTO;
use App\DTO\JobOffer\UpdateJobOfferDTO;
use App\Entity\JobOffer;
use App\Entity\User;
use App\Enum\JobOffer\JobOfferStatus;
use App\Enum\JobOffer\WorkMode;
use App\Repository\JobOfferRepository;
use App\Service\JobOfferService;
use App\Service\PaginatorService;
use PHPUnit\Framework\TestCase;

class JobOfferServiceTest extends TestCase
{
    private function buildService(
        ?JobOfferRepository $repository = null,
        ?PaginatorService $paginatorService = null,
    ): JobOfferService {
        return new JobOfferService(
            $repository       ?? $this->createStub(JobOfferRepository::class),
            $paginatorService ?? $this->createStub(PaginatorService::class),
        );
    }

    public function testCreateJobOfferSuccessfully(): void
    {
        $owner = new User();
        $dto   = new CreateJobOfferDTO(
            title: 'Senior PHP Developer',
            description: 'Opis oferty',
            requirements: [['skill' => 'PHP', 'is_required' => true]],
            experienceMin: 36,
            location: 'Warszawa',
            workMode: 'hybrid',
        );

        $repository = $this->createMock(JobOfferRepository::class);
        $repository->expects($this->once())->method('save');

        $jobOffer = $this->buildService(repository: $repository)->create($dto, $owner);

        $this->assertInstanceOf(JobOffer::class, $jobOffer);
        $this->assertSame('Senior PHP Developer', $jobOffer->getTitle());
        $this->assertSame('Opis oferty', $jobOffer->getDescription());
        $this->assertSame(36, $jobOffer->getExperienceMin());
        $this->assertSame('Warszawa', $jobOffer->getLocation());
        $this->assertSame(WorkMode::HYBRID, $jobOffer->getWorkMode());
        $this->assertSame(JobOfferStatus::ACTIVE, $jobOffer->getStatus());
        $this->assertSame($owner, $jobOffer->getOwner());
    }

    public function testUpdateJobOfferSuccessfully(): void
    {
        $jobOffer = new JobOffer();
        $jobOffer->setTitle('Stary tytuł');
        $jobOffer->setWorkMode(WorkMode::REMOTE);

        $dto = new UpdateJobOfferDTO(
            title: 'Nowy tytuł',
            workMode: 'onsite',
        );

        $repository = $this->createMock(JobOfferRepository::class);
        $repository->expects($this->once())->method('save');

        $result = $this->buildService(repository: $repository)->update($jobOffer, $dto);

        $this->assertSame('Nowy tytuł', $result->getTitle());
        $this->assertSame(WorkMode::ONSITE, $result->getWorkMode());
    }

    public function testUpdateJobOfferDoesNotChangeNullFields(): void
    {
        $jobOffer = new JobOffer();
        $jobOffer->setTitle('Oryginalny tytuł');
        $jobOffer->setExperienceMin(24);

        $dto = new UpdateJobOfferDTO(
            title: null,
            experienceMin: null,
        );

        $repository = $this->createMock(JobOfferRepository::class);
        $repository->expects($this->once())->method('save');

        $result = $this->buildService(repository: $repository)->update($jobOffer, $dto);

        $this->assertSame('Oryginalny tytuł', $result->getTitle());
        $this->assertSame(24, $result->getExperienceMin());
    }

    public function testDeleteJobOfferSuccessfully(): void
    {
        $jobOffer = new JobOffer();

        $repository = $this->createMock(JobOfferRepository::class);
        $repository->expects($this->once())->method('delete')->with($jobOffer);

        $this->buildService(repository: $repository)->delete($jobOffer);
    }

    public function testNewJobOfferHasActiveStatusByDefault(): void
    {
        $owner = new User();
        $dto   = new CreateJobOfferDTO(
            title: 'PHP Developer',
            description: 'Opis',
            requirements: [],
            experienceMin: 12,
            location: null,
            workMode: 'remote',
        );

        $jobOffer = $this->buildService()->create($dto, $owner);

        $this->assertSame(JobOfferStatus::ACTIVE, $jobOffer->getStatus());
    }
}
