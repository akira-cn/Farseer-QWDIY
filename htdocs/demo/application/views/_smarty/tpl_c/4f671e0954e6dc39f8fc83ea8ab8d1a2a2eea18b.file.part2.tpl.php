<?php /* Smarty version Smarty-3.0.7, created on 2011-06-08 11:12:22
         compiled from "application/views/part2.tpl" */ ?>
<?php /*%%SmartyHeaderCode:132484deee896a95952-42981499%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4f671e0954e6dc39f8fc83ea8ab8d1a2a2eea18b' => 
    array (
      0 => 'application/views/part2.tpl',
      1 => 1307502740,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '132484deee896a95952-42981499',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php echo Hello::say($_smarty_tpl->getVariable('data')->value['name']);?>

<div><?php echo $_smarty_tpl->getVariable('data')->value['content'];?>
</div>
