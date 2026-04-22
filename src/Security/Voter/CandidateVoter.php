<?php

namespace App\Security\Voter;

use App\Entity\Candidate;
use App\Entity\User;
use App\Enum\User\UserRole;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class CandidateVoter extends Voter
{
    public const string CREATE = 'CANDIDATE_CREATE';
    public const string EDIT   = 'CANDIDATE_EDIT';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::CREATE, self::EDIT])
            && ($subject instanceof Candidate || $subject === null);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        return match ($attribute) {
            self::CREATE => $user->getRole() === UserRole::CANDIDATE,
            self::EDIT   => $user->getRole() === UserRole::CANDIDATE
                && $subject instanceof Candidate
                && $subject->getCandidateUser() === $user,
            default      => false,
        };
    }
}
