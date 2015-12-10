<?php

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

class Authorization {
    public static function genToken($payload) {
        $header = base64url_encode(JWT_HEADER);
        $encodedPayload = base64url_encode(json_encode($payload));
        $checksum = base64url_encode(self::jwtHash($header, $encodedPayload));
        return "$header.$encodedPayload.$checksum";
    }

    public static function verifyToken($token) {
        $parts = explode('.', $token);
        if (self::jwtHash($parts[0], $parts[1]) === base64url_decode($parts[2])) {
            return json_decode(base64url_decode($parts[1]), true);
        }
        return false;
    }

    public static function verifyHeaders($headers) {
        if (isset($headers['Authorization'])) {
            return str_replace('Bearer ', '', $headers['Authorization']);
        }
        return false;
    }

    public static function decodeToken($token) {
        $payload = explode('.', $token)[1];
        return json_decode(base64url_decode($payload), true);
    }

    private static function jwtHash($header, $payload) {
        return hash_hmac("sha256", "$header.$payload", SECRET, true);
    }

    public static function genSaltyHash($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }

    public static function compareSaltyHash($password, $hash) {
        return password_verify($password, $hash);
    }
}

?>
