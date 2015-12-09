<?php

require_once __DIR__.'/../Database.php';

class BaseModel {
    private static $dsn;
    private $tableName;
    private $fieldDefinitions;
    private $fields;
    private $staticFieldDefinitions = [
        'id' => ['type' => Database::PARAM_INT],
        'createdAt' => ['type' => Database::PARAM_STR]
    ];

    protected $id;
    protected $createdAt;

    public function __construct($tableName, $fields, $fieldDefinitions) {
        if (!self::$dsn instanceof Database) {
            self::$dsn = new Database;
        }
        if (!empty($fields)) {
            $this->fields = $this->validateNulls($fields, $fieldDefinitions);
        }
        $this->fieldDefinitions = array_merge($this->staticFieldDefinitions, $fieldDefinitions);
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
        if (isset($this->fieldDefinitions[$key])) {
            $this->fields[$key] = $value;
        } else {
            throw new DatabaseException("$key is not a valid field");
        }
    }

    public function getTableName() {
        return $this->tableName;
    }

    public function fields() {
        return array_merge(['id' => $this->id, 'createdAt' => $this->createdAt], $this->fields);
    }

    private function queryOperations($operationList) {
        $operations = [];
        foreach ($operationList as $key => $action) {
            if (is_array($action)) {
                $operations[] = "$key $action[op] :$key";
            } else {
                $operations[] = "$key = :$key";
            }
        }
        return $operations;
    }

    private function queryWhere($where) {
        if (count($where) > 0) {
            $sqlWhere = $this->queryOperations($where);
            return "WHERE ".implode("\nAND ", $sqlWhere);
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
        FROM $this->tableName
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

    private function selectCount($where = []) {
        $sql = "
        SELECT
            COUNT(*) as count
        FROM $this->tableName
        {$this->queryWhere($where)}
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

    private function insert($ignore = false) {
        $insertValues = $this->insertValues();
        $ignoreInsert = $ignore ? 'IGNORE' : '';
        $sql = "
        INSERT $ignoreInsert INTO $this->tableName
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

    private function update($where = []) {
        $queryOps = implode(', ', $this->queryOperations($this->fields));
        $sql = "
        UPDATE $this->tableName
        SET $queryOps
        {$this->queryWhere($where)}";

        $query = self::$dsn->prepare($sql);

        $this->bindQueryParams($query, array_merge($this->fields, $where));

        if (!$query->execute()) {
            $query->debugDumpParams();
            throw new DatabaseException(implode('; ', $query->errorInfo()));
        }

        return $query;
    }

    private function assignAttributes($results, $attributes) {
        if (!empty($attributes)) {
            $results = array_merge($attributes, $results);
        }

        if (isset($results['id'])) {
            $this->id = $results['id'];
            unset($results['id']);
        }

        if (isset($results['createdAt'])) {
            $this->createdAt = $results['createdAt'];
            unset($results['createdAt']);
        }

        foreach ($results as $key => $value) {
            $this->$key = $value;
        }
    }

    private function fetchData(&$query, $attributes = []) {
        $results = $query->fetch(Database::FETCH_ASSOC);
        if (empty($results)) {
            return null;
        }

        $this->assignAttributes($results, $attributes);

        return $this;
    }

    protected function getAssociation($foreignId) {
        $query = $this->select([$this->fieldDefinitions['foreignKey'] => $foreignId], [], 'LIMIT 1');
        return $this->fetchData($query);
    }

    protected function rawQuery($sql, $params = []) {
        $query = self::$dsn->prepare($sql);

        $this->bindQueryParams($query, $params);

        if (!$query->execute()) {
            $query->debugDumpParams();
            throw new DatabaseException(implode('; ', $query->errorInfo()));
        }

        return $query;
    }

    public function findOne($where = [], $attributes = []) {
        $query = $this->select($where, $attributes, 'LIMIT 1');
        return $this->fetchData($query, $attributes);
    }

    public function findOneRandom($where = [], $attributes = []) {
        $query = $this->select($where, $attributes, 'ORDER BY RAND() LIMIT 1');
        return $this->fetchData($query, $attributes);
    }

    public function findById($id, $attributes = []) {
        $query = $this->select(['id' => $id], $attributes);
        return $this->fetchData($query, $attributes);
    }

    public function count($where = []) {
        $query = $this->selectCount($where);
        $results = $query->fetch(Database::FETCH_ASSOC);
        return (int) $results['count'];
    }

    public function save($ignore = false) {
        $this->insert($ignore);
        $this->id = self::$dsn->lastInsertId();
        return $this;
    }

    public function updateWith($newFields) {
        unset($newFields['id'], $newFields['createdAt']);
        foreach ($newFields as $key => $value) {
            if (!in_array($key, array_keys($this->fields))) {
                unset($newFields[$key]);
            }
        }
        $this->fields = array_merge($this->fields, $newFields);
        $this->update(['id' => $this->id]);
        $this->assignAttributes($newFields, []);
        return $this;
    }
}

?>
