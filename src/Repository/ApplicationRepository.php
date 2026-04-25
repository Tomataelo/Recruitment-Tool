<?php

namespace App\Repository;

use App\Entity\Application;
use App\Entity\Candidate;
use App\Entity\JobOffer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<Application>
 */
class ApplicationRepository extends ServiceEntityRepository
{
    public function __construct(
        ManagerRegistry $registry,
        private readonly EntityManagerInterface $entityManager
    )
    {
        parent::__construct($registry, Application::class);
    }

    public function save(Application $application): void
    {
        $this->entityManager->persist($application);
        $this->entityManager->flush();
    }

    public function findByJobOfferAndCandidate(JobOffer $jobOffer, Candidate $candidate): ?Application
    {
        return $this->findOneBy([
            'jobOffer'  => $jobOffer,
            'candidate' => $candidate,
        ]);
    }

    public function findByCandidate(Candidate $candidate): QueryBuilder
    {
        return $this->createQueryBuilder('a')
            ->leftJoin('a.jobOffer', 'jo')
            ->addSelect('jo')
            ->andWhere('a.candidate = :candidate')
            ->setParameter('candidate', $candidate)
            ->orderBy('a.appliedAt', 'DESC');
    }

    public function findByJobOffer(JobOffer $jobOffer): QueryBuilder
    {
        return $this->createQueryBuilder('a')
            ->leftJoin('a.candidate', 'c')
            ->addSelect('c')
            ->andWhere('a.jobOffer = :jobOffer')
            ->setParameter('jobOffer', $jobOffer)
            ->orderBy('a.score', 'DESC');
    }
}
