<?php defined('SYSPATH') or die('No direct script access.');
/*
 * 扩展Response，增加json和jsonp的支持
 */
class Response extends Kohana_Response{
	function __construct(){
		parent::__construct();
	}
	public function jsonp($data,$callback="__callback"){
		$this->headers('Content-type', 'text/javascript');
		$this->body("$callback(".json_encode($data).");");
	}
	public function json($data,$callback=null){
		if(isset($callback))
			$this->jsonp($data,$callback);
		else
			$this->body(json_encode($data));
	}
}
?>