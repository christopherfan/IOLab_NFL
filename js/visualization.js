


var playerA;
var playerB;
function playerSelection(player1,player2)
{
	//d3.select('body').style("background-color","WhiteSmoke");
	d3.json("static/Data/ffTeamsStatistics_FreeAgents_Final.json",function(error,json)
	{
		console.log(json);
		var team = json['Wait for it'];
		playerA = json['BOSS MARTINFL'][1];
		playerB = team[0];
		playerComparison();
		playerComparisonFantasy(playerA,playerB);
	});
}




function playerComparison()
{
	//$("#playerA img").attr('src',"img/"+playerA.player_name.split(" ").join("").split(".").join("")+".jpg");
	$("#playerA").css("background-image","url(img/"+playerA.player_name.split(" ").join("").split(".").join("")+".jpg)")	
	
	console.log(playerA.team);
	$("#playerA div.playerName").text(playerA.player_name);
	$("#playerA div.recomendation span.position_cat").text(playerA.position);
	$("#playerA div.recomendation img").attr("src","http://i.nflcdn.com/static/site/5.17/img/logos/teams-matte-80x53/"+playerA.team+".png");
	$("#playerA div.recomendation span.scoring").text(50.1);
	


	//$("#playerB img").attr('src',"img/"+playerB.player_name.split(" ").join("").split(".").join("")+".jpg");
	$("#playerB").css("background-image","url(img/"+playerB.player_name.split(" ").join("").split(".").join("")+".jpg)");

	$("#playerB div.playerName").text(playerB.player_name);
	$("#playerB div.playerName").text(playerB.player_name);
	$("#playerB div.recomendation span.position_cat").text(playerB.position);
	$("#playerB div.recomendation img").attr("src","http://i.nflcdn.com/static/site/5.17/img/logos/teams-matte-80x53/"+playerB.team+".png");

	$("#playerB div.recomendation span.scoring").text(39.1);
	
	categoryWinners();
	
	//playerComparisonBars();
}	

function setCategoryWinners(stat,week)
{
	var a = getStatTotal(playerA,stat,week);
	var b = getStatTotal(playerB,stat,week);
	var team ='';

	if (a == 0 && b == 0)
	{
		$("#"+stat+"_cat").hide();
	} 
	else
	{
		if (a>b)
		{
			team = playerA.team;	
		}
		else
		{
			team = playerB.team;
		}
		$("#"+stat+"_cat" + " img").attr("src","http://i.nflcdn.com/static/site/5.17/img/logos/teams-matte-80x53/"+team+".png")
	}
	

	console.log($("#"+stat+"_cat"));
	
	// console.log(getMax('receiving_yds',10));

	// console.log(getStatTotal(playerA,'receiving_yds',10));
	// console.log(getStatTotal(playerB,'receiving_yds',10));
}

function categoryWinners()
{
	setCategoryWinners('passing_yds',10);
	setCategoryWinners('passing_tds',10);
	setCategoryWinners('receiving_yds',10);
	setCategoryWinners('receiving_tds',10);
	setCategoryWinners('rushing_tds',10);
	setCategoryWinners('rushing_yds',10);
}

function statFantasySelection()
{
	playerComparisonFantasy();
}

function getStatTotal(player,stat,week)
{
	var total =0;
	$.each(player.stats, function(i,item)
	{
		if(i <=week)
		{
			total+= item[stat];
		}
	});
	return total;

}

/*
	Function used when selection a stat the user wants to breakdown on a bar chart per week.

	IN:
		stat: Football statistic selected to display in a graph.
*/
function statSelection(stat)
{
	playerComparisonBars(stat,10);
}


/*
	Function that sets the height and y value of the bars in the graph, on at a time, to enable the transition when creating the graph.

	IN:
		chart: object with the chart that includes the bars
		playerA: statistics for the first player compared
		playerB: statistics for the second player compared
		params: object with the parameters used to create and render the chart
*/
function redoStats(chart,playerA,playerB,params)
{
	//Changing the values of the bars for the first player only.
	chart.selectAll("rect.player0").data(playerA)
			.transition().delay(function (d,i){ return i * 200;})
			.duration(200)
			.attr({
				"height": function(d)
				{
					return (d.yards*params.chartHeight)/params.max;
				},
				"y": function(d,i)
				{
					return params.y(d.yards);
				}
			});
	//Changing the values of the bars for the second player only.
	chart.selectAll("rect.player1").data(playerB)
			.transition().delay(function (d,i){ return i * 200;})
			.duration(200)
			.attr({
				"height": function(d)
				{
					return (d.yards*params.chartHeight)/params.max;
				},
				"y": function(d,i)
				{
					return params.y(d.yards);
				}
			});
}

