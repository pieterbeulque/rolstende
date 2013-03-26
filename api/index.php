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

require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'PointOfInterest.php';
require_once WWW_ROOT . 'models' . DIRECTORY_SEPARATOR . 'Event.php';

// Slim's autoloader also loads Riff!
\Slim\Slim::registerAutoloader();

use \Slim\Slim as Slim;

$app = new Slim();

$app->get('/pointsofinterest', function () {
    $poi = new PointOfInterest();
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
    $poi = new PointOfInterest();
    die(json_encode($poi->findById($id)));
});

$app->post('/subscribers', function () {
    $request = $app->request();
    $data['name'] = $request->post('name');
    $data['email'] = $request->post('email');

    $subscriber = new Subscriber();
    $subscriber->add($data);
});

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

$app->get('/event/:id', function ($id) {
	$event = new Event();
	die(json_encode($event->findByID($id)));
});

$app->run();