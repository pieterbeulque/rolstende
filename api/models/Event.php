<?php

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'BaseModel.php';

use \Riff\Riff as Riff;

class Event extends BaseModel
{

    public $id;
    public $start;
    public $end;
    public $title;
    public $description;
    public $latitude;
    public $longitude;

    public function __construct ()
    {
        parent::__construct();

        $this->table = 'events';
    }

    public function findById ($id)
    {
        try {

            $result = $this->dbh->select('*', $this->table, array('id' => $id), 1);
            $this->id = (int) $result['id'];
            $this->start = $result['start'];
            $this->end = $result['end'];
            $this->title = $result['title'];
            $this->latitude = (float) $result['latitude'];
            $this->longitude = (float) $result['longitude'];
            $this->description = $result['description'];


        } catch (\Exception $e) {
            $this->id = 0;
            $this->start = '';
            $this->end = '';
            $this->title = '';
            $this->latitude = 0.0;
            $this->longitude = 0.0;
            $this->description = '';
        }

        return $this;
    }

    public function getAll ()
    {
        return $this->dbh->select('*', $this->table);
    }
}