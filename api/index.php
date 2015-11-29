<?php
require 'constants.php';
require 'ResponseService.php';

$response = new ResponseService;

if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
    case 'login':
        include 'login.php';
        break;
    case 'register':
        include 'register.php';
        break;
    default:
        $response->status(501)->send(['message' => "\"$_REQUEST[action]\" has not been implemented."]);
        break;
    }
} else {
    $response->status(404)->send(['message' => 'Nothing here mate.']);
}
?>
