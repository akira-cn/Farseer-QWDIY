<?php /* Smarty version Smarty-3.0.7, created on 2011-06-07 09:51:45
         compiled from "application/views/_smarty/default.tpl" */ ?>
<?php /*%%SmartyHeaderCode:236584dedd891bc9b51-81362680%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ffdd6eb62e2a698f67d0f43fd27ff6c1b7f61af7' => 
    array (
      0 => 'application/views/_smarty/default.tpl',
      1 => 1307433089,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '236584dedd891bc9b51-81362680',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php if (empty($_smarty_tpl->getVariable('data',null,true,false)->value)){?>
	no data
<?php }else{ ?>
	<?php echo json_encode($_smarty_tpl->getVariable('data')->value);?>

<?php }?>

