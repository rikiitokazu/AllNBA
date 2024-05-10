from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import teams
import json
from nba_api.stats.endpoints import teaminfocommon
from nba_api.stats.endpoints import commonteamroster
from nba_api.stats.endpoints import franchiseleaders

def get_team(teamname):
    nba_teams = teams.get_teams()
    for team in nba_teams:
        if team['full_name'] == teamname:
            return team['id']
        
def teaminfocommoner(name):
    if name != '':
        team_id = teams.find_teams_by_full_name(name)[0]
        team_id = team_id['id'] 
        team = teaminfocommon.TeamInfoCommon(team_id=team_id)
        team = team.get_data_frames()[0]
        team = team.drop(columns = ["TEAM_ID", "TEAM_ABBREVIATION", "TEAM_CODE", "TEAM_SLUG", "MIN_YEAR", "MAX_YEAR"])
        team = team.to_dict('list')
        newTeamDict = {}
        for key, value in team.items(): 
            newTeamDict[key] = value[0]

        return newTeamDict

def getroster(name):
    if name != '':
        team_id = teams.find_teams_by_full_name(name)[0]
        team_id = team_id['id'] 
        roster = commonteamroster.CommonTeamRoster(team_id=team_id)
        roster = roster.get_data_frames()[0]
        roster["AGE"] = roster["AGE"].astype("int")
        roster = roster.drop(columns = ["TeamID", "SEASON", "LeagueID", "NICKNAME", "PLAYER_SLUG","EXP", "PLAYER_ID"])
        roster = roster.to_json(orient="records")
        roster = json.loads(roster)
        return roster

def teamfranchiseleaders(name): 
    if name != '':
        team_id = teams.find_teams_by_full_name(name)[0]
        team_id = team_id['id'] 
        team = franchiseleaders.FranchiseLeaders(team_id=team_id)
        team = team.get_data_frames()[0]
        team = team.drop(columns = ["TEAM_ID", "PTS_PERSON_ID", "AST_PERSON_ID","REB_PERSON_ID","BLK_PERSON_ID", "STL_PERSON_ID"])
        team = team.to_dict('list')
        labels = []
        names = []
        values = []
        index = 0
        for key, value in team.items():
            if index % 2 == 0: 
                labels.append(key)
                values.append(value)
            if index % 2 != 0:
                names.append(value)
            index +=1
        names = names
        values = values
        newTeam = []
        iterate = 0
        for lab in labels:
            newString = names[iterate][0]+ ": " + str(values[iterate][0])
            newTeam.append(newString)
            iterate+=1
        return newTeam

