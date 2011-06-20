<?php /* Smarty version Smarty-3.0.7, created on 2011-06-20 23:41:36
         compiled from "C:\Users\akira\workspace\git\Farseer-QWDIY\htdocs\webroot/../demo/application/views/_smarty/default.tpl" */ ?>
<?php /*%%SmartyHeaderCode:93194dff6a30f070e0-66126640%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '6b670140c6f36777ee72761cc287a9673b6cae56' => 
    array (
      0 => 'C:\\Users\\akira\\workspace\\git\\Farseer-QWDIY\\htdocs\\webroot/../demo/application/views/_smarty/default.tpl',
      1 => 1307763475,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '93194dff6a30f070e0-66126640',
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

