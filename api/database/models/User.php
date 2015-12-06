<?php
require_once 'BaseModel.php';
require_once 'Picture.php';

class User extends BaseModel {
    public static $fieldDefinitions = [
        'email' => ['type' => Database::PARAM_STR, 'unique' => true, 'allowNull' => false],
        'password' => ['type' => Database::PARAM_STR, 'allowNull' => false],
        'gender' => ['type' =>Database::PARAM_STR],
        'displayName' => ['type' => Database::PARAM_STR],
        'fullName' => ['type' => Database::PARAM_STR],
        'description' => ['type' => Database::PARAM_STR]
    ];

    public function __construct($fields = []) {
        return parent::__construct(Database::formatTableName(__CLASS__), $fields, self::$fieldDefinitions);
    }

    public function getPicture() {
        $picture = new Picture;
        $picture->getAssociation($this->id);
        return $picture;
    }

    public function setPicture($imageURI) {
        if (!isset($this->id)) {
            throw new DatabaseException('Need to initialise the instance first');
        }
        $picture = new Picture(['userId' => $this->id, 'imageURI' => $imageURI]);
        $picture->save();
        return $picture;
    }
}

?>
