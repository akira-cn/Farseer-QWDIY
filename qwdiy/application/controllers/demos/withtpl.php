<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * use TPL
 */
class WithTpl extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * /demos/withtpl/person
	 *
	 * test direct output
	 *
	 */
	public function index($person="world")
	{
		$data = array(
			"title" => "welcome",
			"message" => "Hello $person",
		);

		$this->tpl->view("demos/welcome",$data);
	}
	public function sec_input($str="<script>alert(0);</script>")
	{
		$str = $this->security->xss_clean($str);

		$data = array(
			"title" => "sec_input",
			"message" => $str,
		);

		$this->tpl->view("demos/sec_input", $data);
	}
	public function callback(){
		$data = array(
			"somedata",	
		);

		$this->tpl->callback(null, $data, "__callback");
	}
	public function modules()
	{
		$top = array(
			"title" => "modules",
		);
		$this->tpl->append("demos/top.inc", $top);
		
		$main = array(
			"message" => "main",
		);
		$this->tpl->append("demos/main.inc", $main);
		
		$footer = array(
			"message" => "footer",
		);
		$this->tpl->append("demos/footer.inc", $footer);

		$this->tpl->view();
	}
}
