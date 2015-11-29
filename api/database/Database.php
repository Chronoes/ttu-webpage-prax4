<?php
require_once __DIR__.'/../constants.php';

class DatabaseException extends Exception {}

class Database extends PDO {
    public function __construct() {
        parent::__construct('mysql:dbname='.DATABASE_NAME.';host='.DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD);
    }

    public static function formatTableName($string) {
        $parts = [];
        preg_match_all('/[A-Z][a-z]+/', $string, $parts);
        return TABLE_PREFIX.'_'.implode('_', array_map(function($part) {
            return mb_strtolower($part);
        }, $parts[0])).'s';
    }
}
?>
