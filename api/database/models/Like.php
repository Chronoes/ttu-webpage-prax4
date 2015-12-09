<?php
require_once 'BaseModel.php';

class Like extends BaseModel {
    public static $fieldDefinitions = [
        'likerId' => ['type' => Database::PARAM_INT, 'allowNull' => false],
        'targetId' => ['type' => Database::PARAM_INT, 'allowNull' => false]
    ];

    public function __construct($fields = []) {
        return parent::__construct(Database::formatTableName(__CLASS__), $fields, self::$fieldDefinitions);
    }

    public function bothUsersLiked($userId, $otherId) {
        $sql = "
        SELECT COUNT(*) as count
        FROM {$this->getTableName()}
        WHERE
            likerId = :likerId AND targetId = :targetId
            OR
            likerId = :targetId AND targetId = :likerId
        ";
        $query = $this->rawQuery($sql, ['likerId' => $userId, 'targetId' => $otherId]);

        $results = $query->fetch(Database::FETCH_ASSOC);

        return (int) $results['count'];
    }
}

?>
