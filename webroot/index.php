<?php
date_default_timezone_set("Asia/Shanghai");
define('SSI_ROOT_PATH' , dirname(__FILE__) . '/..');
define('SSI_REQUEST_ID', (intval(gettimeofday(true) * 100000) & 0x7FFFFFFF));

$strUrl = strip_tags($_SERVER['REQUEST_URI']);
$arrUrl = explode('/', $strUrl);
if (! isset($arrUrl[1])) {
	echo 'Access Deny!';
	exit(0);
}
$strModule = $arrUrl[1];
$strConf = SSI_ROOT_PATH . "/{$strModule}/index.php";
if (! file_exists($strConf)) {
	//$strModule的合法值[A-Za-z0-9_\-]，且必须真实存在
	echo 'Access Deny! '.$strConf;
	exit(0);
}

define('SSI_APP_NAME', $strModule);
require $strConf;
