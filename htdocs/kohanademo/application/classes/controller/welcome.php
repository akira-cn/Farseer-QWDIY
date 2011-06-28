<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Welcome extends Controller {
	public function before(){
		parent::before();
		$this->tpl = new Tpl();
	}
	public function action_index($id=null)
	{
		//$view = View::factory("test");
		//$view->render();
		
		//$this->response->body((string)$view);
		
		//Test::say("Hello world!");
		//$this->response->json(array('hello, world!'),$id);
		//echo 0; echo 1;
		$this->response->body("hello");
		//$this->response->render();

		//$this->response->body("world");

		//$r = Request::factory("welcome/foo");
		//$r->execute();

		//$this->tpl->view("test.tplq");
	}
	public function action_foo($id=null){
		$this->response->body(" world");
	}

} // End Welcome
