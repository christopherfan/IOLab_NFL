from recommendations import *

###### Ramit: Example of how to call this function and print statements to show return type
## These are the final files that are required to run: 
## <Data/ffTeamsStatistics_final.json> File for FF Player Statistics
## <Data/teamSeasonStatistics_final.json> File for NFL Team Statistics
## <Data/freeagentsStatistics_final.json> File for Free Agents Statistics 

## generatePlayerRecommendations( team_name, week)
## team_name => string
## week => int 
## Returns a object of form ( ffTeamRank, freeAgents)
## ffTeamRank is a sorted list 
## freeAgents is a object comprised of three sorted lists 

def main():
	print "Example of how to call this function and print statements to show return type"
	team_name = 'Guanatos'
	week = 11
	answer = generatePlayerRecommendations(team_name, week) ## Team name is 'Cowboys' doing analysis for week 11
	print "Recommendations for Team: ", team_name, " for week: " , week
	## Print the sorted list of current FF Team players and the score
	ffPlayerRanks = answer['ffTeamRank'] 			## Do this because the return value is a tuple 
	print " \nThis is the ranked list for the FF Team Players"
	for player in ffPlayerRanks: 
		print player 				## player is tuple of type: ( player_name , position , score)

		
	freeAgents = answer['freeAgents'] ## Do this because the return value is a tuple 
	for position in freeAgents:
		print "\nFree Agents for Position: " , position[0]
		for players in position[1]:
			print players
	

if __name__ == "__main__":
	main()