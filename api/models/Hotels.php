<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class Hotels extends BaseModel
{

    public $id;
    public $name;
    public $address;
    public $latitude;
    public $longitude;
    public $description;
    public $path;

    public function __construct ()
    {
        parent::__construct();

        $this->table = 'rolstende_hotels';
    }


    public function findById ($id)
    {
        try {
            $sql = 'SELECT rolstende_hotels.*, rolstende_hotels_photos.path FROM rolstende_hotels, rolstende_hotels_photos WHERE rolstende_hotels.id = :id AND rolstende_hotels_photos.hotel_id = rolstende_hotels.id LIMIT 1';
            $query = new \Riff\Database\Query($sql, array('id' => $id));
            $result = $this->dbh->execute($query)->fetch(\PDO::FETCH_ASSOC);

            $this->id = (int) $result['id'];
            $this->name = $result['name'];
            $this->address = $result['address'];
            $this->latitude = (float) $result['latitude'];
            $this->longitude = (float) $result['longitude'];
            $this->description = $result['description'];
            $this->available = $result['available'];
            $this->path = $result['path'];

        } catch (\Exception $e) {
            $this->id = 0;
            $this->name = '';
            $this->address = '';
            $this->latitude = 0.0;
            $this->longitude = 0.0;
            $this->description = '';
            $this->path = 'noimage.jpg';
        }

        return $this;
    }

    public function getAll ()
    {
        return $this->dbh->select('*', $this->table);
    }
}