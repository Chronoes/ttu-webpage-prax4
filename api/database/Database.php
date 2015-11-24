<?php
require_once __DIR__.'/../constants.php';

class DatabaseException extends Exception {}

class Database extends PDO {
    public function __construct() {
        parent::__construct('mysql:dbname='.DATABASE_NAME.';host='.DATABASE_SERVER, DATABASE_USERNAME, DATABASE_PASSWORD);
    }

    public static function formatTableName($string) {
        return TABLE_PREFIX.'_'.self::formatField($string);
    }

    public static function formatField($string) {
        $parts = array();
        preg_match_all('/[A-Z][a-z]+/', $string, $parts);
        return implode('_', array_map(function($part) {
            return mb_strtolower($part);
        }, $parts[0])).'s';
    }
}
?>
