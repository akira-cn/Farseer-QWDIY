<?php /* Smarty version Smarty-3.0.7, created on 2011-06-27 21:17:42
         compiled from "D:\workspace\git\fsdiy\htdocs\kohanademo\application\views/_smarty/modules.tpl" */ ?>
<?php /*%%SmartyHeaderCode:224764e0882f6a7f349-31678120%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'bec844daf8dc6be16bbff7f322d1f96b37e9718b' => 
    array (
      0 => 'D:\\workspace\\git\\fsdiy\\htdocs\\kohanademo\\application\\views/_smarty/modules.tpl',
      1 => 1308622212,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '224764e0882f6a7f349-31678120',
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
