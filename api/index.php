<?php
function var_dumper() {
    ob_start();
    foreach (func_get_args() as $value) {
        var_dump($value);
    }
    $out = ob_get_clean();
    echo "<pre>$out</pre>";
}

error_reporting(E_ALL);
require 'constants.php';
require 'database/models/User.php';
require 'Authorization.php';

$user = User::create(array(
    'email' => 'test@gmail.com',
    'password' => 'plaintext',
    'displayName' => 'awwyeah',
    'fullName' => 'Not Me'
));

var_dumper((new User())->getTableName());
var_dumper($user->getTableName(), $user->email, $user->password, $user->displayName, $user->fullName);

$token = Authorization::generateToken(array('email' => $user->email));
var_dumper($token, Authorization::verifyToken($token));
var_dumper($_REQUEST);
var_dumper(json_decode(file_get_contents('php://input')));
var_dumper((new Database())->query('SHOW TABLES;')->fetchAll());

?>
