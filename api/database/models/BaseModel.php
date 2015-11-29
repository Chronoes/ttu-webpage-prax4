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
            self::$dsn = new Database;
        }
        if (!empty($fields)) {
            $this->fields = $this->validateNulls($fields, $fieldDefinitions);
        }
        $this->fieldDefinitions = $fieldDefinitions;
        $this->tableName = $tableName;
    }

    private function validateNulls($fields, $definitions) {
        foreach ($definitions as $key => $props) {
            if (isset($props['allowNull']) && !$props['allowNull'] && !in_array($key, array_keys($fields))) {
                throw new DatabaseException("Field \"$key\" cannot be NULL");
            }
        }
        return $fields;
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

    public function fields() {
        return array_merge(['id' => $this->id, 'createdAt' => $this->createdAt], $this->fields);
    }

    private function queryWhere($where) {
        if (count($where) > 0) {
            $sqlWhere = [];
            foreach ($where as $key => $action) {
                if (is_array($action)) {
                    $sqlWhere[] = "$key $action[op] :$key";
                } else {
                    $sqlWhere[] = "$key = :$key";
                }
            }
            return "WHERE ".implode("\nAND", $sqlWhere);
        }
        return '';
    }

    private function bindQueryParams(&$query, $params) {
        foreach ($params as $key => $action) {
            $value = is_array($action) ? $action['value'] : $action;
            $query->bindValue(":$key", $value, $this->fieldDefinitions[$key]['type']);
        }
    }

    private function select($where, $attributes, $extraStatements = '') {
        $fields = count($attributes) > 0 ? implode(', ', $attributes) : '*';
        $sql = "
        SELECT $fields
        FROM {$this->tableName}
        {$this->queryWhere($where)}
        $extraStatements
        ";

        $query = self::$dsn->prepare($sql);

        $this->bindQueryParams($query, $where);

        if (!$query->execute()) {
            $query->debugDumpParams();
            throw new DatabaseException(implode('; ', $query->errorInfo()));
        }

        return $query;
    }

    private function insertValues() {
        $result = ['columns' => [], 'values' => []];
        foreach ($this->fields as $key => $value) {
            $result['columns'][] = $key;
            $result['values'][] = ":$key";
        }
        return [
            'columns' => implode(', ', $result['columns']),
            'values' => implode(', ', $result['values'])
        ];
    }

    private function insert() {
        $insertValues = $this->insertValues();
        $sql = "
        INSERT INTO {$this->tableName}
            ($insertValues[columns])
        VALUES
            ($insertValues[values])";

        $query = self::$dsn->prepare($sql);

        $this->bindQueryParams($query, $this->fields);

        if (!$query->execute()) {
            $query->debugDumpParams();
            throw new DatabaseException(implode('; ', $query->errorInfo()));
        }

        return $query;
    }

    public function findOne($where = [], $attributes = []) {
        $query = $this->select($where, $attributes, 'LIMIT 1');
        $results = $query->fetch(Database::FETCH_ASSOC);
        if (empty($results)) {
            return null;
        }
        $this->id = $results['id'];
        $this->createdAt = $results['createdAt'];
        unset($results['id'], $results['createdAt']);

        foreach ($results as $key => $value) {
            $this->$key = $value;
        }

        return $this;
    }

    public function save() {
        $this->insert();
        $this->id = self::$dsn->lastInsertId();
    }
}

?>
