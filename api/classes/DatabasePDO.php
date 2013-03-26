<?php

require_once WWW_ROOT . 'classes' . DIRECTORY_SEPARATOR . 'Config.php';

class DatabasePDO
{
    /**
     * @var RiffDatabase $dbh   The database instance
     */
    private static $dbh;

    public static function getInstance()
    {
        if (!self::$dbh) {
            try {
                self::$dbh = new \Riff\Database\Database(Config::DB_NAME, Config::DB_TYPE, Config::DB_HOST, Config::DB_USER, Config::DB_PASS);
            } catch (\PDOException $e) {
                throw new \Exception($e->getMessage());
            }
        }

        return self::$dbh;
    }
}