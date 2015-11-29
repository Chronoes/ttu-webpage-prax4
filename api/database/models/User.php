<?php
require_once 'BaseModel.php';

class User extends BaseModel {
    private static $fieldDefinitions = array(
        'email' => array('type' => Database::PARAM_STR, 'unique' => true),
        'password' => array('type' => Database::PARAM_STR),
        'displayName' => array('type' => Database::PARAM_STR),
        'fullName' => array('type' => Database::PARAM_STR)
    );

    public function __construct() {
        return parent::__construct(Database::formatTableName(__CLASS__), array(), self::$fieldDefinitions);
    }

    public static function create($fields) {
        return ModelFactory::createFromValues(__CLASS__, $fields, self::$fieldDefinitions);
    }
}

?>
