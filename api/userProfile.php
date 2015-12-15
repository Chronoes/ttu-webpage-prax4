<?php
require_once 'database/models/User.php';

function saveImage($userId, $imageURI) {
    if (strpos($imageURI, 'data:image') === 0) {
        list($type, $uri) = explode(';', $imageURI);
        $uri = explode(',', $uri)[1];
        $ext = str_replace('data:image/', '', $type);
        $filename = "../images/user_$userId.$ext";
        file_put_contents($filename, base64_decode($uri));
        return $filename;
    }
    return $imageURI;
}

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

case 'PUT':
    $body = $response->getRequestBody();
    $user->updateWith($body);
    $pictureFilename = saveImage($user->id, $body['imageURI']);
    $picture = $user->setPicture($pictureFilename);
    $newFields = $user->fields();
    $newFields['imageURI'] = $pictureFilename;
    unset($newFields['password']);
    return $response->status(200)->send([
        'message' => "User ID $payload[id] updated successfully",
        'profile' => $newFields
    ]);

default:
    return $response->status(501)->send(['message' => "$_SERVER[REQUEST_METHOD] has not been implemented for this route"]);
}

?>
