<?php

/**
 * This file is the API entry point.
 * .htaccess redirects all requests to this file
 * and puts the request in $_GET['r']
 */

header('Content-type: application/json');

define('WWW_ROOT', dirname(__FILE__) . DIRECTORY_SEPARATOR);

// Include dependencies
require_once WWW_ROOT . 'classes' . DIRECTORY_SEPARATOR . 'Config.php';
require_once WWW_ROOT . 'libs' . DIRECTORY_SEPARATOR . 'Slim' . DIRECTORY_SEPARATOR . 'Slim.php';

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'PointsOfInterest.php';
require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'Event.php';
require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'Hotels.php';
require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'Restaurants.php';
require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'Wcs.php';

// Slim's autoloader also loads Riff!
\Slim\Slim::registerAutoloader();

use \Slim\Slim as Slim;

$app = new Slim();

$app->get('/all', function () {
    $poi = new PointsOfInterest();
    $allpoi = $poi->getAll();
    
    $hotels = new Hotels();
    $allhotels = $hotels->getAll();

    $restaurants = new Restaurants();
    $allrestaurants = $restaurants->getAll();

    $wcs = new Wcs();
    $allwcs = $wcs->getAll();

    $output = '{"results": {';
    $output .= '"pointsofinterest": [';

    foreach ($allpoi as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= '], "hotels": [';

    foreach ($allhotels as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= '], "restaurants": [';

    foreach ($allrestaurants as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= '], "wcs": [';

    foreach ($allwcs as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= ']}}';

    die($output);
});

/********************************************************************************
********************************** POINTS OF INTEREST ***************************
********************************************************************************/

$app->get('/pointsofinterest', function () {
    $poi = new PointsOfInterest();
    $all = $poi->getAll();

    $output = '{"results": [';

    foreach ($all as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= ']}';

    die($output);
});

$app->get('/pointsofinterest/:id', function ($id) {
    $poi = new PointsOfInterest();
    die(json_encode($poi->findById($id)));
});


/********************************************************************************
********************************** HOTELS  **************************************
********************************************************************************/

$app->get('/hotels', function () {
    $hotels = new Hotels();
    $all = $hotels->getAll();

    $output = '{"results": [';

    foreach ($all as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= ']}';

    die($output);
});

$app->get('/hotels/:id', function ($id) {
    $hotels = new Hotels();
    die(json_encode($hotels->findById($id)));
});


/********************************************************************************
********************************** RESTAURANTS  *********************************
********************************************************************************/

$app->get('/restaurants', function () {
    $restaurants = new Restaurants();
    $all = $restaurants->getAll();

    $output = '{"results": [';

    foreach ($all as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= ']}';

    die($output);
});

$app->get('/restaurants/:id', function ($id) {
    $restaurants = new Restaurants();
    die(json_encode($restaurants->findById($id)));
});



/********************************************************************************
********************************** WCS  *****************************************
********************************************************************************/

$app->get('/wcs', function () {
    $wcs = new Wcs();
    $all = $wcs->getAll();

    $output = '{"results": [';

    foreach ($all as $point) {
        $output .= json_encode($point) . ', ';
    }

    $output = rtrim($output, ', ');

    $output .= ']}';

    die($output);
});

$app->get('/wc/:id', function ($id) {
    $wcs = new Wcs();
    die(json_encode($wcs->findById($id)));
});



/********************************************************************************
********************************** EVENTS ***************************************
********************************************************************************/

$app->get('/events', function() {
    $events = new Event();
    $all = $events->getAll();
    $output = '{"results": [';

    foreach ($all as $event) {
        $output .= json_encode($event) . ', ';
    }

    $output = rtrim($output, ', ');
    $output .= ']}';

    die($output);
    
});

$app->get('/events/:id', function ($id) {
    $event = new Event();
    die(json_encode($event->findByID($id)));
});

$app->run();


/********************************************************************************
********************************** SUBSCRIBERS **********************************
********************************************************************************/

$app->post('/subscribers', function () {
    $request = $app->request();
    $data['name'] = $request->post('name');
    $data['email'] = $request->post('email');

    $subscriber = new Subscriber();
    $subscriber->add($data);
});

