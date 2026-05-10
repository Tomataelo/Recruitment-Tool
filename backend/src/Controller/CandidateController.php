<?php

namespace App\Controller;

use App\Dto\Candidate\CreateCandidateDto;
use App\Dto\Candidate\UpdateCandidateDto;
use App\Exception\CandidatesCvNotFound;
use App\Security\Voter\CandidateVoter;
use App\Service\CandidateService;
use App\Entity\Candidate;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use League\Flysystem\FilesystemOperator;


#[Route('/api/candidates')]
class CandidateController extends AbstractController
{
    public function __construct(
        private readonly CandidateService $candidateService,
        #[Autowire(service: 'cv.storage')]
        private readonly FilesystemOperator $cvStorage,
    ) {}

    #[Route('/me', methods: ['GET'])]
    public function getMe(): JsonResponse
    {
        $this->denyAccessUnlessGranted(CandidateVoter::CREATE);

        $user = $this->getUser();

        $candidate = $this->candidateService->getByUser($user);

        return $this->json($candidate, context: ['groups' => ['candidate:read']]);
    }

    #[Route('/me', methods: ['POST'])]
    public function create(#[MapRequestPayload] CreateCandidateDto $dto,): JsonResponse
    {
        $this->denyAccessUnlessGranted(CandidateVoter::CREATE);

        $user = $this->getUser();

        $candidate = $this->candidateService->create($dto, $user);

        return $this->json($candidate, 201, context: ['groups' => ['candidate:read']]);
    }

    #[Route('/me/cv', methods: ['POST'])]
    public function uploadCv(Request $request): JsonResponse
    {
        $this->denyAccessUnlessGranted(CandidateVoter::CREATE);

        $user = $this->getUser();

        $candidate = $this->candidateService->getByUser($user);

        $this->denyAccessUnlessGranted(CandidateVoter::EDIT, $candidate);

        $file = $request->files->get('cv');

        if (!$file instanceof UploadedFile) {
            return $this->json(['message' => 'CV file is required.'], 422);
        }

        if ($file->getMimeType() !== 'application/pdf') {
            return $this->json(['message' => 'CV must be a PDF file.'], 422);
        }

        $this->candidateService->uploadCv($candidate, $file);

        return $this->json(['message' => 'CV uploaded successfully.']);
    }

    #[Route('/me', methods: ['PATCH'])]
    public function update(#[MapRequestPayload] UpdateCandidateDto $dto): JsonResponse
    {
        $this->denyAccessUnlessGranted(CandidateVoter::CREATE);

        $user = $this->getUser();

        $candidate = $this->candidateService->getByUser($user);

        $this->denyAccessUnlessGranted(CandidateVoter::EDIT, $candidate);

        return $this->json(
            $this->candidateService->update($candidate, $dto),
            context: ['groups' => ['candidate:read']]
        );
    }

    #[Route('/{id}/cv', methods: ['GET'])]
    public function downloadCv(Candidate $candidate): Response
    {
        $this->denyAccessUnlessGranted(CandidateVoter::VIEW, $candidate);

        if (!$candidate->getCvFilePath()) {
            throw new CandidatesCvNotFound();
        }

        $fileContent = $this->cvStorage->read($candidate->getCvFilePath());

        return new Response($fileContent, 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="cv_' . $candidate->getId() . '.pdf"',
        ]);
    }
}
