<?php defined('SYSPATH') or die('No direct script access.');

abstract class Controller extends Kohana_Controller {
	/**
	 * Automatically executed before the controller action.
	 *
	 * @return  void
	 */
	public function before()
	{
		if (count($_POST) > 0 and !isset($_POST['kohana_csrf_token']) and !CSRF::valid($_POST['kohana_csrf_token'])){
			throw new Kohana_Exception('CSRF Detected');
		}else{
            unset($_POST['kohana_csrf_token']);
			Cookie::$salt = "snda_inn";
			Cookie::set('kohana_csrf_token', CSRF::generate());
        }
	}
}