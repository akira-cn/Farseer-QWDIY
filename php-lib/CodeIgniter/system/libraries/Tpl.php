<?
// load Smarty library

require('smarty3/Smarty.class.php');

// The setup.php file is a good place to load
// required application library files, and you
// can do that right here. An example:
// require(¡¯guestbook/guestbook.lib.php¡¯);

class Tpl extends Smarty {
	
	private $modules = array();

	function Tpl()
	{
		// Class Constructor.
		// These automatically get set with each new instance.
		parent::__construct();

		$this->template_dir = APPPATH."views/";
		$this->compile_dir = APPPATH."views/_smarty/tpl_c/";
		$this->config_dir = APPPATH."views/_smarty/configs/";
		$this->cache_dir = APPPATH."views/_smarty/cache/";

		$this->left_delimiter = '<%'; 
		$this->right_delimiter = '%>';
		
		//$this->compile_check = true;
		//this is handy for development and debugging;never be used in a production environment.
		//$smarty->force_compile=true;

		$this->debugging = false;
		$this->debug_tpl = '_smarty/debug.tpl';

		$this->cache_lifetime=30;
		$this->caching = 0; // lifetime is per cache
		//$this->assign(¡¯app_name¡¯, ¡®Guest Book¡¯);
		
		$this->configLoad("site.conf");
	}
	public function view($tpl="", $data=array())
	{
		if($tpl == 'debug'){
			$tpl="_smarty/default.tpl";
			$this->debugging = true;
		}
		if(!empty($tpl)){
			$this->append($tpl, $data);
		}
		$this->viewAll();
	}
	public function callback($tpl=null, $data=null, $name=null)
	{
		$data = json_encode($data);
		if(!empty($name)){
			$data = $name."(".$data.")";
		};

		if(empty($tpl)){
			echo $data.";";
		}else{
			$this->assign("data", array(
					"callback" => $data,
				));
			$this->display($tpl);
		}
	}
	public function append($tpl, $data=array()){
		if (!file_exists($this->template_dir.$tpl)) {
			$tpl = $tpl.".tpl";
		}
		/*$this->assign("data", $data);
		$this->display($tpl);
		flush();
		sleep(1);*/
		array_push(
			$this->modules,
			array(
				"url" => $tpl,
				"data" => $data,
			)	
		);
	}
	private function viewAll()
	{
		$tpl = "_smarty/modules.tpl";

		$this->assign("modules", $this->modules);
		$this->display($tpl);
	}
}
?>