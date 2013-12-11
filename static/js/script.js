
var playerAId;
var playerBId;

function compare()
{
	$("#mainTeamPage").hide();
	$("#comparePlayers").load("/compare");
}

function backMain()
{
	$("#mainTeamPage").show();
	$("#comparePlayers").html(" ");
}


$(document).ready(function(){
	var players={}
	$("#week").change(function(){
		var week = $("#week :selected").val();
		console.log(week);
		$.ajax({
			url:"getRecommendations",
			datatype:"json",
			data: {week:week},
			success:function(data){
				if(data){
					setPlayers(data);
					var team=[];
					$("#receivers").empty();
					$("#tightends").empty();
					$("#quarterbacks").empty();
					$("#runningbacks").empty();
					$("#defense").empty();
					$("#kicker").empty();
					$.each(data, function(key,player){
						team.push(player[1][1]);
					});
					console.log(team);
					$.each(team, function(key,value){
							if(value[2] == "WR"){
								$("#receivers").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</span></div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
							}
							else if(value[2] == "TE"){
								$("#tightends").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
							}
							else if(value[2] == "QB"){								
								$("#quarterbacks").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
							}
							else if(value[2] == "RB"){								
								$("#runningbacks").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
							}
							else if(value[2] == "DEF"){								
								$("#defense").append("<div id='"+value[0]+"' class='card def'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
							}
							else								
								$("#kicker").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");								
					});
				}
			}
		});
	});
	$.ajax({
		url:"getRecommendations",
		datatype:"json",
		success:function(data){
			if(data){
				setPlayers(data);
				var team=[];
				$.each(data, function(key,player){
					team.push(player[1][1]);
				});
				$.each(team, function(key,value){
						if(value[2] == "WR"){
							$("#receivers").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</span></div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
						}
						else if(value[2] == "TE"){
							$("#tightends").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
						}
						else if(value[2] == "QB"){
							$("#quarterbacks").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
						}
						else if(value[2] == "RB"){
							$("#runningbacks").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
						}
						else if(value[2] == "DEF"){
							$("#defense").append("<div id='"+value[0]+"' class='card def'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
						}
						else 
							$("#kicker").append("<div id='"+value[0]+"' class='card'><header><span>"+value[1]+"</span></header><img src='static/images/"+value[1]+".jpg' alt='"+value[1]+"'><div id='stats'><div>"+value[2]+"</div><div><span>Rating<br>"+value[3].toFixed(2)+"</div></div><div id='rec'><img src='static/images/"+value[4]+".jpg'><a id='"+key+"' class='analysis' href='#'>Why?</a></div>");
				});
			}
		}
	});
	function setPlayers(data){
		players=data;
		//console.log(players);	
	}
	$(document).on("click",".analysis",function(){
		var ide = this.id;
		var comparison_data = "";
		comparison_data=players[ide];
		if(typeof comparison_data[0] == "string")
		comparison_data.shift();
		console.log(comparison_data);
		data = {};
		player1 ="";
		player1 = [];
		player1.push(comparison_data[0][0]);
		player1.push(comparison_data[0][1][0]);
		player1.push(comparison_data[0][1][3].toFixed(2))
		player2="";
		player2 = [];
		player2.push(comparison_data[1][0]);
		player2.push(comparison_data[1][1][0]);
		player2.push(comparison_data[1][1][3].toFixed(2))
		$("#mainTeamPage").hide();
		$("#comparePlayers").load("/compare");
		//console.log(player1);
		playerSelection(player1,player2);
	});
	
});


