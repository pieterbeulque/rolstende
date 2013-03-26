<?php

require_once WWW_ROOT . 'controllers' . DIRECTORY_SEPARATOR . 'BaseController.php';
require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'PointOfInterest.php';

class PointOfInterestController extends BaseController
{
    public function __construct ()
    {
        parent::__construct();

        $this->models['poi'] = new PointOfInterest();
    }

    public function route ()
    {
        switch ($this->action) {
            case 'value':

                break;

            default:
                $this->index();
                break;
        }
    }

    public function index ()
    {
        $all = $this->models['poi']->getAll();

        $output = '{"results": [';

        foreach ($all as $point) {
            $output .= json_encode($point) . ', ';
        }

        $output = rtrim($output, ', ');

        $output .= ']}';

        die($output);
    }

    function findById ($id)
    {
        return $this->models['poi']->findById($id);
    }
}