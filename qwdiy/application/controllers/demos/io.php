<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Pure IO without TPL
 */
class IO extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * /demos/io/person
	 *
	 * test direct output
	 *
	 */
	public function index($person="world")
	{
		$this->output->set_output("Hello $person");
	}
}
