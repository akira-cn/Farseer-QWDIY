<?php /* Smarty version Smarty-3.0.7, created on 2011-06-07 09:39:45
         compiled from "application/views/_smarty/modules.tpl" */ ?>
<?php /*%%SmartyHeaderCode:90314dedd5c1e7e739-96144093%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '242c136ed1e7076a7aa4d030908f51e2679e0965' => 
    array (
      0 => 'application/views/_smarty/modules.tpl',
      1 => 1307429390,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '90314dedd5c1e7e739-96144093',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<?php  $_smarty_tpl->tpl_vars['item'] = new Smarty_Variable;
 $_smarty_tpl->tpl_vars['key'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('modules')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if ($_smarty_tpl->_count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['item']->key => $_smarty_tpl->tpl_vars['item']->value){
 $_smarty_tpl->tpl_vars['key']->value = $_smarty_tpl->tpl_vars['item']->key;
?>
	<?php $_template = new Smarty_Internal_Template(($_smarty_tpl->tpl_vars['item']->value['url']), $_smarty_tpl->smarty, $_smarty_tpl, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null);
$_template->assign('data',$_smarty_tpl->tpl_vars['item']->value['data']); echo $_template->getRenderedTemplate();?><?php unset($_template);?>
<?php }} ?>
