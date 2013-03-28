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
    public $path;

    public function __construct ()
    {
        parent::__construct();

        $this->table = 'rolstende_events';
    }

    public function findById ($id)
    {
        try {
            $sql = 'SELECT rolstende_events.*, rolstende_events_photos.path FROM rolstende_events, rolstende_events_photos WHERE rolstende_events_photos.id = :id AND rolstende_events_photos.event_id = rolstende_events.id LIMIT 1';
            $query = new \Riff\Database\Query($sql, array('id' => $id));
            $result = $this->dbh->execute($query)->fetch(\PDO::FETCH_ASSOC);

            $this->id = (int) $result['id'];
            $this->start = $result['start'];
            $this->end = $result['end'];
            $this->name = $result['name'];
            $this->latitude = (float) $result['latitude'];
            $this->longitude = (float) $result['longitude'];
            $this->description = $result['description'];
            $this->address = $result['address'];
            $this->path = $result['path'];

        } catch (\Exception $e) {
            $this->id = 0;
            $this->start = '';
            $this->end = '';
            $this->title = '';
            $this->latitude = 0.0;
            $this->longitude = 0.0;
            $this->description = '';
            $this->path = 'noimage.jpg';
        }

        return $this;
    }

    public function findEventsForDay ($day, $month, $year)
    {
        $sql = "SELECT * FROM rolstende_events WHERE start <= ':startyear-:startmonth-:startday 00:00:00' AND end >= ':endyear-:endmonth-:endday 00:00:00'";
        $params = array();
        $params['startyear'] = $year;
        $params['startmonth'] = $month;
        $params['startday'] = $day;
        $params['endyear'] = $year;
        $params['endmonth'] = $month;
        $params['endday'] = $day;
        $query = new \Riff\Database\Query($sql);
        $result = $this->dbh->execute($query)->fetchAll(\PDO::FETCH_ASSOC);

        return $result;
    }

    public function findEventsForMonth ($month, $year)
    {
        $year = (int) $year;
        $month = (int) $month;

        $sql = "SELECT * FROM rolstende_events WHERE (DATE(start) >= DATE('" . $year . "-" . $month . "-01 00:00:00') "
             . "AND DATE(start) < DATE('" . $year . "-" . ($month + 1) . "-01 00:00:00')) "
             . "OR (DATE(end) > DATE('" . $year . "-" . ($month) . "-01 00:00:00') AND DATE(end) < DATE('" . $year . "-" . ($month + 1) . "-01 00:00:00'))";

        $query = new \Riff\Database\Query($sql);

        $result = $this->dbh->execute($query)->fetchAll(\PDO::FETCH_ASSOC);

        return $result;
    }

    public function getAll ()
    {
        return $this->dbh->select('*', $this->table);
    }
}