/*
	Function that analyzes the full stats of a particular player and returns a JSON object with only the values for a stat considered in the amount of weeks determined. Used for simplicity of datasets.

	IN:
		player: object with the full statistics of a player in a year
		statName: name of the statistic to be analyzed
		weeks: number of weeks to be considered in the analysis
	OUT:
		yearStats: JSON object with only the values week by week of the statistic considered in the timeframed defined.
*/
function getPlayerStats(player,statName,weeks)
{
	var yearStats = [];
	$.each(player.stats,function(i,week)
	{
		// Only considers the weekly results in the timeframe defined, skips the averages and totals
		if(i != "AVG" && i!="TOTAL" && i<=weeks)
		{
			yearStats.push({ week: i, yards: week[statName]});
		}
	});
	return yearStats;
}

/*
	Function that sets the parameters by which the graph will be drawn and renders the basic elements of the graph. These parameters change depending on the Football Stat that will be graphed and also depends on the actual statistics of the players that will be compared.

	IN:
		stat: Name of the stat that will be graphed
		weeks: Number of weeks considered for the stat
		playerA: Weekly stats of the first player to be compared
		playerB: Weekly stats of the second player to be compared
		chart: Object of the empty chart that will be rendered with these paremeters
		height: height of the chart that will be created
		wdith: width of the chart that will be created

	OUT:
		params: Object with multiple parameters used to create this chart.
				- x: contains a function with the xScale,
				- y: contains a function with the yScale,
				- max: contains the maximum value for the stat by any player,
				- chartHeight: height of the chart
				- chartWidth: width of the chart,
				- margin: Object with the values for the x and y margins used to render the char (xMargin, yMargin)
*/
function setComparisonParameters(stat,weeks,chart,height,width)
{
	//chart.style("background-color","WhiteSmoke")

	//Creating the parameters for the chart
	var chartWidth = width;
	var chartHeight = height;
	var xMargin = 60;
	var yMargin = 50;
	
	//Setting up the size of the chart in the SVG
	chart.attr("width",chartWidth).attr("height",chartHeight+(yMargin*1.5));
	
	var yMax=0;
	var yTicks=0;
	var unit='';
	console.log(stat);
	var maxStat = getMax(stat,weeks);

	// Defining the label of the Y Axis based on the stat
	if(stat.search("passing")!=-1)
	{
		unit = "Passing ";
	}
	else if (stat.search("rushing")!=-1)
	{
		unit = "Rushing ";
	}
	else if(stat.search("receiving")!=-1)
	{
		unit = "Receiving "; 
	}

	if(stat.search("tds")!=-1)
	{
		yMax = maxStat+1;
		yTicks = maxStat+1
		unit+= "Touchdowns"
	}
	else if (stat.search("yds")!=-1)
	{
		if(maxStat ==1)
		{
			yMax = maxStat;
			yTicks = 1;
		}
		else
		{
			yMax = maxStat+(20-(maxStat%20));
			yTicks = yMax/20;	
		}
		
		unit+="Yards";
	}
	
	// Creating the scales and axis for the chart
	var xScale = d3.scale.linear()
					.range([xMargin,chartWidth])
					.domain([1,weeks+1]);
	
	var yScale = d3.scale.linear()
					.range([chartHeight+20,20])
					.domain([0,yMax]);
	
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.ticks(weeks+1);
		chart.append("g")
				.attr("class","x axis "+stat)
				.attr("transform","translate(-10,"+((chartHeight+20)+1)+")")
			.call(xAxis)
			.selectAll("text")
				.attr("transform","translate("+(chartWidth/(weeks+1))/2+",0)");

	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks(yTicks);

	//Adding both axis to the chart
	chart.append("g")
			.attr("class","y axis "+stat)
			.attr("transform","translate("+(xMargin -10)+",1)")
			.call(yAxis);

	d3.select(".y.axis."+stat)
		.append("text")
			.text(unit)
			.attr("font-size","18")
			.attr("transform", "rotate(-90) translate(-"+((chartHeight)+20)+",-35)" );

	d3.select(".x.axis."+stat)
		.append("text")
			.text("Week")
			.attr("font-size","18")
			.attr("transform", "translate("+(chartWidth/2)+","+(yMargin-10)+")");
	
	// Adding the tick lines to the chart
	for(var i = (yMax/yTicks); i<=yMax;i+=(yMax/yTicks))
	{
		chart.append("line")
				.attr(
				{
					"x1": xMargin-10,
					"x2": chartWidth-10,
					"y1": yScale(i)+1,
					"y2": yScale(i)+1,
					"fill":"black"
				});
	}

	// Returning the chart's parameters so they can be used in while creating the bars for both players
	return {x:xScale,y:yScale,"max":yMax,chartHeight:chartHeight,chartWidth:chartWidth,margin:{xMargin:xMargin,yMargin:yMargin}, height:chartHeight};
}

