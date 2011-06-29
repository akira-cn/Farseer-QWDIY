<?php /* Smarty version Smarty-3.0.7, created on 2011-06-24 13:08:21
         compiled from "D:\workspace\git\fsdiy\htdocs\webroot/../demo/application/views/demos/welcome.tpl" */ ?>
<?php /*%%SmartyHeaderCode:213744e041bc5eab135-52845671%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f60073210fbfd0713f26ed4e5b84b007fb245ea1' => 
    array (
      0 => 'D:\\workspace\\git\\fsdiy\\htdocs\\webroot/../demo/application/views/demos/welcome.tpl',
      1 => 1308622212,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '213744e041bc5eab135-52845671',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_modifier_capitalize')) include 'D:\workspace\git\fsdiy\php-lib\CodeIgniter\system\libraries\smarty3\plugins\modifier.capitalize.php';
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