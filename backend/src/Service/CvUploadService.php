<?php

namespace App\Service;

use League\Flysystem\FilesystemException;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\HttpFoundation\File\UploadedFile;

readonly class CvUploadService
{
    public function __construct(
        private FilesystemOperator $cvStorage,
    ) {}

    /**
     * @throws FilesystemException
     */

    public function upload(UploadedFile $file): string
    {
        $fileName = 'cv_' . bin2hex(random_bytes(8)) . '.pdf';

        $this->cvStorage->write(
            $fileName,
            $file->getContent(),
        );

        return $fileName;
    }

    /**
     * @throws FilesystemException
     */

    public function delete(string $fileName): void
    {
        if ($this->cvStorage->fileExists($fileName)) {
            $this->cvStorage->delete($fileName);
        }
    }
}
