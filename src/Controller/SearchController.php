<?php

namespace App\Controller;

use App\Service\Elasticsearch\CandidateIndexer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/search')]
class SearchController extends AbstractController
{
    public function __construct(
        private readonly CandidateIndexer $candidateIndexer,
    ) {}

    #[Route('/candidates', methods: ['GET'])]
    public function searchCandidates(Request $request): JsonResponse
    {
        $query = $request->query->get('q', '');
        $page  = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, (int) $request->query->get('limit', 10));

        if (empty($query)) {
            return $this->json(['message' => 'Query parameter "q" is required.'], 422);
        }

        return $this->json(
            $this->candidateIndexer->search($query, $page, $limit)
        );
    }
}
