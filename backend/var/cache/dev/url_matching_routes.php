<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
        '/api/applications' => [[['_route' => 'app_application_apply', '_controller' => 'App\\Controller\\ApplicationController::apply'], null, ['POST' => 0], null, false, false, null]],
        '/api/applications/my' => [[['_route' => 'app_application_myapplications', '_controller' => 'App\\Controller\\ApplicationController::myApplications'], null, ['GET' => 0], null, false, false, null]],
        '/api/auth/register' => [[['_route' => 'app_auth_register', '_controller' => 'App\\Controller\\AuthController::register'], null, ['POST' => 0], null, false, false, null]],
        '/api/candidates/me' => [
            [['_route' => 'app_candidate_getme', '_controller' => 'App\\Controller\\CandidateController::getMe'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_candidate_create', '_controller' => 'App\\Controller\\CandidateController::create'], null, ['POST' => 0], null, false, false, null],
            [['_route' => 'app_candidate_update', '_controller' => 'App\\Controller\\CandidateController::update'], null, ['PATCH' => 0], null, false, false, null],
        ],
        '/api/candidates/me/cv' => [[['_route' => 'app_candidate_uploadcv', '_controller' => 'App\\Controller\\CandidateController::uploadCv'], null, ['POST' => 0], null, false, false, null]],
        '/api/job-offers' => [
            [['_route' => 'app_joboffer_getjoboffers', '_controller' => 'App\\Controller\\JobOfferController::getJobOffers'], null, ['GET' => 0], null, false, false, null],
            [['_route' => 'app_joboffer_createjoboffer', '_controller' => 'App\\Controller\\JobOfferController::createJobOffer'], null, ['POST' => 0], null, false, false, null],
        ],
        '/api/recruiter/stats' => [[['_route' => 'app_recruiter_stats', '_controller' => 'App\\Controller\\RecruiterController::stats'], null, ['GET' => 0], null, false, false, null]],
        '/api/recruiter/recent-applications' => [[['_route' => 'app_recruiter_recentapplications', '_controller' => 'App\\Controller\\RecruiterController::recentApplications'], null, ['GET' => 0], null, false, false, null]],
        '/api/search/candidates' => [[['_route' => 'app_search_searchcandidates', '_controller' => 'App\\Controller\\SearchController::searchCandidates'], null, ['GET' => 0], null, false, false, null]],
        '/api/auth/login' => [[['_route' => 'api_auth_login'], null, ['POST' => 0], null, false, false, null]],
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:35)'
                .'|/api/(?'
                    .'|job\\-offers/([^/]++)(?'
                        .'|/applications(*:86)'
                        .'|(*:93)'
                    .')'
                    .'|applications/([^/]++)/(?'
                        .'|candidate(*:135)'
                        .'|override(*:151)'
                        .'|status(*:165)'
                    .')'
                    .'|candidates/([^/]++)/cv(*:196)'
                .')'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        35 => [[['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null]],
        86 => [[['_route' => 'app_application_jobofferapplications', '_controller' => 'App\\Controller\\ApplicationController::jobOfferApplications'], ['id'], ['GET' => 0], null, false, false, null]],
        93 => [
            [['_route' => 'app_joboffer_getjoboffer', '_controller' => 'App\\Controller\\JobOfferController::getJobOffer'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => 'app_joboffer_updatejoboffer', '_controller' => 'App\\Controller\\JobOfferController::updateJobOffer'], ['id'], ['PATCH' => 0], null, false, true, null],
            [['_route' => 'app_joboffer_deletejoboffer', '_controller' => 'App\\Controller\\JobOfferController::deleteJobOffer'], ['id'], ['DELETE' => 0], null, false, true, null],
        ],
        135 => [[['_route' => 'app_application_candidateprofile', '_controller' => 'App\\Controller\\ApplicationController::candidateProfile'], ['id'], ['GET' => 0], null, false, false, null]],
        151 => [[['_route' => 'app_application_override', '_controller' => 'App\\Controller\\ApplicationController::override'], ['id'], ['PATCH' => 0], null, false, false, null]],
        165 => [[['_route' => 'app_application_updatestatus', '_controller' => 'App\\Controller\\ApplicationController::updateStatus'], ['id'], ['PATCH' => 0], null, false, false, null]],
        196 => [
            [['_route' => 'app_candidate_downloadcv', '_controller' => 'App\\Controller\\CandidateController::downloadCv'], ['id'], ['GET' => 0], null, false, false, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
