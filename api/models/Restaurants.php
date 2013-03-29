<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class Restaurants extends BaseModel
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

        $this->table = 'rolstende_restaurants';
    }


    public function findById ($id)
    {
        try {
            $sql = 'SELECT rolstende_restaurants.*, rolstende_restaurants_photos.path FROM rolstende_restaurants, rolstende_restaurants_photos WHERE rolstende_restaurants_photos.id = :id AND rolstende_restaurants_photos.restaurant_id = rolstende_restaurants.id LIMIT 1';
            $query = new \Riff\Database\Query($sql, array('id' => $id));
            $result = $this->dbh->execute($query)->fetch(\PDO::FETCH_ASSOC);

            $this->id = (int) $result['id'];
            $this->name = $result['name'];
            $this->address = $result['address'];
            $this->latitude = (float) $result['latitude'];
            $this->longitude = (float) $result['longitude'];
            $this->description = $result['description'];
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

    public function checkIfOpen($id)
    {
        $id = (int) $id;

        $now = getdate();

        $where = array();
        $where['restaurant_id'] = $id;
        $where['hour_' . (string) $now['hours']] = '1';
        $where['day'] = (string) $now['wday'];

        $result = $this->dbh->select('1', 'rolstende_hours', $where, 1);

        return (count($result) === 1);
    }

    public function getAll ()
    {
        $sql = 'SELECT rolstende_restaurants.*, rolstende_restaurants_photos.path FROM rolstende_restaurants, rolstende_restaurants_photos WHERE rolstende_restaurants_photos.restaurant_id = rolstende_restaurants.id';
        $query = new \Riff\Database\Query($sql);
        $result = $this->dbh->execute($query)->fetchAll(\PDO::FETCH_ASSOC);

        foreach ($result as $key => $value) {
            $result[$key]['isOpen'] = $this->checkIfOpen($value['id']);
        }

        return $result;
    }
}