function getMax(statName,week)
{
	var maxA = getMaxStats(playerA,statName,week);
	var maxB = getMaxStats(playerB,statName,week);
	var maxStat;


	//Setting the scale based on the maximum value of both players
	if(maxA ==0 && maxB ==0)
	{
		maxStat =1;
	}
	else
	{
		if (maxA>=maxB)
			maxStat = maxA;
		else 
			maxStat = maxB;
	}

	//Setting the scale based on the maximum value of both players
	if(maxA ==0 && maxB ==0)
	{
		maxStat =1;
	}
	else
	{
		if (maxA>=maxB)
			maxStat = maxA;
		else 
			maxStat = maxB;
	}
	return maxStat;
}

/*
	Function the analyzes the stats of a particular player in a particular number of weeks and return the maximum value achieved by the player.

	IN: 
		playerStats: JSON object with the full stats, week by week of a particular player.
		statName: name of the statistic that will be evaluated
		week: number of weeks to be considered in the evaluation
	OUT:
		max: maximum value of the statistic evaluated for all the weeks considered.
*/
function getMaxStats(playerStats,statName,week)
{
	var max =0;
	$.each(playerStats.stats,function(i,stat)
	{
		// Only considers the weekly results in the timeframe defined, skips the averages and totals
		if(i != "AVG" && i!="TOTAL" && i<=week)
		{
			if(max<stat[statName])
			{
				max = stat[statName];
			}
			
		}
			
	})
	return max;
}

function getTitle(stat)
{
	console.log(stat)
	var title = "";
	if(stat.search("receiving")!=-1)
		title = "Receiving";
	else if(stat.search("passing")!=-1)
		title = "Passing";
	else
		title = "Rushing";

	if(stat.search("tds")!=-1)
		title += " Touchdowns";
	else
		title += " Yards";

	return title;

}

/*
	Function used to compare two players for a specific statistic or metric with a Bar Graph.

	IN:
		playersA: JSON object with the statistics of the players to compare
		playersB: JSON object with the statistics of the players to compare
*/
function playerComparisonBars(stat,weeks)
{	
	d3.select("body").select("#graphs").insert("div",":first-child")
						.attr("class","nflGraph")
						.attr("id",stat)
						.append("div")
							.attr("class","sectionTitle")
							.text(getTitle(stat));

	var ydsChart = d3.select("#"+stat)
						.append("svg")
							// .attr("width",900)
							// .attr("height",350)
							//.style("background-color","black")
							//.style("margin","10px");

	var params = setComparisonParameters(stat,weeks,ydsChart,200,900);
	
	var aStats = getPlayerStats(playerA,stat,weeks);
	var bStats = getPlayerStats(playerB,stat,weeks);
	
	playerComparisonBreakdown(ydsChart,aStats,playerA.player_name,playerA.team,0,params);
	playerComparisonBreakdown(ydsChart,bStats,playerB.player_name,playerB.team,1,params);
	
	redoStats(ydsChart,aStats,bStats,params);
}

