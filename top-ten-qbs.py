import nfldb



def module1():

	db = nfldb.connect()
	q = nfldb.Query(db)
	q.game(season_year=2013, season_type='Regular')
	
	for pp in q.sort('passing_yds').limit(10).as_aggregate():
		print pp.player, pp.passing_yds
	
	q.player(full_name="Tom Brady").play(passing_tds=1)	
	for play in q.as_plays():
		print play
	
def showGame():
	g.game(team='NE')
	
def showStat(stat_input, team_input, week_input):
	db = nfldb.connect()
	q = nfldb.Query(db)
	q.game(season_year=2013, season_type='Regular',  week=week_input)
	
	
	query_string = stat_input + '__ne'
	query_stat = {}
	query_stat[query_string] = 0;
	query_stat['team'] = team_input
	q.play( **query_stat)
	totals = 0
	for pp in q.as_aggregate():
		totals+= eval('pp.' + stat_input)
		print pp.player, eval('pp.'+stat_input)
	print ("Totals Week: " +str(week_input) + " " + team_input + " " + stat_input+ " "+ str(totals) + '\n')
	return totals

def genTeamStatJSON(team_input, week_input):
	statJSON={}
	
	stat_string_list = ['passing_yds', 'passing_tds',  'passing_int', 'rushing_yds', 'receiving_tds' ,'kickret_tds', 'fumbles_rec_tds', 'fumbles_lost']
	
	for index in xrange(len(stat_string_list)):
		statJSON[stat_string_list[index]] = showStat(stat_string_list[index], team_input, week_input)
	
	print statJSON
	
def main():
	#module1()
	#showStat('passing_yds', 'ARI',6)
	genTeamStatJSON('CHI', 6)
	#verifyStat()

if __name__ == "__main__":
	main()
