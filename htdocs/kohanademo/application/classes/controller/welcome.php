<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Welcome extends Controller {
	public function before(){
		$this->tpl = new Tpl();
	}
	public function action_index()
	{
		//$view = View::factory("test");
		//$this->response->body((string)$view);
		//Test::say("Hello world!");
		//$this->response->body('hello, world!');
		$this->tpl->view("test.tpl");
	}

} // End Welcome
