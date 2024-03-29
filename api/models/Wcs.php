<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class Wcs extends BaseModel
{

    public $id;
    public $name;
    public $address;
    public $latitude;
    public $longitude;


    public function __construct ()
    {
        parent::__construct();

        $this->table = 'rolstende_wcs';
    }


    public function findById ($id)
    {
        try {
            $result = $this->dbh->select('*', $this->table, array('id' => $id), 1);

            $this->id = (int) $result['id'];
            $this->name = $result['name'];
            $this->address = $result['address'];
            $this->latitude = (float) $result['latitude'];
            $this->longitude = (float) $result['longitude'];


           

        } catch (\Exception $e) {
            $this->id = 0;
            $this->name = '';
            $this->address = '';
            $this->latitude = 0.0;
            $this->longitude = 0.0;

        }

        return $this;
    }

    public function getAll ()
    {
        return $this->dbh->select('*', $this->table);
    }
}