<?php

class ResponseService {
    private static $statusInfo = [
        200 => 'OK',
        201 => 'Created',
        400 => 'Bad Request',
        401 => 'Unauthorized',
        403 => 'Forbidden',
        404 => 'Not Found',
        501 => 'Not Implemented'
    ];

    private $requestBody;
    private $statusHeadersSent = false;

    public function __construct() {
        header('Accept: application/json');
        header('Content-Type: application/json;charset=utf-8');
        $this->requestBody = json_decode(file_get_contents('php://input'), true);
    }

    public function getRequestBody() {
        return $this->requestBody;
    }

    public function header($header, $value) {
        header("$header: $value");
        return $this;
    }

    public function status($statusCode = 200) {
        $statusText = self::$statusInfo[$statusCode];
        header("HTTP/1.1 $statusCode $statusText");
        header("Status: $statusCode $statusText");
        $this->statusHeadersSent = true;
        return $this;
    }

    public function send($data) {
        if (!$this->statusHeadersSent) {
            $this->status();
        }

        $json = json_encode($data);
        header('Content-Length: '.mb_strlen($json));
        echo $json;
    }
}
?>
