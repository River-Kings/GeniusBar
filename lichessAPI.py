from lib2to3.pytree import convert
import requests, json, subprocess
from contextlib import redirect_stdout 
import io 
from collections import defaultdict 

base_url = "https://lichess.org"

account_profile = "/api/account"

# Albert's personal access token
token = "lip_zCmr3ZhAXz5O70do4qoI"

headers = (
    f"Authorization: Bearer {token}"
)

def moveClassifier(gameEvals):
    

def evaluateGame(playerRatings, whiteOrBlack, numGamesEvaluated, gameEvals):
    # player ratings: both positional and general rating
    # white or black: which player we should be consdering  
    # num games evaluated: how many games have already been analyzed for this player
        # weight higher for more recent games? 
    # GameEvals: [fens, evalDict, posMoves] for the fen of every point of the game 

    for fen in gameEvals:
        mover = fen.split(" ")[1]
        if mover == whiteOrBlack:
            # classify their move + top 5 moves? 
                # point adv
                # mating setups
                # positional

            # scale amounts 

            # if best move, ++ general rating, ++ particular skill 

            # if move in top 5 moves, + general, + skill, no/low penality
            
            # elif move comparable, 0 general, - skill of top move

            # elif move bad, - general, - skill of top moves, penalize 
            

def deLiteratePGN(PGN):
    built = ""
    stack = [] 
    for s in PGN:
        if s == '{' or s == '(':
            stack.append(s)
        elif s == ')' or s == '}':
            del stack[-1]
            continue 
        if len(stack) == 0:
            built += s
    return built 

def convertFullPGN2FEN(PGN):
    fenList = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
    realPGN = deLiteratePGN(PGN).split(' ')
    cleanPGN = []
    for item in realPGN:
        if item != '':
            cleanPGN.append(item) 
    # print(cleanPGN) 
    for i in range(2, len(cleanPGN)-1, 2):
        standingFEN = convertPGN2FEN(' '.join(cleanPGN[:i]) + ' ' + cleanPGN[-1])
        fenList.append(standingFEN)
    # print(fenList)
    return fenList

def convertPGN2FEN(PGN):
    args = "pgn-extract.exe -F"
    g2p_process = subprocess.Popen(
        args=args,
        stdin=subprocess.PIPE,  # allow sending data via STDIN
        stdout=subprocess.PIPE
    )
    g2p_process.communicate(input=bytes(PGN, 'utf-8'))
    output = g2p_process.communicate()[0].upper() 
    fen = str(output).split('{')[-1].split('}')[0]
    # print(f"Got: ")
    # print(f"--{PGN}")
    # print(f"--{fen}")
    return fen 


def getRatingHistory(username, mode=None):
    rating_history = f"/api/user/{username}/rating-history"
    res = requests.get(base_url+rating_history).json()
    if mode is not None:
        try:
            return res[mode]
        except Exception as e:
            print(f"Exception for {username}: {e}")
            return 
    return res 

def getGames(username, mode=None, numGames=10):
    lastGames = f"/api/games/user/{username}"
    # params = (f"Accept: application/x-ndjson")
    # , max: {numGames}, pgnInJson: true
    # , evals: true, literate: true, analysed: true, rated: true
    params = {
        "Accept": "application/x-ndjson",
        "analysed": "true",
        "literate": "true",
        "evals": "true",
        "rated": "true"
    }

    gamesCollected = 0
    gameInfo = []  
    currGame = []

    res = requests.get(base_url+lastGames, params=params, stream=True)
    if res.encoding is None:
        res.encoding = 'utf-8'
    try: 
        for line in res.iter_lines(decode_unicode=True):
            if gamesCollected > numGames:
                return gameInfo[1:]
            if line: 
                if line[1:6] == "Event":
                    gameInfo.append(currGame)
                    currGame = [line.strip('][').split(', ')] 
                    gamesCollected += 1
                else:
                    currGame.append(line.strip('][').split(', ')) 
    except Exception as e:
        print(f"Error for {username} in getGames, {e}")
        return gameInfo 

def getCloudEvalFEN(fen):
    cloudEval = "/api/cloud-eval"
    params = {
        "fen": fen,
        "multiPv": 5
    }
    res = requests.get(base_url+cloudEval, params).json()
    return res 

def getEvalsOfGame(pgn):
    fens = convertFullPGN2FEN(pgn)
    evalDict = defaultdict(int) 
    posMoves = defaultdict(list) 
    for fen in fens:
        res = getCloudEvalFEN(fen) 
        evalDict[fen] = res["pvs"][0]['cp']
        posMoves[fen] = res["pvs"]
    
    print(fens) 
    return (fens, evalDict, posMoves)

username = "zachthesnach"
# history = getRatingHistory(username)
# print(history) 

# last10Games = getGames(username)
# print(last10Games) 
# print()
# for line in last10Games[0]:
#     print(line)

