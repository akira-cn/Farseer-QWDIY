<?php /* Smarty version Smarty-3.0.7, created on 2011-06-09 11:04:06
         compiled from "application/views/demos/welcome.tpl" */ ?>
<?php /*%%SmartyHeaderCode:56944df03826aa8664-03590029%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4f1f4418bac2e9683c7ad51dd5fa1f80cd0faf40' => 
    array (
      0 => 'application/views/demos/welcome.tpl',
      1 => 1307588643,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '56944df03826aa8664-03590029',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (!is_callable('smarty_modifier_capitalize')) include 'D:\workspace\dev\lsphp\application\libraries\smarty3\plugins\modifier.capitalize.php';
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