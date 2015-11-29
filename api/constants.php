<?php

$ini = parse_ini_file('conf.ini', true);

define('SECRET', $ini['api']['secret']);

define('DATABASE_SERVER', $ini['database']['server']);
define('DATABASE_PORT', $ini['database']['port']);
define('DATABASE_NAME', $ini['database']['name']);
define('DATABASE_USERNAME', $ini['database']['username']);
define('DATABASE_PASSWORD', $ini['database']['password']);
define('TABLE_PREFIX', $ini['database']['table_prefix']);

define('JWT_HEADER', json_encode([
    'typ' => 'JWT',
    'alg' => 'HS256'
]));

?>
