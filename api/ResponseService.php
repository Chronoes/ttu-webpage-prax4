<?php

class ResponseService {
    private static $statusInfo = [
        200 => 'OK',
        201 => 'Created',
        400 => 'Bad Request',
        403 => 'Forbidden',
        404 => 'Not Found',
        501 => 'Not Implemented'
    ];

    private $statusCode = 200;
    private $requestBody;

    public function __construct() {
        header('Accept: application/json');
        header('Content-Type: application/json;charset=utf-8');
        $this->requestBody = json_decode(file_get_contents('php://input'), true);
    }

    public function getRequestBody() {
        return $this->requestBody;
    }

    public function status($statusCode) {
        $this->statusCode = $statusCode;
        return $this;
    }

    public function send($data) {
        $statusText = self::$statusInfo[$this->statusCode];
        header("HTTP/1.1 {$this->statusCode} $statusText");
        header("Status: {$this->statusCode} $statusText");

        $json = json_encode($data);
        header('Content-Length: '.mb_strlen($json));
        echo $json;
    }
}
?>
