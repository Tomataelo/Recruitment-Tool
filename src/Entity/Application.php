<?php

namespace App\Entity;

use App\Enum\Application\ApplicationStatus;
use App\Enum\Application\matchLevel;
use App\Repository\ApplicationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ApplicationRepository::class)]
class Application
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $score = null;

    #[ORM\Column(length: 10, nullable: true, enumType: matchLevel::class)]
    private ?string $matchLevel = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $scoreSummary = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $recruiterNote = null;

    #[ORM\Column(length: 10, nullable: true, enumType: matchLevel::class)]
    private ?string $recruiterMatchOverride = null;

    #[ORM\Column(length: 10, enumType: ApplicationStatus::class)]
    private ?string $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $appliedAt = null;

    #[ORM\ManyToOne(inversedBy: 'applications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Candidate $candidate = null;

    #[ORM\ManyToOne(inversedBy: 'applications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?JobOffer $jobOffer = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(?int $score): static
    {
        $this->score = $score;

        return $this;
    }

    public function getMatchLevel(): ?string
    {
        return $this->matchLevel;
    }

    public function setMatchLevel(?string $matchLevel): static
    {
        $this->matchLevel = $matchLevel;

        return $this;
    }

    public function getScoreSummary(): ?string
    {
        return $this->scoreSummary;
    }

    public function setScoreSummary(?string $scoreSummary): static
    {
        $this->scoreSummary = $scoreSummary;

        return $this;
    }

    public function getRecruiterNote(): ?string
    {
        return $this->recruiterNote;
    }

    public function setRecruiterNote(?string $recruiterNote): static
    {
        $this->recruiterNote = $recruiterNote;

        return $this;
    }

    public function getRecruiterMatchOverride(): ?string
    {
        return $this->recruiterMatchOverride;
    }

    public function setRecruiterMatchOverride(?string $recruiterMatchOverride): static
    {
        $this->recruiterMatchOverride = $recruiterMatchOverride;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getAppliedAt(): ?\DateTimeImmutable
    {
        return $this->appliedAt;
    }

    public function setAppliedAt(\DateTimeImmutable $appliedAt): static
    {
        $this->appliedAt = $appliedAt;

        return $this;
    }

    public function getCandidate(): ?Candidate
    {
        return $this->candidate;
    }

    public function setCandidate(?Candidate $candidate): static
    {
        $this->candidate = $candidate;

        return $this;
    }

    public function getJobOffer(): ?JobOffer
    {
        return $this->jobOffer;
    }

    public function setJobOffer(?JobOffer $jobOffer): static
    {
        $this->jobOffer = $jobOffer;

        return $this;
    }
}
