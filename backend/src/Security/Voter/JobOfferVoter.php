<?php

namespace App\Security\Voter;

use App\Entity\JobOffer;
use App\Entity\User;
use App\Enum\User\UserRole;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class JobOfferVoter extends Voter
{

    public const string CREATE = 'JOB_OFFER_CREATE';
    public const string EDIT   = 'JOB_OFFER_EDIT';
    public const string DELETE = 'JOB_OFFER_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::CREATE, self::EDIT, self::DELETE])
            && ($subject instanceof JobOffer || $subject === null);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::CREATE => $user->getRole() === UserRole::RECRUITER,
            self::EDIT, self::DELETE => $user->getRole() === UserRole::RECRUITER
                && $subject instanceof JobOffer
                && $subject->getOwner() === $user,
            default      => false,
        };
    }
}
