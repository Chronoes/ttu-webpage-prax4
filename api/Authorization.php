<?php

class Authorization {
    public static function genToken($payload) {
        $header = base64_encode(JWT_HEADER);
        $claims = base64_encode(json_encode($payload));
        $body = "$header.$claims";
        $checksum = base64_encode(self::jwtHash($body));
        $token = "$body.$checksum";
        return $token;
    }

    public static function verifyToken($token) {
        $parts = explode('.', $token);
        return self::jwtHash("$parts[0].$parts[1]") === base64_decode($parts[2]);
    }

    private static function jwtHash($payload) {
        return hash_hmac("sha256", $payload, SECRET);
    }

    public static function genSaltyHash($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    public static function compareSaltyHash($password, $hash) {
        return password_verify($password, $hash);
    }
}

?>
