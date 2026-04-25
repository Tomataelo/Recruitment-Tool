<?php

namespace App\Service;

use App\Dto\Candidate\CreateCandidateDto;
use App\Dto\Candidate\UpdateCandidateDto;
use App\Entity\Candidate;
use App\Entity\User;
use App\Exception\CandidateAlreadyExistsException;
use App\Exception\CandidateNotFoundException;
use App\Repository\CandidateRepository;
use App\Service\LLM\CvParser;
use League\Flysystem\FilesystemException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

readonly class CandidateService
{
    public function __construct(
        private CandidateRepository $candidateRepository,
        private CvUploadService $cvUploadService,
        private CvParser $cvParser,
    ) {}

    public function create(CreateCandidateDto $dto, User $user): Candidate
    {
        if ($this->candidateRepository->findByUser($user)) {
            throw new CandidateAlreadyExistsException();
        }

        $candidate = new Candidate();
        $candidate->setFullName($dto->fullName);
        $candidate->setPhone($dto->phone);
        $candidate->setCandidateUser($user);
        $candidate->setCreatedAt(new \DateTimeImmutable());

        $this->candidateRepository->save($candidate);

        return $candidate;
    }

    public function update(Candidate $candidate, UpdateCandidateDTO $dto): Candidate
    {
        if ($dto->fullName !== null) {
            $candidate->setFullName($dto->fullName);
        }
        if ($dto->phone !== null) {
            $candidate->setPhone($dto->phone);
        }
        if ($dto->skills !== null) {
            $candidate->setSkills($dto->skills);
        }
        if ($dto->experienceMonths !== null) {
            $candidate->setExperienceMonths($dto->experienceMonths);
        }
        if ($dto->languages !== null) {
            $candidate->setLanguages($dto->languages);
        }
        if ($dto->summary !== null) {
            $candidate->setSummary($dto->summary);
        }

        $this->candidateRepository->save($candidate);

        return $candidate;
    }

    public function getByUser(User $user): Candidate
    {
        $candidate = $this->candidateRepository->findByUser($user);

        if (!$candidate) {
            throw new CandidateNotFoundException();
        }

        return $candidate;
    }

    /**
     * @throws FilesystemException
     */
    public function uploadCv(Candidate $candidate, UploadedFile $file): void
    {
        if ($candidate->getCvFilePath()) {
            $this->cvUploadService->delete($candidate->getCvFilePath());
        }

        $fileName = $this->cvUploadService->upload($file);
        $candidate->setCvFilePath($fileName);

        $parsed = $this->cvParser->parse($fileName);

        $candidate->setSkills($parsed['skills'] ?? []);
        $candidate->setExperienceMonths($parsed['experience_months'] ?? null);
        $candidate->setLanguages($parsed['languages'] ?? []);
        $candidate->setSummary($parsed['summary'] ?? null);

        $this->candidateRepository->save($candidate);
    }
}
