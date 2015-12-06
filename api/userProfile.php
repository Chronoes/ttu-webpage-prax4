<?php
require_once 'database/models/User.php';

$user = (new User)->findById((int) $payload['id']);
$fields = $user->fields();

switch ($_SERVER['REQUEST_METHOD']) {
case 'GET':
    $picture = $user->getPicture();
    $fields['imageURI'] = $picture->imageURI;
    unset($fields['password']);
    return $response->status(200)->send([
        'message' => "Retrieved user ID $payload[id] profile.",
        'profile' => $fields
    ]);

case 'POST':
    $body = $response->getRequestBody();
    $user->updateWith($body);
    $picture = $user->setPicture($body['imageURI']);
    $newFields = $user->fields();
    $newFields['imageURI'] = $picture->imageURI;
    unset($newFields['password']);
    return $response->status(200)->send([
        'message' => "User ID $payload[id] updated successfully",
        'profile' => $newFields
    ]);

default:
    return $response->status(501)->send(['message' => "$_SERVER[REQUEST_METHOD] has not been implemented for this route"]);
}

?>
