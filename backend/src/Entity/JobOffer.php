<?php

namespace App\Entity;

use App\Enum\JobOffer\JobOfferStatus;
use App\Enum\JobOffer\WorkMode;
use App\Repository\JobOfferRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: JobOfferRepository::class)]
class JobOffer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['jobOffer:read', 'jobOffer:write', 'application:jobOffer'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['jobOffer:read', 'jobOffer:write', 'application:jobOffer'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['jobOffer:read', 'jobOffer:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['jobOffer:read', 'jobOffer:write'])]
    private array $requirements = [];

    #[ORM\Column]
    #[Groups(['jobOffer:read', 'jobOffer:write'])]
    private ?int $experienceMin = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['jobOffer:read', 'jobOffer:write'])]
    private ?string $location = null;

    #[ORM\Column(length: 10, enumType: WorkMode::class)]
    #[Groups(['jobOffer:read', 'jobOffer:write'])]
    private ?WorkMode $workMode = null;

    #[ORM\Column(length: 10, enumType: JobOfferStatus::class)]
    #[Groups(['jobOffer:read', 'jobOffer:write'])]
    private ?JobOfferStatus $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt;

    #[ORM\ManyToOne(inversedBy: 'jobOffers')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['jobOffer:read'])]
    private ?User $owner = null;

    /**
     * @var Collection<int, Application>
     */
    #[ORM\OneToMany(targetEntity: Application::class, mappedBy: 'jobOffer')]
    private Collection $applications;

    public function __construct()
    {
        $this->applications = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getRequirements(): array
    {
        return $this->requirements;
    }

    public function setRequirements(array $requirements): static
    {
        $this->requirements = $requirements;

        return $this;
    }

    public function getExperienceMin(): ?int
    {
        return $this->experienceMin;
    }

    public function setExperienceMin(int $experienceMin): static
    {
        $this->experienceMin = $experienceMin;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getWorkMode(): ?WorkMode
    {
        return $this->workMode;
    }

    public function setWorkMode(WorkMode $workMode): static
    {
        $this->workMode = $workMode;

        return $this;
    }

    public function getStatus(): ?JobOfferStatus
    {
        return $this->status;
    }

    public function setStatus(JobOfferStatus $status): static
    {
        $this->status = $status;

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

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

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
            $application->setJobOffer($this);
        }

        return $this;
    }

    public function removeApplication(Application $application): static
    {
        if ($this->applications->removeElement($application)) {
            // set the owning side to null (unless already changed)
            if ($application->getJobOffer() === $this) {
                $application->setJobOffer(null);
            }
        }

        return $this;
    }
}
