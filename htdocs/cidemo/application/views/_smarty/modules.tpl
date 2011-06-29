<%foreach name=layout from=$modules item=item key=key%>
	<%include file="<%$item.url%>" data=$item.data%>
<%/foreach%>
