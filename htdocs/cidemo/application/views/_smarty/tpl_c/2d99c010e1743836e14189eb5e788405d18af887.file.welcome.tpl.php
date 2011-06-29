<?php /* Smarty version Smarty-3.0.7, created on 2011-06-29 11:27:52
         compiled from "D:\workspace\git\fsdiy\htdocs\webroot/../cidemo/application/views/demos/welcome.tpl" */ ?>
<?php /*%%SmartyHeaderCode:107914e0a9bb8222a14-32659721%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '2d99c010e1743836e14189eb5e788405d18af887' => 
    array (
      0 => 'D:\\workspace\\git\\fsdiy\\htdocs\\webroot/../cidemo/application/views/demos/welcome.tpl',
      1 => 1308622212,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '107914e0a9bb8222a14-32659721',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_modifier_capitalize')) include 'D:\workspace\git\fsdiy\php5\lib\php-libs\CodeIgniter\system\libraries\smarty3\plugins\modifier.capitalize.php';
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