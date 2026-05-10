<?php

namespace App\Service\LLM;

use App\Entity\Application;

class CandidateScorer
{
    private const string SYSTEM_PROMPT = <<<PROMPT
        Jesteś ekspertem HR. Oceniasz dopasowanie kandydata do oferty pracy.
        Odpowiadaj WYŁĄCZNIE surowym JSON-em, bez markdown, bez backticks, bez żadnego tekstu przed ani po.
        PROMPT;

    public function __construct(
        private readonly ClaudeClient $claudeClient,
    ) {}

    public function score(Application $application): array
    {
        $candidate = $application->getCandidate();
        $jobOffer  = $application->getJobOffer();

        $candidateMonths  = $candidate->getExperienceMonths() ?? 0;
        $requiredMonths   = $jobOffer->getExperienceMin();
        $meetsExperience  = $candidateMonths >= $requiredMonths;

        $experienceNote = $meetsExperience
            ? 'Kandydat SPEŁNIA wymóg doświadczenia.'
            : sprintf(
                'Kandydat NIE SPEŁNIA wymogu doświadczenia (%d/%d miesięcy) — match_level MUSI być "partial" lub "no_match", NIGDY "strong".',
                $candidateMonths,
                $requiredMonths
            );

        $content = [
            [
                'type' => 'text',
                'text' => sprintf(
                    <<<TEXT
                    Oceń dopasowanie kandydata do oferty pracy i zwróć JSON z polami:
                    - score (int 0-100, ogólny wynik dopasowania)
                    - match_level (string: "strong" jeśli score >= 70, "partial" jeśli 40-69, "no_match" jeśli < 40)
                    - summary (string, krótkie uzasadnienie oceny po polsku, max 3 zdania)

                    WAŻNE ZASADY OCENIANIA — MUSISZ ICH PRZESTRZEGAĆ:
                    1. Sprawdź weryfikację doświadczenia poniżej i zastosuj się do niej bezwzględnie
                    2. Wymagania oznaczone "is_required: true" są OBOWIĄZKOWE — brak każdego z nich obniża score o minimum 20 punktów
                    3. Wymagania oznaczone "is_required: false" są opcjonalne — ich brak nieznacznie obniża score

                    WERYFIKACJA DOŚWIADCZENIA: %s

                    OFERTA PRACY:
                    Tytuł: %s
                    Wymagane minimalne doświadczenie: %d miesięcy
                    Wymagania: %s

                    KANDYDAT:
                    Doświadczenie: %d miesięcy
                    Umiejętności: %s
                    Języki: %s
                    Podsumowanie: %s
                    TEXT,
                    $experienceNote,
                    $jobOffer->getTitle(),
                    $jobOffer->getExperienceMin(),
                    json_encode($jobOffer->getRequirements(), JSON_UNESCAPED_UNICODE),
                    $candidateMonths,
                    implode(', ', $candidate->getSkills() ?? []),
                    json_encode($candidate->getLanguages(), JSON_UNESCAPED_UNICODE),
                    $candidate->getSummary() ?? '',
                ),
            ],
        ];

        $raw = $this->claudeClient->sendMessage(self::SYSTEM_PROMPT, $content);

        $raw = preg_replace('/^```json\s*/m', '', $raw);
        $raw = preg_replace('/^```\s*/m', '', $raw);
        $raw = trim($raw);

        return json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
    }
}
