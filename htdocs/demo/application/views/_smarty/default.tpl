<%if empty($data)%>
	no data
<%else%>
	<%json_encode($data)%>
<%/if%>

