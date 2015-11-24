<?php

require_once __DIR__.'/../Database.php';

class BaseModel {
    private static $dsn;
    private $tableName;
    private $fields;

    protected $id;
    protected $createdAt;

    public function __construct($fields, $requiredFields, $optionalFields = array()) {
        if (!self::$dsn instanceof Database) {
            self::$dsn = new Database();
        }
        $this->fields = array_intersect_key($fields, array_flip($requiredFields));
        if (count($this->fields) < count($requiredFields)) {
            // array_filter(array_flip($requiredFields), function($field) {
            //     return in_array($field, $filt)
            // }, ARRAY_FILTER_USE_BOTH);
            throw new DatabaseException('Database Error: missing required fields');
        }
        $this->tableName = Database::formatTableName(get_called_class());
    }

    public function __get($key) {
        return isset($this->$key) ? $this->$key : $this->fields[$key];
    }

    public function __set($key, $value) {
        $this->fields[$key] = $value;
    }

    public function getTableName() {
        return $this->tableName;
    }
}

?>
