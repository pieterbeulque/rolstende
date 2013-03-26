<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class PointOfInterest extends BaseModel
{

    public $id;
    public $name;
    public $type;
    public $address;
    public $latitude;
    public $longitude;
    public $description;

    public $isOpen;

    public function __construct ()
    {
        parent::__construct();

        $this->table = 'points_of_interest';
    }

    public function checkIfOpen()
    {
        if (!isset($this->id)) return false;

        $now = getdate();

        $where = array();
        $where['poi_id'] = $this->id;
        $where['hour_' . (string) $now['hours']] = '1';
        $where['day'] = (string) $now['wday'];

        $result = $this->dbh->select('1', 'hours', $where, 1);

        return (count($result) === 1);
    }

    public function findById ($id)
    {
        try {
            $result = $this->dbh->select('*', $this->table, array('id' => $id), 1);

            $this->id = (int) $result['id'];
            $this->name = $result['name'];
            $this->type = $result['type'];
            $this->address = $result['address'];
            $this->latitude = (float) $result['latitude'];
            $this->longitude = (float) $result['longitude'];
            $this->description = $result['description'];

            $this->checkIfOpen();

            try {
                $this->isOpen = $this->checkIfOpen();
            } catch (\Exception $e) {
                $this->isOpen = false;
            }

        } catch (\Exception $e) {
            $this->id = 0;
            $this->name = '';
            $this->type = '';
            $this->address = '';
            $this->latitude = 0.0;
            $this->longitude = 0.0;
            $this->description = '';
            $this->isOpen = false;
        }

        return $this;
    }

    public function getAll ()
    {
        return $this->dbh->select('*', $this->table);
    }
}