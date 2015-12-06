<?php
require_once 'BaseModel.php';

class Picture extends BaseModel {
    public static $fieldDefinitions = [
        'userId' => ['type' => Database::PARAM_INT],
        'imageURI' => ['type' => Database::PARAM_STR, 'allowNull' => false],
        'foreignKey' => 'userId'
    ];

    public function __construct($fields = []) {
        return parent::__construct(Database::formatTableName(__CLASS__), $fields, self::$fieldDefinitions);
    }
}

?>
