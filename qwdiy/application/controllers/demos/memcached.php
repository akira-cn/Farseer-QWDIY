<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * Pure IO without TPL
 */
class Memcached extends CI_Controller {

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
		$mem = new Memcache;
		$mem->connect("127.0.0.1", 11211);
		$mem->set('key', 'This is a test!', 0, 60);
		$val = $mem->get('key');
		$this->output->set_output($val);
	}
}