function playerComparisonBreakdown(chart,player,playerName,team,playerTurn,params)
{
	
	var barWidth =(((params.chartWidth - params.margin.xMargin)/player.length)/2)-10;
	var lines = chart.selectAll("rect.lineYds.player"+playerTurn+"."+team)
						.data(player)
						.enter()
						.append("rect")
							.attr("class","lineYds player"+playerTurn+" "+team);

	var xScale = params.x;
	var yScale = params.y;

	
	lines.attr(
		{
			"height": 0,
			"width": barWidth,
			"x": function(d,i)
			{
				return (xScale(i+1)+(playerTurn*barWidth));	
			},
			"y": params.chartHeight+20,
		})

	chart.selectAll('text.'+team)
			.data(player)
			.enter()
			.append("text")
				//.attr("class",playerName.split(" ").join("").split(".").join(""))
				.attr("class",team)
			.text(function(d)
			{
				return d.yards;
			})
			.attr(
			{
				"x": function(d,i)
				{
					return (xScale(i+1)+(playerTurn*barWidth))+1;	
				},
				"y":function(d,i)
				{
					return yScale(d.yards)-5;
				},
				"font-size":"12"
			});
}

function setFantasyComparisonParameters(chart)
{

	var chartWidth = 375;
	var chartHeight = 200
	var xMargin = 10;
	var yMargin = 10;

	chart.style("display","inline-block")
			//.style("background-color","WhiteSmoke")
			.attr({
				"width":chartWidth,
				"height":chartHeight
			});
	//console.log(playerA);
	var xMax = 0;
	if(playerA.fantasyStats.TOTAL.total >= playerB.fantasyStats.TOTAL.total)
	{	
		xMax = playerA.fantasyStats.TOTAL.total;
	}
	else
	{
		xMax = playerB.fantasyStats.TOTAL.total;
	}
	xTicks = (xMax+(20-(xMax%20)))/20;
	//console.log(xTicks);

	// Creating the scales and axis for the chart
	var xScale = d3.scale.linear()
					.range([chartWidth-10,xMargin])
					.domain([1,xMax]);
	
	var yScale = d3.scale.linear()
					.range([chartHeight+20,20])
					.domain([1,6]);
	
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.ticks((xTicks+1));
	chart.append("g")
			.attr("class","x axis ")
			.attr("transform","translate(9,"+(chartHeight-20)+")")
		.call(xAxis)
		.selectAll("text")
			//.attr("transform","translate("+(chartWidth/(xTicks))+",0)");

	return {x:xScale,y:yScale,"max":xMax,chartHeight:chartHeight,chartWidth:chartWidth,margin:{xMargin:xMargin,yMargin:yMargin}};
}

function playerComparisonFantasy()
{
	//console.log(playerA);
	playerA = addFantasyTotals(playerA);
	playerB = addFantasyTotals(playerB);
	var height = 120

	console.log(playerA);

	 d3.select("body").select("#timeLine").append("svg")
	 				.attr("class","timeline")
					.attr("width", 900)
					.attr("height", height)
					//.style("background-color","WhiteSmoke")
					.style("margin-top","10px");
	
	d3.select("svg.timeline")
		.selectAll("circle")
		.data(getFantasyTotal(playerA.fantasyStats))
		.enter()
		.append("circle")
			.attr("class","p1");
			
	d3.select("svg.timeline")
		.selectAll("circle.p2")
		.data(getFantasyTotal(playerB.fantasyStats))
		.enter()
		.append("circle")
			.attr("class","p2");

	var xScale = d3.scale.linear()
							.range([30,890])
							.domain([0,10]);
			
	var yScale = d3.scale.linear()
					.range([height-20,20])
					.domain([0,30]);

	console.log(getMax(playerA,playerB,'total',10));

	// d3.selectAll("circle")
	// 	.attr("cx",function(d,i)
	// 	{
	// 		return xScale(i);	
	// 	})
	// 	.attr("cy", function(d)
	// 	{
	// 		return yScale(d);
	// 	})
	// 	.attr("r",3)

	var line = d3.svg.line()
					.x(function(d,i)
					{	
						return xScale(i);	
					})
					.y(function(d,i)
					{
						return yScale(d);	
					});

	d3.select("svg.timeline")
		.append("path")
		.attr("d",line(getFantasyTotal(playerA.fantasyStats)))
		.attr("class","p1");

	d3.select("svg")
		.append("path")
		.attr("d",line(getFantasyTotal(playerB.fantasyStats)))
		.attr("class","p2");

	var xAxis = d3.svg.axis().scale(xScale).ticks(10);
			d3.select("svg.timeline")
				.append("g")
				.attr("class","x axis")
				.attr("transform","translate(0,100)")
				.call(xAxis);	
				
	var yAxis = d3.svg.axis().scale(yScale).orient("left");
			d3.select("svg")
				.append("g")
				.attr("class","y axis")
				.attr("transform","translate(30,0)")
				.call(yAxis);

}

