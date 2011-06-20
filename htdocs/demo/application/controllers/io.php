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
	public function data()
	{
		$timeout = $this->input->get_post("timeout", TRUE);

		if(empty($timeout))
			$timeout = 0;
		
		sleep($timeout);

		$content = $this->input->get_post("content", TRUE);

		if(empty($content))
			$content = "Hello, I'm the data from server!";
		

		$data = array_merge($_POST,array_merge($_GET, array(
			"content" => $content,
		)));

		$type = $this->input->get_post("type", TRUE);

		if("json" == $type){
			$this->tpl->callback(null, $data);
		}else if("jsonp" == $type){
			$this->tpl->callback(null, $data, "__callback");
		}
		else{
			echo('$_GET: ');
			var_dump($_GET);
			echo('$POST: ');
			var_dump($_POST);
		}
	}
}
