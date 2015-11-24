<?php
require_once 'BaseModel.php';

class User extends BaseModel {
    const REQUIRED_FIELDS = 'email,password,displayName,fullName';

    public function __construct($fields) {
        parent::__construct($fields, explode(',', self::REQUIRED_FIELDS));
    }
}

?>
