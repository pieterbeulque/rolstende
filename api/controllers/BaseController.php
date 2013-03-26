<?php

class BaseController
{
    /**
     * Action to do
     *
     * @var string
     */
    protected $action;

    /**
     * Allow redirect or not (can be set to false when showing error messages etc)
     *
     * @var bool
     */
    protected $allowRedirect = true;

    /**
     * Is the current session logged in or not
     *
     * @var bool
     */
    protected $isLoggedIn;

    /**
     * All initiated models
     *
     * @var array
     */
    protected $models;

    /**
     * Initiate the controller and its dependencies
     */
    public function __construct()
    {
        $this->action = (isset($_GET['action']) && !empty($_GET['action'])) ? $_GET['action'] : 'index';
        $this->models = array();
    }

    /**
     * Fallback so the application will not crash when accidentaly the route() function
     */
    public function route()
    {
    }

    /**
     * Fallback so the application will not crash when accidentaly the index() function
     */
    public function index()
    {

    }
}