print() 
basepgn = '1. d4 { [%eval 0.21] } 1... c5?! { (0.21 → 0.87) Inaccuracy. Nf6 was best. } { [%eval 0.87] } (1... Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Be7 5. Bf4 O-O 6. e3) 2. dxc5?! { (0.87 → 0.08) Inaccuracy. d5 was best. } { [%eval 0.08] } { A43 Benoni Defense: Benoni Gambit Accepted } (2. d5 Nf6 3. Nc3 e6 4. e4 d6 5. Bc4 Be7 6. Nge2 O-O) 2... Qa5+?! { (0.08 → 0.74) Inaccuracy. e6 was best. } { [%eval 0.74] } (2... e6 3. e4 Bxc5 4. Bd3 Nc6 5. Nf3 Nge7 6. Nc3 O-O 7. O-O) 3. Nc3 { [%eval 0.65] } 3... Qxc5 { [%eval 0.96] } 4. Be3 { [%eval 0.58] } 4... Qc7 { [%eval 0.44] } 5. Nf3 { [%eval 0.33] } 5... Nf6 { [%eval 0.42] } 6. g3 { [%eval 0.51] } 6... g6 { [%eval 0.66] } 7. Bf4 { [%eval 0.26] } 7... Bg7?? { (0.26 → 11.15) Blunder. d6 was best. } { [%eval 11.15] } (7... d6 8. Bg2 Bg7 9. O-O O-O 10. e4 Nbd7 11. Rc1 a6 12. Qd2 Rb8 13. Bh6 Bxh6 14. Qxh6) 8. Bxc7 { [%eval 11.04] } 8... O-O { [%eval 11.52] } 9. Bxb8 { [%eval 10.59] } 9... Rxb8 { [%eval 10.44] } 10. e3 { [%eval 10.32] } 10... b5 { [%eval 10.3] } 11. Bd3 { [%eval 10.23] } 11... b4 { [%eval 10.16] } 12. Ne4 { [%eval 9.08] } 12... Nd5 { [%eval 10.26] } 13. Qe2 { [%eval 9.31] } 13... e6 { [%eval 10.8] } 14. Nd6 { [%eval 9.37] } 14... Bxb2 { [%eval 9.24] } 15. Rb1 { [%eval 9.24] } 15... Bc3+ { [%eval 9.59] } 16. Kf1 { [%eval 9.56] } 16... Bg7 { [%eval 9.59] } 17. Nxc8 { [%eval 9.24] } 17... Rfxc8 { [%eval 9.16] } 18. Kg2 { [%eval 8.66] } 18... Nc3 { [%eval 8.96] } 19. Qd2 { [%eval 8.91] } 19... Nxb1 { [%eval 9.45] } 20. Rxb1 { [%eval 9.4] } 20... Bc3 { [%eval 9.54] } 21. Qe2 { [%eval 9.56] } 21... a5 { [%eval 9.37] } 22. Nd4 { [%eval 8.36] } 22... e5 { [%eval 9.47] } 23. Nb5 { [%eval 9.45] } 23... Kg7 { [%eval 9.8] } 24. Nd6 { [%eval 9.33] } 24... Rc6 { [%eval 9.31] } 25. Nb5 { [%eval 9.24] } 25... Kf6 { [%eval 10.53] } 26. f4 { [%eval 9.95] } 26... exf4 { [%eval 10.09] } 27. exf4 { [%eval 10.23] } 27... Re6 { [%eval 10.18] } 28. Qg4 { [%eval 10.23] } 28... h5 { [%eval 11.08] } 29. Qg5+ { [%eval 11.38] } 29... Kg7 { [%eval 11.51] } 30. f5 { [%eval 10.42] } 30... Reb6 { [%eval 14.07] } 31. fxg6 { [%eval 11.44] } { White wins on time. } 1-0'
delit = convertFullPGN2FEN(basepgn)


fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
eval = getCloudEvalFEN(fen)
print(eval) 

# {'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'knodes': 81588426, 'depth': 49, 
# 'pvs': [{'moves': 'e2e4 e7e6 d2d4 d7d5 e4e5 c7c5 c2c3 b8c6 g1f3 d8b6', 'cp': 32}, 
# {'moves': 'g1f3 e7e6 c2c4 g8f6 g2g3 d7d5 f1g2 d5c4 d1a4 c8d7', 'cp': 24}, 
# {'moves': 'd2d4 g8f6 c2c4 e7e6 g1f3 d7d5 b1c3 f8e7 c1f4 e8h8', 'cp': 24}, 
# {'moves': 'g2g3 e7e5 c2c4 c7c6 g1f3 e5e4 f3d4 d7d5 c4d5 d8d5', 'cp': 14}, 
# {'moves': 'c2c4 e7e5 g2g3 g8f6 f1g2 c7c6 g1f3 e5e4 f3d4 d8b6', 'cp': 12}]}

