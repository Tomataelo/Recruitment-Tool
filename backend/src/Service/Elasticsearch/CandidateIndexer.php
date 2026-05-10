<?php

namespace App\Service\Elasticsearch;

use App\Entity\Candidate;
use Elastic\Elasticsearch\Client;

class CandidateIndexer
{
    private const string INDEX = 'candidates';

    public function __construct(
        private readonly Client $client,
    ) {}

    public function index(Candidate $candidate): void
    {
        $this->client->index([
            'index' => self::INDEX,
            'id'    => $candidate->getId(),
            'body'  => [
                'fullName'         => $candidate->getFullName(),
                'skills'           => $candidate->getSkills() ?? [],
                'experienceMonths' => $candidate->getExperienceMonths() ?? 0,
                'languages'        => $candidate->getLanguages() ?? [],
                'summary'          => $candidate->getSummary() ?? '',
            ],
        ]);
    }

    public function delete(int $candidateId): void
    {
        $this->client->delete([
            'index' => self::INDEX,
            'id'    => $candidateId,
        ]);
    }

    public function search(string $query, int $page, int $limit): array
    {
        $response = $this->client->search([
            'index' => self::INDEX,
            'body'  => [
                'from'  => ($page - 1) * $limit,
                'size'  => $limit,
                'query' => [
                    'multi_match' => [
                        'query'  => $query,
                        'fields' => ['fullName', 'skills', 'summary', 'languages.language'],
                    ],
                ],
            ],
        ]);

        $hits = $response['hits']['hits'];

        return [
            'data' => array_map(fn($hit) => $hit['_source'] + ['id' => $hit['_id']], $hits),
            'meta' => [
                'total' => $response['hits']['total']['value'],
                'page'  => $page,
                'limit' => $limit,
                'pages' => (int) ceil($response['hits']['total']['value'] / $limit),
            ],
        ];
    }
}
