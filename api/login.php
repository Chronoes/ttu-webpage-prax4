<?php
require_once 'lib/Authorization.php';
require_once 'database/models/User.php';

$body = $response->getRequestBody();
$email = filter_var($body['email'], FILTER_VALIDATE_EMAIL);

if ($email) {
    $user = (new User)->findOne(['email' => $email]);
    if ($user !== null && Authorization::compareSaltyHash($body['password'], $user->password)) {
        return $response->send([
            'message' => 'Login successful.',
            'token' => Authorization::genToken(['id' => $user->id, 'email' => $user->email])
        ]);
    }
}
return $response->status(400)->send(['message' => "User $email does not exist."]);

?>
