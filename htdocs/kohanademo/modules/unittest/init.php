<?php defined('SYSPATH') or die('No direct script access.');

// UnitTestController
Route::set('unittest', 'unittest(/<case>)')
	->defaults(array(
		'controller' => 'unittest',
		'action'     => 'run',
		'case'     => null,
	));