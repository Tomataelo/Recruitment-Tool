<?php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;

class PaginatorService
{
    private const int MAX_LIMIT = 50;

    public function paginate(QueryBuilder $qb, int $page, int $limit): array
    {
        $limit = min($limit, self::MAX_LIMIT);
        $offset = ($page - 1) * $limit;

        $qb->setMaxResults($limit)->setFirstResult($offset);

        $paginator = new Paginator($qb, fetchJoinCollection: false);
        $total = $paginator->count();

        return [
            'data' => iterator_to_array($paginator),
            'meta' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit),
            ]
        ];
    }
}
