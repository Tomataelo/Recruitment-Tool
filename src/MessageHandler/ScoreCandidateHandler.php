<?php

namespace App\MessageHandler;

use App\Entity\Application;
use App\Enum\Application\ApplicationStatus;
use App\Enum\Application\MatchLevel;
use App\Message\ScoreCandidateMessage;
use App\Repository\ApplicationRepository;
use App\Service\LLM\CandidateScorer;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ScoreCandidateHandler
{
    public function __construct(
        private readonly ApplicationRepository $applicationRepository,
        private readonly CandidateScorer       $candidateScorer,
    ) {}

    public function __invoke(ScoreCandidateMessage $message): void
    {
        /** @var Application|null $application */
        $application = $this->applicationRepository->find($message->applicationId);

        if (!$application) {
            return;
        }

        $result = $this->candidateScorer->score($application);

        $application->setScore($result['score']);
        $application->setMatchLevel(MatchLevel::from($result['match_level']));
        $application->setScoreSummary($result['summary']);
        $application->setStatus(ApplicationStatus::REVIEWED);

        $this->applicationRepository->save($application);
    }
}
