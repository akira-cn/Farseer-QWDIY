/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.1.1
build: 47
*/
YUI.add("anim-node-plugin",function(B){var A=function(C){C=(C)?B.merge(C):{};C.node=C.host;A.superclass.constructor.apply(this,arguments);};A.NAME="nodefx";A.NS="fx";B.extend(A,B.Anim);B.namespace("Plugin");B.Plugin.NodeFX=A;},"3.1.1",{requires:["node-pluginhost","anim-base"]});