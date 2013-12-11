import json, nfldb

####Generate Recommendation
def readFFTeamsStats():
	json_file = open ('../Data/ffTeamsStatistics_final.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data		

def readTeamSeasonStat():
	json_file = open ('../Data/teamSeasonStatistics_final.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data		

def readFreeAgentsStats():
	json_file = open ('../Data/freeagentsStatistics_final.json', 'r')
	json_data = json.load(json_file)
	season_json = {}			
	json_file.close()
	return json_data			
	
####Average Function
#### average(player_json, till_week)
def averagePlayer(player_json, till_week):
	stats = player_json['stats']
	running_average = stats['1']
	
	if(checkPlayedWeek(stats[str(1)].items())):
		#print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
		games_played=0
	else:
		games_played=1
	
	games_played = 1
	for week in xrange(2, till_week+1):
		week_stats = stats[str(week)].items()	
		#print ">>>>>>>>>Week", week		
		if(checkPlayedWeek(week_stats)==False):
			games_played+=1
		
		#print stats[str(week)].items()
		for item in week_stats:
			#print "Key: ", item[0], "and value: ", item[1]
			running_average[item[0]]+=item[1]
	#ppPrint(running_average)		
#	print " Games Played: " , games_played
	
	for key,value in running_average.iteritems():
		running_average[key] = value/float(games_played)
	# print "Averages: "
	# ppPrint(running_average)		
	return running_average

def checkPlayedWeek(list):
	sum = 0
	for item in list:
		if isinstance(item[1],str) == False:
			sum +=item[1]
	
	if(sum ==0):
		return True
	else:
		return False
	
def ppPrint(stuff):
	for items in stuff.iteritems():
		print items
		

#### generateRecommendation(ff_team, week)
def generateRecommendation(ff_team, week, nfl):
	
	scoreList = []
	
	for key_player, value_player in ff_team.iteritems():		
		if value_player['position'] != 'DEF':			
			score = generateScore(value_player, week, nfl)
			string1 = "Player: {:20s}".format(value_player['player_name'])			
			#print string1, " ", value_player['position'], " score: ", score
			scoreList.append((key_player, value_player['player_name'],value_player['position'], score))						
		else:
			score =genDefenseScore(nfl[value_player['player_name']], week)
			string1 = "Player: {:20s}".format(value_player['player_name'])			
			scoreList.append((key_player, value_player['player_name'],value_player['position'], score))			
			
		# scoreList.append=(value_player['player_name'], score)
	
	scoreList = sorted(scoreList, key = lambda x: x[2], reverse=True)	
	# print scoreList
	return scoreList
	
	
#### Return tuple ( rankScoreOrder[], status{})
#### {      
#### 	rankScoresOrder: [0-13]  --> Map to tuple
####        		(player_name, player_#, player_score, player_
####		  status: { 
####				<player_#> : status: <keep_play> <keep_bench> <drop>
####				
####  http://stackoverflow.com/questions/3121979/how-to-sort-list-tuple-of-lists-tuples

#### generateScore

def nflAvg(nfl, week):
	teams = []
	for key_teams, value_teams in nfl.iteritems():
		teams.append(averageTeam(value_teams, week))
	
	avg_json = teams[0]
	for index in xrange(1,len(teams)):
		for key, value in teams[index].iteritems():
			if key !='opponent':
				avg_json[key]+=value
	
	# print avg_json
	for key, value in avg_json.iteritems():
		if key !='opponent':
			avg_json[key] = value/float(len(teams))
	# ppPrint(avg_json)
	return avg_json
	# print "this better be 33: ", len(teams)

def generateScore(player, week, nfl):
	STAT_STRING_OPPONENT = ['passing_yds', 'passing_tds',  'rushing_yds','receiving_yds', 'receiving_tds' ,'kickret_tds', 'fumbles_rec_tds','rushing_tds']	
	STAT_STRING_MINUS = ['passing_int', 'fumbles_lost']	
	player_average = averagePlayer(player,week)	
	opponent_team = opponent(player,week+1)
	opponent_average = 0
	avg = nflAvg(nfl,week)
	#print ">>>>>>>>>>>>>>>>>>>>>", player['player_name'],  opponent_team, " score: ", 
	player_score =0
	if opponent_team != 'bye':		
		opponent_average = averageTeam(nfl[opponent_team], week)		
	else:
		return 0
		
	for stat in STAT_STRING_OPPONENT:	
		player_score += formula(player_average[stat], opponent_average[stat+"_allowed"], stat,avg[stat+"_allowed"])
		player_score +=player_average['passing_int']
		player_score +=player_average['fumbles_lost']
	return player_score
	
	
	
def formula(player_statistic, team_statistic, stat_name, avg):
	player_ff = convertFFPoints(stat_name, player_statistic)
	team_ff =convertFFPoints(stat_name, team_statistic)
	avg_ff = convertFFPoints(stat_name, avg)
	if team_ff == 0:
		score = 0
	else:
		score = player_ff * float(team_ff)/avg_ff
	
	#print "Player Stat: ", player_ff,  " team stat: ", team_ff, "score: ", score
	
	return score



def opponent(player,week):
	team = player['team']
	statNFL = readTeamSeasonStat()
	opponent = statNFL[team][makeUTF(week)]['opponent']
	return opponent
	
#### teamAverage

def averageTeam(team_json, till_week):
	stats = team_json
	# running_average = stats[unicode(1, "utf-8")]
	running_average = stats[makeUTF(1)]
	
	games_played = 1
	for week in xrange(2, till_week+1):
		week_stats = stats[makeUTF(week)].items()	
		#print ">>>>>>>>>Week", week		
		if stats[makeUTF(week)]['opponent'] != 'bye':
			games_played+=1
		#print stats[str(week)].items()
		for item in week_stats:
			#print "Key: ", item[0], "and value: ", item[1]
			if item[0] != 'opponent':
				try:
					running_average[item[0]]+=item[1]
				except KeyError:
					"Error", item[0]
	# del running_average['opponent']		
	# ppPrint(running_average)		
		
	for key,value in running_average.iteritems():
		if isinstance(value,int):
			# print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",key, value
			temp = value/float(games_played)
			# print "                           >>>>>>>>>>>>>>>>>>",key, temp
			running_average[key] = temp 
	# print "Averages: "
	# ppPrint(running_average)		
	# print " Games Played: " , games_played
	return running_average
	
def makeUTF(number):
	return unicode(str(number),"utf-8")

def convertFFPoints(stat_name, num):
	STAT_STRING_LIST = ['passing_yds', 'passing_tds',  'passing_int', 'rushing_yds','rushing_tds','receiving_yds', 'receiving_tds' ,'kickret_tds', 'fumbles_rec_tds', 'fumbles_lost', 'passing_twoptm']	

	
	if stat_name == STAT_STRING_LIST[0]:
		return num / 25
	elif stat_name == STAT_STRING_LIST[1]:
		return 4 * num
	elif  stat_name == STAT_STRING_LIST[2]:
		return passing_tds * -2
	elif  stat_name == STAT_STRING_LIST[3]:
		return num / 10
	elif stat_name == STAT_STRING_LIST[4]:
		return num * 6
	elif stat_name == STAT_STRING_LIST[5]:
		return num / 10
	elif stat_name == STAT_STRING_LIST[6]:
		return num * 6
	elif stat_name == STAT_STRING_LIST[7]:
		return num * 6
	elif stat_name == STAT_STRING_LIST[8]:
		return num * 6
	elif stat_name == STAT_STRING_LIST[9]:
		return num * -2
	elif stat_name == STAT_STRING_LIST[10]:
		return num * 2
	
	return 0
	# else if stat_name == STAT_STRING_LIST[11]:
	# else if stat_name == STAT_STRING_LIST[0]:
	# else if stat_name == STAT_STRING_LIST[0]:
	# else if stat_name == STAT_STRING_LIST[0]:
	# else if stat_name == STAT_STRING_LIST[0]:
	# else if stat_name == STAT_STRING_LIST[0]:

def genDefenseScore(team, week):
	STAT_STRING_LIST_DEFENSE=['defense_sk', 'defense_int', 'defense_frec', 'defense_safe', 'defense_touchdowns', 'kickret_tds','puntret_tds']	
	stat_season_totals =  [0 for x in range(len(STAT_STRING_LIST_DEFENSE))]
	games_played = 0
	for week in xrange(1, week+1):	
		week = team[makeUTF(week)]
		if week['opponent'] != 'bye':
			for stat in xrange(len(STAT_STRING_LIST_DEFENSE)):
				stat_season_totals[stat]+=week[STAT_STRING_LIST_DEFENSE[stat]]
			games_played +=1
	
	# print stat_season_totals, games_played
	
	final_score = 0
	for stat in xrange(len(STAT_STRING_LIST_DEFENSE)):	
		stat_num = stat_season_totals[stat]
		score = ffDefenseScore(STAT_STRING_LIST_DEFENSE[stat], stat_num)
		final_score+=score/ float(games_played)
		
	# print "DefenseScore: ", final_score
	return final_score
	
def ffDefenseScore(stat_name, num):
	STAT_STRING_LIST_DEFENSE=['defense_sk', 'defense_int', 'defense_frec', 'defense_safe', 'defense_touchdowns', 'kickret_tds','puntret_tds']	
	if stat_name ==STAT_STRING_LIST_DEFENSE[0]:
		return num 
	elif stat_name ==STAT_STRING_LIST_DEFENSE[1]:
		return num *2
	elif stat_name ==STAT_STRING_LIST_DEFENSE[2]:
		return num  *2
	elif stat_name ==STAT_STRING_LIST_DEFENSE[3]:
		return num *2		
	elif stat_name ==STAT_STRING_LIST_DEFENSE[4]:
		return num *6
	elif stat_name ==STAT_STRING_LIST_DEFENSE[5]:
		return num *6		
	elif stat_name ==STAT_STRING_LIST_DEFENSE[5]:
		return num *6	
	return 0
	

	
def scrubFreeAgents(free_agents, ffTeams):
	delete_list = []
	for key, value in free_agents.iteritems():
		print "New Position"
		delete_list = []
		for key_player, value_player in value.iteritems():
			print "Checking: ", value_player['player_name']
			if checkExisting(value_player['player_name'], value_player['position'], ffTeams):
				print ">>>>>>>>>>>>>>>>>>>>Found duplicate: " , value_player['player_name']
				delete_list.append(key_player)
		for stuff in delete_list:
			print "Deleting: ", value[stuff]['player_name']
			del value[stuff]
	
	json_write = open('freeagents_scrub.json','w')
	json_write.write(json.dumps(free_agents))
	json_write.close()	
	
def checkExisting(player_name, position, ffTeams):
	current_player = searchPlayer(player_name, position)
	for key_teams, value_teams in ffTeams.iteritems():		
		for key_players, value_players in value_teams.iteritems():
			if value_players['position'] != 'DEF':
				# check_player = searchPlayer(value_players['player_name'], value_players['position'])
				if current_player.player_id == value_players['ID']:
					# print current_player.full_name, " with ", value_players['player_name']
					return True 
					
	return False 
	
def searchPlayer(player_name, position_name):
	db = nfldb.connect()
	player, dist = nfldb.player_search(db, player_name, position=position_name)
	# print 'Similarity score: %d, Player: %s' % (dist, player)
	return player

def genFreeAgentScores(statNFL,week):
	freeAgent_scores = []
	statPlayers = readFreeAgentsStats()
	for key, value in statPlayers.iteritems():		
		players = generateRecommendation(value, week, statNFL)
		players = sorted(players, key = lambda x: x[2], reverse=True)
		freeAgent_scores.append ((key, players[0:10]))
		 # freeAgent_scores +=generateRecommendation(value, week, statNFL)
		
	# return sorted(freeAgent_scores, key = lambda x: x[2], reverse=True
	return freeAgent_scores

def generatePlayerRecommendations(ffTeamName, week):
	statPlayers = readFFTeamsStats()	
	statNFL = readTeamSeasonStat()
	statFreeAgents = readFreeAgentsStats()
	
	ffTeamobject = statPlayers[ffTeamName]
	ffTeam_rank = generateRecommendation(ffTeamobject, week, statNFL)
	freeAgentsRank = genFreeAgentScores(statNFL,week)
	answer = {}
	answer['freeAgents'] = freeAgentsRank
	answer['ffTeamRank']= ffTeam_rank
	return answer
	
def tester():
	# freeAgent = genFreeAgentScores(statNFL, 10)
	# for stuff in freeAgent:
		# for players in stuff:
			# print players

	# statPlayers = readFreeAgentsStats()
	# temp = genFreeAgentScores(9,statNFL)	
	# for stuff in temp:
		# print stuff[0]
		# for things in stuff[1]:
			# print things
	# print first_player['player_name'], first_player['team']
	# print opponent(first_player, 14)
	# averagePlayer(first_player,17	)
	# raiders = statNFL['CIN']	
	# averageTeam(raiders,17)
	
	# print checkExisting('Joique Bell', 'RB', statPlayers)
	# scrubFreeAgents(readFreeAgentsStats(), readFFTeamsStats())
	
	nfl = readTeamSeasonStat()
	# print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>NFL"
	# ppPrint(nflAvg(nfl, 12))
	
	
	# ppPrint(averageTeam(nfl['CHI'],12))
	# teamMagnify('CHI',nfl, 12)
	print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>TEAM"
	# averageTeam(nfl['CHI'],12)
	wtf('SEA', nfl, 16)
	print "foo"

def wtf(team, nfl, week):
	STAT_STRING_OPPONENT = ['passing_yds', 'passing_tds',  'rushing_yds','receiving_yds', 'receiving_tds' ,'kickret_tds', 'fumbles_rec_tds','rushing_tds']	

	print "%%%%%%%%%%%%%%%%%%%%%%%%%%%%", team, week
	current_team = averageTeam(nfl[team], week)
	# ppPrint(current_team)
	

	print "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!NFL Average"
	avgNFL = nflAvg(nfl,week)
	ppPrint(avgNFL)
	
	
	teamScore = 0
	avgScore = 0

	# for stat in STAT_STRING_OPPONENT:	
		# new_stat = stat+'_allowed'
		# print ">>>>Stat: ", new_stat , " Team: ", current_team[new_stat], " League: ", avgNFL[new_stat]
		# team = convertFFPoints(stat, current_team[new_stat])
		# league = convertFFPoints(stat, avgNFL[new_stat])
		# teamScore += team
		# avgScore += league
		# print "Stat: ", new_stat , " Team: ", team, " League: ", league 
	
	# print "Team Stats: ", teamScore
	# print "NFL Stats ", avgScore
	
def teamMagnify(opponent_team,nfl,  week):

	
		
	if opponent_team != 'bye':		
		opponent_average = averageTeam(nfl[opponent_team], week)		
		
		ppPrint(opponent_average)
	else:
		return 0
		

	print "Team Stats: ", teamScore
	print "NFL Stats ", avgScore
	magnify = (teamScore/float(8)) / (avgScore/float(8))
	print "The magnify for team: ", opponent_team, " is: ", magnify

	
	
	
if __name__ == "__main__":
	tester()