from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players


def get_player(name):
    player = players.find_players_by_full_name(name)[0]
    player_id = player['id']
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = career.get_dict()
    df = df['resultSets'][1]
    return df

def get_name(name):
    playername = players.find_players_by_full_name(name)[0]
    playername = playername['full_name']
    return playername

player2 = players.find_players_by_full_name('Anthony Davis')[0]
player_id2 = player2['id']
career = playercareerstats.PlayerCareerStats(player_id=player_id2)
df2 = career.get_dict()
df2 = df2['resultSets'][1]




