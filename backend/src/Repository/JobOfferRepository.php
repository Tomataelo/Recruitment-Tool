<?php

namespace App\Repository;

use App\Entity\JobOffer;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use App\Enum\JobOffer\JobOfferStatus;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<JobOffer>
 */
class JobOfferRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        private readonly EntityManagerInterface $entityManager
    )
    {
        parent::__construct($registry, JobOffer::class);
    }

    public function save(JobOffer $jobOffer): void
    {
        $this->entityManager->persist($jobOffer);
        $this->entityManager->flush();
    }

    public function delete(JobOffer $jobOffer): void
    {
        $this->entityManager->remove($jobOffer);
        $this->entityManager->flush();
    }

    public function findByStatus(?JobOfferStatus $status = null): QueryBuilder
    {
        $qb = $this->createQueryBuilder('jo')
            ->orderBy('jo.createdAt', 'DESC');

        if ($status !== null) {
            $qb->andWhere('jo.status = :status')
                ->setParameter('status', $status);
        }

        return $qb;
    }

    public function countByRecruiterAndStatus(User $recruiter, JobOfferStatus $status): int
    {
        return (int) $this->createQueryBuilder('jo')
            ->select('COUNT(jo.id)')
            ->andWhere('jo.owner = :recruiter')
            ->andWhere('jo.status = :status')
            ->setParameter('recruiter', $recruiter)
            ->setParameter('status', $status)
            ->getQuery()
            ->getSingleScalarResult();
    }

    //    /**
    //     * @return JobOffer[] Returns an array of JobOffer objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('j')
    //            ->andWhere('j.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('j.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?JobOffer
    //    {
    //        return $this->createQueryBuilder('j')
    //            ->andWhere('j.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
