<?php
require_once 'BaseModel.php';

class User extends BaseModel {
    private static $fieldDefinitions = [
        'email' => ['type' => Database::PARAM_STR, 'unique' => true, 'allowNull' => false],
        'password' => ['type' => Database::PARAM_STR, 'allowNull' => false],
        'displayName' => ['type' => Database::PARAM_STR],
        'fullName' => ['type' => Database::PARAM_STR]
    ];

    public function __construct($fields = []) {
        return parent::__construct(Database::formatTableName(__CLASS__), $fields, self::$fieldDefinitions);
    }
}

?>
