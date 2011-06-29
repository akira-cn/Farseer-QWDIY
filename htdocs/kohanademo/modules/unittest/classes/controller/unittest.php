<?php defined('SYSPATH') or die('No direct script access.');

if ( ! class_exists('UnitTestCase', FALSE)){
	require_once Kohana::find_file('vendor', 'simpletest/unit_tester');
}

class Controller_UnitTest extends Controller{
	public function action_run($case){
		if(isSet($case)){
			$content = Kohana::find_file('unittest', $case);
		
			if(!$content)
				throw new Kohana_Exception("UnitTest doesn't exists! (unittest/$case.php)");
			else
				require_once $content;
		}else{ //find all
			$filelist = Kohana::list_files('unittest');

			foreach($filelist as $case){
				require_once $case;
			}
		}
	}
}