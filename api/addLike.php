<?php
require_once 'database/models/Like.php';

$body = $response->getRequestBody();
if ((int) $body['id'] <= 0) {
    return $response->status(400)->send(['message' => 'No such user id.']);
}
$where = ['likerId' => (int) $payload['id'], 'targetId' => (int) $body['id']];

$existingLikes = (new Like)->count($where);

if ($existingLikes !== 0) {
    return $response->status(200)->send(['message' => 'User already liked.']);
}

$like = new Like($where);
$like->save(true);

return $response->status(201)->send(['message' => 'Like added to user.']);
?>
