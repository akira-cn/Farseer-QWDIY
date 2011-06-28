<?php /* Smarty version Smarty-3.0.7, created on 2011-06-27 23:04:50
         compiled from "C:\Users\akira\workspace\git\Farseer-QWDIY\htdocs\kohanademo\application\views/_smarty/modules.tpl" */ ?>
<?php /*%%SmartyHeaderCode:298434e089c12cc9056-64117645%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ffb3c4843dfc9ba473eaebc0e95abb2b5c8e01f6' => 
    array (
      0 => 'C:\\Users\\akira\\workspace\\git\\Farseer-QWDIY\\htdocs\\kohanademo\\application\\views/_smarty/modules.tpl',
      1 => 1308622212,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '298434e089c12cc9056-64117645',
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
