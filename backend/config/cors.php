<?php

$origins = array_values(array_filter(array_map(
    trim(...),
    explode(',', (string) env('FRONTEND_ORIGINS', 'http://127.0.0.1:5173,http://localhost:5173')),
)));

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $origins === [] ? ['http://127.0.0.1:5173'] : $origins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-Request-Id'],

    'max_age' => 0,

    'supports_credentials' => false,

];
