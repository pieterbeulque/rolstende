<?php

require_once WWW_ROOT . 'classes' . DIRECTORY_SEPARATOR . 'DatabasePDO.php';

class BaseModel
{
	/**
	 * Database instance
	 *
	 * @var RiffDatabase
	 */
    protected $dbh;

    /**
     * The most common table associated with the model
     *
     * @var string
     */
	protected $table;

	/**
	 * Initiate the database
	 */
    public function __construct()
    {
        $this->dbh = DatabasePDO::getInstance();
    }

}