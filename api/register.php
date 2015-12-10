<?php
require_once 'lib/Authorization.php';
require_once 'database/models/User.php';

$body = $response->getRequestBody();
$email = filter_var($body['email'], FILTER_VALIDATE_EMAIL);

if ($email) {
    $user = (new User)->findOne(['email' => $email]);
    if ($user === null) {
        $newUser = new User(['email' => $email, 'password' => Authorization::genSaltyHash($body['password'])]);
        $newUser->save();
        return $response->status(201)->send([
            'message' => 'Registration successful.',
            'token' => Authorization::genToken(['id' => $newUser->id, 'email' => $newUser->email])
        ]);
    }
}
return $response->status(403)->send(['message' => "User $email already exists."]);

?>
