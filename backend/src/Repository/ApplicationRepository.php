<?php

namespace App\Repository;

use App\Entity\Application;
use App\Entity\Candidate;
use App\Entity\JobOffer;
use App\Entity\User;
use App\Enum\Application\ApplicationStatus;
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

    public function countByRecruiter(User $recruiter): int
    {
        return (int) $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.jobOffer', 'jo')
            ->andWhere('jo.owner = :recruiter')
            ->setParameter('recruiter', $recruiter)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function countByRecruiterAndStatus(User $recruiter, ApplicationStatus $status): int
    {
        return (int) $this->createQueryBuilder('a')
            ->select('COUNT(a.id)')
            ->join('a.jobOffer', 'jo')
            ->andWhere('jo.owner = :recruiter')
            ->andWhere('a.status = :status')
            ->setParameter('recruiter', $recruiter)
            ->setParameter('status', $status)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findRecentByRecruiter(User $recruiter, int $limit): array
    {
        return $this->createQueryBuilder('a')
            ->join('a.jobOffer', 'jo')
            ->leftJoin('a.candidate', 'c')
            ->addSelect('jo', 'c')
            ->andWhere('jo.owner = :recruiter')
            ->setParameter('recruiter', $recruiter)
            ->orderBy('a.appliedAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
