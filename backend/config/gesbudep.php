<?php

return [
    'lockout' => [
        'max_attempts' => (int) env('AUTH_LOCKOUT_ATTEMPTS', 5),
        'minutes' => (int) env('AUTH_LOCKOUT_MINUTES', 15),
    ],

    'password' => [
        'min_length' => 12,
    ],
];
