<?php

namespace App\Tests\Unit\Service;

use App\DTO\Candidate\CreateCandidateDTO;
use App\DTO\Candidate\UpdateCandidateDTO;
use App\Entity\Candidate;
use App\Entity\User;
use App\Exception\CandidateAlreadyExistsException;
use App\Exception\CandidateNotFoundException;
use App\Repository\CandidateRepository;
use App\Service\CandidateService;
use App\Service\CvUploadService;
use App\Service\Elasticsearch\CandidateIndexer;
use App\Service\LLM\CvParser;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[AllowMockObjectsWithoutExpectations] // usuń to
class CandidateServiceTest extends TestCase
{
    private function buildService(
        ?CandidateRepository $repository = null,
        ?CvUploadService $cvUploadService = null,
        ?CvParser $cvParser = null,
        ?CandidateIndexer $candidateIndexer = null,
    ): CandidateService {
        return new CandidateService(
            $repository     ?? $this->createStub(CandidateRepository::class),
            $cvUploadService ?? $this->createStub(CvUploadService::class),
            $cvParser        ?? $this->createStub(CvParser::class),
            $candidateIndexer ?? $this->createStub(CandidateIndexer::class),
        );
    }

    public function testCreateCandidateSuccessfully(): void
    {
        $user = new User();
        $dto  = new CreateCandidateDTO(fullName: 'Jan Kowalski', phone: '123456789');

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('findByUser')->willReturn(null);
        $repository->expects($this->once())->method('save');

        $candidate = $this->buildService(repository: $repository)->create($dto, $user);

        $this->assertInstanceOf(Candidate::class, $candidate);
        $this->assertSame('Jan Kowalski', $candidate->getFullName());
    }

    public function testCreateThrowsExceptionWhenCandidateAlreadyExists(): void
    {
        $user = new User();
        $dto  = new CreateCandidateDTO(fullName: 'Jan Kowalski', phone: null);

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('findByUser')->willReturn(new Candidate());
        $repository->expects($this->never())->method('save');

        $this->expectException(CandidateAlreadyExistsException::class);

        $this->buildService(repository: $repository)->create($dto, $user);
    }

    public function testGetByUserReturnsCandidateWhenExists(): void
    {
        $user      = new User();
        $candidate = new Candidate();

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('findByUser')->willReturn($candidate);

        $result = $this->buildService(repository: $repository)->getByUser($user);

        $this->assertSame($candidate, $result);
    }

    public function testGetByUserThrowsExceptionWhenNotFound(): void
    {
        $user = new User();

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('findByUser')->willReturn(null);

        $this->expectException(CandidateNotFoundException::class);

        $this->buildService(repository: $repository)->getByUser($user);
    }

    public function testUpdateCandidateSuccessfully(): void
    {
        $candidate = new Candidate();
        $dto = new UpdateCandidateDTO(
            fullName: 'Nowe Imie',
            phone: '987654321',
            skills: ['PHP', 'Symfony'],
            experienceMonths: 24,
            languages: [['language' => 'angielski', 'level' => 'B2']],
            summary: 'Doswiadczony developer',
        );

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('save');

        $indexer = $this->createMock(CandidateIndexer::class);
        $indexer->expects($this->once())->method('index')->with($candidate);

        $result = $this->buildService(repository: $repository, candidateIndexer: $indexer)
            ->update($candidate, $dto);

        $this->assertSame('Nowe Imie', $result->getFullName());
        $this->assertSame(24, $result->getExperienceMonths());
    }

    public function testUploadCvDeletesOldCvWhenExists(): void
    {
        $candidate = new Candidate();
        $candidate->setCvFilePath('old_cv.pdf');
        $file = $this->createStub(UploadedFile::class);

        $cvUploadService = $this->createMock(CvUploadService::class);
        $cvUploadService->expects($this->once())->method('delete')->with('old_cv.pdf');
        $cvUploadService->expects($this->once())->method('upload')->willReturn('new_cv.pdf');

        $cvParser = $this->createMock(CvParser::class);
        $cvParser->expects($this->once())->method('parse')->willReturn([
            'skills' => ['PHP'], 'experience_months' => 24, 'languages' => [], 'summary' => 'Test',
        ]);

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('save');

        $indexer = $this->createMock(CandidateIndexer::class);
        $indexer->expects($this->once())->method('index');

        $this->buildService($repository, $cvUploadService, $cvParser, $indexer)
            ->uploadCv($candidate, $file);

        $this->assertSame('new_cv.pdf', $candidate->getCvFilePath());
    }

    public function testUploadCvDoesNotDeleteWhenNoPreviousCv(): void
    {
        $candidate = new Candidate();
        $file = $this->createStub(UploadedFile::class);

        $cvUploadService = $this->createMock(CvUploadService::class);
        $cvUploadService->expects($this->never())->method('delete');
        $cvUploadService->expects($this->once())->method('upload')->willReturn('new_cv.pdf');

        $cvParser = $this->createMock(CvParser::class);
        $cvParser->expects($this->once())->method('parse')->willReturn([
            'skills' => ['PHP'], 'experience_months' => 24, 'languages' => [], 'summary' => 'Test',
        ]);

        $repository = $this->createMock(CandidateRepository::class);
        $repository->expects($this->once())->method('save');

        $indexer = $this->createMock(CandidateIndexer::class);
        $indexer->expects($this->once())->method('index');

        $this->buildService($repository, $cvUploadService, $cvParser, $indexer)
            ->uploadCv($candidate, $file);

        $this->assertSame('new_cv.pdf', $candidate->getCvFilePath());
    }
}
