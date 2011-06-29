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
define('SSI_SRC_PATH', realpath(SSI_ROOT_PATH . '/' . SSI_APP_NAME)); //当前应用的起始目录
define('SSI_PHP5_PATH', realpath(SSI_ROOT_PATH . '/../php')); //系统的PHP5安装目录
require $strConf;
