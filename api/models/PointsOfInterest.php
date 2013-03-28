<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class PointsOfInterest extends BaseModel
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

        $this->table = 'rolstende_points_of_interest';
    }

    public function findById ($id)
    {
        try {
            $sql = 'SELECT rolstende_points_of_interest.*, rolstende_points_of_interest_photos.path FROM rolstende_points_of_interest, rolstende_points_of_interest_photos WHERE rolstende_points_of_interest_photos.id = :id AND rolstende_points_of_interest_photos.point_of_interest_id = rolstende_points_of_interest.id LIMIT 1';
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

    public function getAll ()
    {
        $sql = 'SELECT rolstende_points_of_interest.*, rolstende_points_of_interest_photos.path FROM rolstende_points_of_interest, rolstende_points_of_interest_photos WHERE rolstende_points_of_interest_photos.point_of_interest_id = rolstende_points_of_interest.id';
        $query = new \Riff\Database\Query($sql);
        $result = $this->dbh->execute($query)->fetchAll(\PDO::FETCH_ASSOC);

        return $result;
    }
}