function playerComparisonFantasyBreakdown(chart,player,playerTurn,params)
{
	//console.log(chart);
	var barHeight = 50;

	// var lines = chart.selectAll("rect.fantasyTotal.player"+playerTurn+"."+player.player_name.split(" ").join("").split(".").join(""))
	// 					.data(player)
	// 					.enter()
	// 					.append("rect")
	// 						.attr("class","fantasyTotal player"+playerTurn+" "+ player.player_name.split(" ").join("").split(".").join(""));

	var lines = d3.select("body").select('div#playerA')
					.selectAll("rect.horizontalBar")
						.data(player.fantasyStats)
						.enter()
						.append("rect")
							.attr("class","horizontalBar");

	//console.log(d3.select('#playerA'));

	var xScale = params.x;
	var yScale = params.y;

	//console.log(lines);
	// lines.attr(
	// 	{
	// 		"height": "100px",
	// 		"width": "100px",
	// 		"y": "100px",
	// 		"x": "50px"
	// 	})

		lines.attr(
		{
			"x": params.chartWidth-10,
			"y": function(d,i)
			{
				return i * barHeight;
			},
			"height": barHeight,
			"width": function (d,i)
			{
				return xScale(d.TOTAL.receiving_yds);
			}
		})

	chart.selectAll('text.horizontalBar')
			.data(player)
			.enter()
			.append("text")
				.attr("class","horizontalBar")
			.text(function(d)
			{
				return d.yards;
			})
			.attr(
			{
				"x": function(d,i)
				{
					return (xScale(i+1)+(playerTurn*barWidth))+1;	
				},
				"y":function(d,i)
				{
					return yScale(d.yards)-5;
				},
				"font-size":"12"
			});
}

function fantasyScore(stat,value)
{
	switch(stat)
	{
		case "passing_tds":
			return value*4;
			break;

		case "passing_yds":
			return value*.04;
			break;

		case "receiving_tds":
			return value*6;
			break;

		case "receiving_yds":
			return value*.1;
			break;

		case "rushing_tds":
			return value*6;
			break;

		case "rushing_yds":
			return value*.1;
			break;	

		case "fumbles_lost":
			return value*-2;
			break;	

		case "passing_int":
			return value*-2;
			break;	

		default:
			return 0;
			break;
	}
}

function getFantasyTotal(stats)
{
	var total=[];
	$.each(stats, function(i,item)
	{
		if(i!=0 && i<11)
		{
			total[i]=item.total;
		}
		else if(i == 0)
		{
			total[i]=0;
		}
	});
	return total;

}

/*
	Function that calculates the fantasy points for a specific player in every category for everyweek. It also calculates the total points by a player in a week and in total for the season.

	IN:
		playerStats: JSON object with all the information for one player

	OUT: 
		playerStats: the same JSON object with all the information for one player and with an extra property with the fantasy results and totals
*/
function addFantasyTotals(playerStats)
{
	var total;
	var fantasy=[];
	$.each(playerStats.stats, function(i,item)
	{
		total = {};
		var weekTotal = 0;
		$.each(item, function(j,val)
		{
			var score = fantasyScore(j,val);
			weekTotal += score;
			total[j]=score;
		})
		total['total'] = weekTotal;
		fantasy[i] =total;
	})
	playerStats['fantasyStats'] = fantasy;

	console.log(playerStats);
	return playerStats;
}



