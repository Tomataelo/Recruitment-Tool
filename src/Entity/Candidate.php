<?php

namespace App\Entity;

use App\Repository\CandidateRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CandidateRepository::class)]
class Candidate
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['candidate:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['candidate:read'])]
    private ?string $fullName = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['candidate:read'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['candidate:read'])]
    private ?string $cvFilePath = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['candidate:read'])]
    private ?array $skills = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['candidate:read'])]
    private ?int $experienceMonths = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['candidate:read'])]
    private ?array $languages = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['candidate:read'])]
    private ?string $summary = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToOne(inversedBy: 'candidate', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $candidateUser = null;

    /**
     * @var Collection<int, Application>
     */
    #[ORM\OneToMany(targetEntity: Application::class, mappedBy: 'candidate')]
    private Collection $applications;

    public function __construct()
    {
        $this->applications = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFullName(): ?string
    {
        return $this->fullName;
    }

    public function setFullName(string $fullName): static
    {
        $this->fullName = $fullName;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getCvFilePath(): ?string
    {
        return $this->cvFilePath;
    }

    public function setCvFilePath(?string $cvFilePath): static
    {
        $this->cvFilePath = $cvFilePath;

        return $this;
    }

    public function getSkills(): ?array
    {
        return $this->skills;
    }

    public function setSkills(?array $skills): static
    {
        $this->skills = $skills;

        return $this;
    }

    public function getExperienceMonths(): ?int
    {
        return $this->experienceMonths;
    }

    public function setExperienceMonths(?int $experienceMonths): static
    {
        $this->experienceMonths = $experienceMonths;

        return $this;
    }

    public function getLanguages(): ?array
    {
        return $this->languages;
    }

    public function setLanguages(?array $languages): static
    {
        $this->languages = $languages;

        return $this;
    }

    public function getSummary(): ?string
    {
        return $this->summary;
    }

    public function setSummary(?string $summary): static
    {
        $this->summary = $summary;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getCandidateUser(): ?User
    {
        return $this->candidateUser;
    }

    public function setCandidateUser(User $candidateUser): static
    {
        $this->candidateUser = $candidateUser;

        return $this;
    }

    /**
     * @return Collection<int, Application>
     */
    public function getApplications(): Collection
    {
        return $this->applications;
    }

    public function addApplication(Application $application): static
    {
        if (!$this->applications->contains($application)) {
            $this->applications->add($application);
            $application->setCandidate($this);
        }

        return $this;
    }

    public function removeApplication(Application $application): static
    {
        if ($this->applications->removeElement($application)) {
            // set the owning side to null (unless already changed)
            if ($application->getCandidate() === $this) {
                $application->setCandidate(null);
            }
        }

        return $this;
    }
}
