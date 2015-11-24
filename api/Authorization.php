<?php

class Authorization {
    public static function generateToken($payload) {
        $header = base64_encode(JWT_HEADER);
        $claims = base64_encode(json_encode($payload));
        $body = "$header.$claims";
        $checksum = base64_encode(self::hash($body));
        $token = "$body.$checksum";
        return $token;
    }

    public static function verifyToken($token) {
        $parts = explode('.', $token);
        return self::hash("$parts[0].$parts[1]") === base64_decode($parts[2]);
    }

    private static function hash($payload) {
        return hash_hmac("sha256", $payload, SECRET);
    }
}

?>
