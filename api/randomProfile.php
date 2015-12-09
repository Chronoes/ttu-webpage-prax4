<?php
require_once 'database/models/User.php';
require_once 'database/models/Like.php';

$user = (new User)->findById((int) $payload['id']);

$randomUser = (new User)->findOneRandom([
    'id' => ['op' => '!=', 'value' => $user->id],
    'gender' => ['op' => '!=', 'value' => $user->gender]
]);

if (!$randomUser) {
    return $response->status(400)->send(['message' => 'No other users exist']);
}

$likeCount = (new Like)->bothUsersLiked($user->id, $randomUser->id);

$fields = $randomUser->fields();
$picture = $randomUser->getPicture();
$fields['imageURI'] = $picture->imageURI;
$fields['userLiked'] = $likeCount >= 2;
unset($fields['password']);
return $response->status(200)->send([
    'message' => "Retrieved user ID $randomUser->id profile.",
    'profile' => $fields
]);


?>
