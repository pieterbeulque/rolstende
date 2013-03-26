<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class PointOfInterest extends BaseModel
{

    public $id;
    public $name;
    public $email;

    public function __construct ()
    {
        parent::__construct();

        $this->table = 'subscribers';
    }

    public function add ($data)
    {
        if (!Riff\Filter\Filter::isEmail($data['email'])) return false;

        try {
            $this->id = $this->dbh->insert($this->table, $data);
            $this->name = $data['name'];
            $this->email = $data['email'];
        } catch (\Exception $e) {
            $this->id = 0;
            $this->name = '';
            $this->email = '';
        }

        return $this;
    }

    public function findById ($id)
    {
        try {
            $result = $this->dbh->select('*', $this->table, array('id' => $id), 1);

            $this->id = (int) $result['id'];
            $this->name = $result['name'];
            $this->email = $result['email'];
        } catch (\Exception $e) {
            $this->id = 0;
            $this->name = '';
            $this->email = '';
        }

        return $this;
    }

    public function getAll ()
    {
        return $this->dbh->select('*', $this->table);
    }
}