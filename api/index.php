<?php
require 'constants.php';
require 'lib/ResponseService.php';
require 'lib/Authorization.php';

$response = new ResponseService;

function tokenCheck($response) {
    $token = Authorization::verifyHeaders(getallheaders());
    if (!$token) {
        $response->status(401)->send(['message' => 'Authorization header is required.']);
        return false;
    } else if ($payload = Authorization::verifyToken($token)) {
        return $payload;
    } else {
        $response->status(401)->send(['message' => 'Token is invalid']);
        return false;
    }
}

if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
    case 'login':
        include 'login.php';
        break;
    case 'register':
        include 'register.php';
        break;
    case 'profile':
        if ($payload = tokenCheck($response)) include 'userProfile.php';
        break;
    case 'randomProfile':
        if ($payload = tokenCheck($response)) include 'randomProfile.php';
        break;
    case 'addLike':
        if ($payload = tokenCheck($response)) include 'addLike.php';
        break;
    default:
        $response->status(501)->send(['message' => "\"$_REQUEST[action]\" has not been implemented."]);
        break;
    }
} else {
    $response->status(400)->send(['message' => 'Parameter "action" is required.']);
}
?>
