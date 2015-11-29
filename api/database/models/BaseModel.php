<?php

require_once __DIR__.'/../Database.php';

class BaseModel {
    private static $dsn;
    private $tableName;
    private $fieldDefinitions;
    private $fields;

    protected $id;
    protected $createdAt;

    public function __construct($tableName, $fields, $fieldDefinitions) {
        if (!self::$dsn instanceof Database) {
            self::$dsn = new Database();
        }
        $this->fields = $fields;
        $this->fieldDefinitions = $fieldDefinitions;
        $this->tableName = $tableName;
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

    public function findOne($attributes = array(), $where = array()) {
        $fields = count($attributes) > 0 ? implode(', ', $attributes) : '*';
        $sql = "
            SELECT $fields
            FROM {$this->tableName}
        ";

        if (count($where) > 0) {
            $sqlWhere = array();
            foreach ($where as $key => $action) {
                $sqlWhere[] = "$key $action[op] $action[value]";
            }
            $sql .= "
            WHERE ".implode("\nAND", $sqlWhere)."
            ";
        }
        $sql .= 'LIMIT 1';
        $query = self::$dsn->prepare($sql);

        foreach ($where as $key => $action) {
            $query->bindParam(":$key", $action['value'], $this->fieldDefinitions[$key]);
        }
    }
}

class ModelFactory {
    public static function create($name, $fieldDefinitions) {
        return new BaseModel(Database::formatTableName($name), array(), $fieldDefinitions);
    }

    public static function createFromValues($name, $fields, $fieldDefinitions) {
        $fields = array_intersect_key($fields, $fieldDefinitions);
        if (count($fields) < count($fieldDefinitions)) {
            throw new DatabaseException('Database Error: missing required fields');
        }
        return new BaseModel(Database::formatTableName($name), $fields, $fieldDefinitions);
    }
}

?>
