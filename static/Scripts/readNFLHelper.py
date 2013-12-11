import json

def readTeamSeasonStat():
	json_file = open ('static/Data/teamSeasonStatistics1.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data	

def readFFTeams():
	json_file = open ('static/Data/ffTeamsJSON.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data	

def readFFTeamStats():
	json_file = open ('static/Data/ffTeamsStatsJSON1.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data		
	
def generateTeamStatCSV():
	json_data = readTeamSeasonStat()
	string_array = []
	array = []
	counter = 0
	
	for key_team, value_team in json_data.iteritems():		
		#print key_team
		string_array = []		
		for key_week, value_week in value_team.iteritems():
			#print key_week
			if key_week != 'TOTAL' and key_week !='AVG':
				string = key_team + ','+key_week+','
				string_array.append(string)
				stat_names = ','.join(value_week.keys())
				stats = ','.join(str(x) for x in value_week.values())
				array.append(string + stats+'\n')
	header_string = 'team_name' +','+'week'+ ','+stat_names	+'\n'
		
	file_write = open('static/Data/teamCSV_new.txt','w')
	print header_string
	file_write.write(header_string)
	for lines in array:	
		print lines
		file_write.write(lines)
	file_write.close()			

def generateFFPlayerStatCSV():
	json_data = readFFTeamStats()
	string_array = []
	array = []
	counter = 0
	
	for key_team, value_team in json_data.iteritems():		
		#print key_team
		string_array = []		
		
		for key_player, value_player in value_team.iteritems():			
			for key_week, value_week in value_player['stats'].iteritems():
				if key_week != 'TOTAL' and key_week !='AVG':
					string = key_team +','+value_player['player_name']+ ','+value_player['position']+','+key_week+','
					string_array.append(string)
					stat_names = ','.join(value_week.keys())
					stats = ','.join(str(x) for x in value_week.values())
					array.append(string + stats+'\n')
	header_string = 'ff_team_name'+',' +'player_name'+','+'position'+','+'week'+ ','+stat_names	+'\n'
		
	file_write = open('static/Data/ffPlayersCSV.txt','w')
	print header_string
	file_write.write(header_string)
	for lines in array:	
		#print lines
		file_write.write(lines)
	file_write.close()
	
	
def readFFTeamsStats():
	json_file = open ('static/Data/ffTeamsStatsJSON.json', 'r')
	json_data = json.load(json_file)
	season_json = {}
			
	json_file.close()
	return json_data		
	
def main():
	#generateTeamStatCSV()
	generateFFPlayerStatCSV()
	
if __name__ == "__main__":
	main()
