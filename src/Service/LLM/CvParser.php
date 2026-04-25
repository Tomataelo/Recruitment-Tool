<?php

namespace App\Service\LLM;

use App\Entity\Candidate;
use JsonException;
use League\Flysystem\FilesystemException;
use League\Flysystem\FilesystemOperator;

class CvParser
{
    private const string SYSTEM_PROMPT = <<<PROMPT
        Jesteś ekspertem HR i analitykiem CV. Przeanalizuj dostarczone CV i zwróć dane w formacie JSON.
        Odpowiadaj WYŁĄCZNIE poprawnym JSON-em, bez żadnego tekstu przed ani po, bez markdown backticks.
        PROMPT;

    public function __construct(
        private readonly ClaudeClient $claudeClient,
        private readonly FilesystemOperator $cvStorage,
    ) {}

    /**
     * @throws FilesystemException
     * @throws JsonException
     */
    public function parse(string $cvFilePath): array
    {
        $pdfContent = $this->cvStorage->read($cvFilePath);
        $base64     = base64_encode($pdfContent);

        $content = [
            [
                'type'   => 'document',
                'source' => [
                    'type'       => 'base64',
                    'media_type' => 'application/pdf',
                    'data'       => $base64,
                ],
            ],
            [
                'type' => 'text',
                'text' => sprintf(
                    <<<TEXT
                Dzisiejsza data to: %s.
                Przeanalizuj to CV i zwróć JSON z następującymi polami:
                - skills (array of strings, np. ["PHP", "Symfony", "Docker"])
                - experience_months (int, łączne doświadczenie zawodowe w miesiącach liczone od daty rozpoczęcia do dzisiaj)
                - languages (array of objects, np. [{"language": "angielski", "level": "B2"}])
                - summary (string, krótkie podsumowanie kandydata max 3 zdania po polsku)
                TEXT,
                    (new \DateTimeImmutable())->format('Y-m-d')
                ),
            ],
        ];

        $raw = $this->claudeClient->sendMessage(self::SYSTEM_PROMPT, $content);

        return json_decode($raw, true, flags: JSON_THROW_ON_ERROR);
    }
}
