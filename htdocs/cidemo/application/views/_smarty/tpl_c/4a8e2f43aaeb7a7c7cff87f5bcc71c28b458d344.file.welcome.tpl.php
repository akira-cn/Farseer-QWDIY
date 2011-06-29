<?php /* Smarty version Smarty-3.0.7, created on 2011-06-20 23:37:17
         compiled from "C:\Users\akira\workspace\git\Farseer-QWDIY\htdocs\webroot/../demo/application/views/demos/welcome.tpl" */ ?>
<?php /*%%SmartyHeaderCode:185224dff692d0e7726-02551858%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4a8e2f43aaeb7a7c7cff87f5bcc71c28b458d344' => 
    array (
      0 => 'C:\\Users\\akira\\workspace\\git\\Farseer-QWDIY\\htdocs\\webroot/../demo/application/views/demos/welcome.tpl',
      1 => 1307763475,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '185224dff692d0e7726-02551858',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_modifier_capitalize')) include 'C:\Users\akira\workspace\git\Farseer-QWDIY\php-lib\CodeIgniter\system\libraries\smarty3\plugins\modifier.capitalize.php';
?><!doctype html>
<html>
	<head>
		<title> <?php echo $_smarty_tpl->getVariable('data')->value['title'];?>
 </title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	</head>

	<body>
		<div> <?php echo smarty_modifier_capitalize($_smarty_tpl->getVariable('data')->value['message']);?>
 </div>
	</body>
</html>