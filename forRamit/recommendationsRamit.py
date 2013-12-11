import json

####Generate Recommendation
def readFFTeamsStats():
	json_file = open ('ffTeamsStatistics_final.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data		

def read():
	json_file = open ('ffTeamsStatistics_FreeAgents_final.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data			
	
def readTeamSeasonStat():
	json_file = open ('teamSeasonStatistics_final.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data		

def readFreeAgentsStats():
	json_file = open ('freeagentsStatistics_final.json', 'r')
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
	
	scoreList = sorted(scoreList, key = lambda x: x[3], reverse=True)	
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
	
def teamMagnify(opponent_team,nfl,  week):

	STAT_STRING_OPPONENT = ['passing_yds', 'passing_tds',  'rushing_yds','receiving_yds', 'receiving_tds' ,'kickret_tds', 'fumbles_rec_tds','rushing_tds']	
	# opponent_average = averageTeam(nfl[opponent_team], week)		
	avgNFL = nflAvg(nfl,week)
	
	teamScore = 0
	avgScore = 0
		
	if opponent_team != 'bye':		
		opponent_average = averageTeam(nfl[opponent_team], week)		
		print "%%%%%%%%%%%%%%%%%%%%%%%%%%%%", opponent_team, week
		ppPrint(opponent_average)
	else:
		return 0
		
	for stat in STAT_STRING_OPPONENT:	
		new_stat = stat+'_allowed'
		print ">>>>Stat: ", new_stat , " Team: ", opponent_average[new_stat], " League: ", avgNFL[new_stat]
		team = convertFFPoints(stat, opponent_average[new_stat])
		league = convertFFPoints(stat, avgNFL[new_stat])
		teamScore += team
		avgScore += league
		print "Stat: ", new_stat , " Team: ", team, " League: ", league 
	
	print "Team Stats: ", teamScore
	print "NFL Stats ", avgScore
	magnify = (teamScore/float(8)) / (avgScore/float(8))
	print "The magnify for team: ", opponent_team, " is: ", magnify
		
	
	
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
			running_average[key] = value/float(games_played)
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
		freeAgent_scores.append ((key, players[5:15]))
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
	
	
	return roster(answer)

def recommendationsRamit(tuple):

	team_rank = tuple['ffTeamRank']
	free_agents = tuple['freeAgents']
	rushers = free_agents[0][1]
	passers = free_agents[1][1]
	receivers = free_agents[2][1]
	
	print ">>>>>>>>>> Team" 
	for stuff in team_rank:
		print stuff
		
	print ">>>>>>>>>Receivers" 
	for stuff in receivers:
		print stuff
	print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.." 
	wr = []
	other = []
	for index in xrange(9):		
		if receivers[index][2]=='WR':
			# print "Push: ", receivers[index]
			wr.append(receivers[index])			
		else:
			print "Skipped: ", receivers[index]
			other.append(receivers[index])
	other = other + rushers
	# print "WR: ", wr
	print " Other: ", other
					
	final_list = []
	
	for index in xrange(len(team_rank)):
		player = team_rank[index]	
		# print " ##", player
		if player[2] == 'QB' and player[3] < passers[0][3]:
			print "QB: ", player[1] , " is worse qb than", passers[0][1]
			final_list.append(player+('Drop' , passers[0])) 
			passers.pop(0)
		elif player[2] == 'QB' and player[3] > passers[0][3]:
			print "QB: ", player[1] , " is better ", passers[0][1]			
			final_list.append(player + ('Keep_Play',))
		elif player[2] == 'WR' and player[3] < wr[0][3]:		
			print "WR: ", player[1] , " is worse wr than", wr[0][1]			
			final_list.append(player + ('Drop',wr[0]))
			wr.pop(0)			
		elif player[2] == 'WR' and player[3] > wr[0][3]:		
			print "WR: ", player[1] , " is better ", wr[0][1]			
			final_list.append(player + ('Keep_Play',))
		elif (player[2] == 'TE' or player[2]=='RB') and player[3] < other[0][3]:		
			print player[2], player[1] , " is worse than the other", other[0][1]			
			final_list.append(player + ('Drop', other[0]))
			other.pop(0)
		elif (player[2] == 'TE' or player[2]=='RB') and player[3] > other[0][3]:		
			print player[2], player[1] , " is better ", other[0][1]			
			final_list.append(player + ('Keep_Play',))
		else:
			print "other player"
			final_list.append(player + ('Keep_play', ))
	for stuff in final_list:
		print stuff

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
	
	# nfl = readTeamSeasonStat()
	# print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>NFL"
	# ppPrint(nflAvg(nfl, 12))
	# print ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>TEAM"
	# averageTeam(nfl['CHI'],12)
	# ppPrint(averageTeam(nfl['CHI'],12))
	# teamMagnify('CHI',nfl, 12)
	answer = generatePlayerRecommendations('Guanatos', 10)

	# recommendationsRamit(tuple)
	# roster(tuple)
	# roster = tuple['ffTeamRank']
	# for stuff in roster:
		# print stuff
	# findNext(roster, roster[12])
	
	print "foo"

def roster(tuple):
	# print "Testing Roster"
	team_rank = tuple['ffTeamRank']
	free_agents = tuple['freeAgents']
	rushers = free_agents[0][1]
	passers = free_agents[1][1]
	receivers = free_agents[2][1]
	free_agents= passers + rushers + receivers
	free_agents = sorted(free_agents, key = lambda x: x[3], reverse=True)
	
	# print ">>>>>>>>>> Team" 
	# for stuff in team_rank:
		# print stuff
	
	# print ">>>>>>>>>FreeAgents"
	# for stuff in free_agents:
		# print stuff
	# print "...................Calculating>>>>>>>>>>>>>>>>>>>>.." 
	roster = []

	for player in team_rank:
		if free_agents and player[3] > free_agents[0][3] :
			# print "Team: ", player[1],  " is the best "
			roster.append(('team', player))
		else:
			while free_agents and player[3] < free_agents[0][3]:
				# print "Free Agent: ", free_agents[0][1], " is better than: " , player[1]		
				if(free_agents[0][2] == 'QB'):
					roster.append(('PASSERS', free_agents[0]))
				if(free_agents[0][2] == 'RB'):				
					roster.append(('RUSHERS', free_agents[0]))
				else:
					roster.append(('RECEIVERS', free_agents[0]))
				free_agents.pop(0)
			# print "Player: ", player[1],  " is the best "
			roster.append(('team', player))
		
	# print "...................RESULT>>>>>>>>>>>>>>>>>>>>.." 	
	# for stuff in roster:
		# print stuff
		
	team_reverse = sorted(team_rank, key = lambda x: x[3])
	final_roster = []

	qb_count = 0	
	players_added = 0
	wr_count =0
	players_playing =0
	
	for player in roster:
		if players_added ==15:
			break 		

		if players_playing <8:		
			if(player[1][2] =='QB' and qb_count ==1):			
				if player[0] == 'team':
					final_roster.append(('keep_bench', ('team',player[1]+('Keep_bench',))))
					players_added+=1
				continue
			elif(player[1][2]=='QB'):
				qb_count +=1		
			if(player[1][2] =='WR' and wr_count ==2):
				if player[0] == 'team':
					final_roster.append(('keep_bench', ('team', player[1]+('Keep_bench',))))
					players_added+=1
				continue
			elif(player[1][2]=='WR'):
				wr_count +=1		
								
			if player[0] =='team':
				# final_roster.append(player + ('Keep_Play',))
				final_roster.append(('keep_play', ('team', player[1]+('Keep_play',))))
				team_reverse.pop
				players_playing+=1
			else:
				worse_player = team_reverse[0]
				team_reverse.pop(0)
				# final_roster.append(worse_player + ('Drop_Play', player))
				final_roster.append(('drop_play',      ('team',(worse_player+('drop_play',))),      player))
				players_playing+=1
		else:
			if player[0] =='team':
				final_roster.append(('keep_bench', ('team', (player[1]+('Keep_bench',)))))
				team_reverse.pop
			else:
				worse_player = team_reverse[0]
				team_reverse.pop(0)
				final_roster.append(('drop_bench', ('team', (worse_player+('drop_bench',))), player))
		players_added +=1
		
	# print "%%%%%%%% Final RESULT>>>>>>>>>>>>>>>>>>>>.." 		
	# for stuff in final_roster:
		# print stuff
	
	final_output = []
	for stuff in final_roster:
		status = stuff[0]
		if status == 'keep_play' or status == 'keep_bench':
			
			next_player = (findNext(team_rank, stuff[1][1]),)	
			compareTo = (('team',) + next_player)
			
			blah = stuff  + (compareTo,)
			final_output.append( blah)
		else:
			final_output.append(stuff)
 
	# print "%%%%%%%% Final RESULT>>>>>>>>>>>>>>>>>>>>.." 		
	# for stuff in final_output:
		# print stuff
	
	return final_output
			
def findNext(roster, player):
	position = player[2]
	player_score = player[3]
	last_person = ('none',)
	for person in roster:		
		if person[2] == position: 
			
			if person[3]<player_score:
				last_person = person
				break;
			if person[1] !=player[1]:
				last_person = person
				
	if position == 'DEF' or position=='K':
		last_person = ('none',)
	# print "Current Player: ", player, " Compare Player: ", last_person
	return last_person		
	
if __name__ == "__main__":
	tester()