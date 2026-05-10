<?php

namespace App\Security\Voter;

use App\Entity\Application;
use App\Entity\JobOffer;
use App\Entity\User;
use App\Enum\User\UserRole;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ApplicationVoter extends Voter
{
    public const string APPLY    = 'APPLICATION_APPLY';
    public const string VIEW     = 'APPLICATION_VIEW';
    public const string OVERRIDE = 'APPLICATION_OVERRIDE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::APPLY, self::VIEW, self::OVERRIDE])
            && ($subject instanceof Application || $subject instanceof JobOffer || $subject === null);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::APPLY    => $user->getRole() === UserRole::CANDIDATE,
            self::VIEW     => $user->getRole() === UserRole::RECRUITER
                && $subject instanceof JobOffer
                && $subject->getOwner() === $user,
            self::OVERRIDE => $user->getRole() === UserRole::RECRUITER
                && $subject instanceof Application
                && $subject->getJobOffer()->getOwner() === $user,
            default        => false,
        };
    }
}
