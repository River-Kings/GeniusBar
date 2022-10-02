
def createStockfish():
    createEngine = "/api/external-engine"
    content = {
        "name": "Stockfish 15",
        "maxThreads": 8,
        "maxHash": 1024,
        "variants": [ "standard" ],
        "providerSecret": "GeniusBarGeniusBar",
        # "providerData": "string",
        "url": "ws://localhost:9670/socket"
    }
    res = requests.post(base_url+createEngine, data=content, headers=headers)
    print(res)
    print(res.json())

def deleteEngine(id):
    toDeleteEngine = f"/api/external-engine/{id}"
    res = requests.delete(base_url+toDeleteEngine, headers=headers).json()
    print(res) 

def listEngines():
    engines = "/api/external-engine"
    res = requests.get(base_url+engines, headers=headers).json()
    print(res) 

def stockfishExternalAnalysis(stockfish_id, stockfish_secret, fen):
    stockfishAnalysis = f"https://engine.lichess.ovh/api/external-engine/{stockfish_id}/analyse"
    headers = { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    body = {
        "clientSecret": stockfish_secret,
        # "clientSecret": "GeniusBarGeniusBar",
        "work": {
            "sessionId": "abcd1234",
            "threads": 4,
            "hash": 128,
            "hashMib": 128,
            "maxDepth": 99,
            "multiPv": 1,
            "variant": "standard",
            "initialFen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            "moves": [
                "e2e4",
                "g8f6"
            ]
        }
    }
    print("About to post!")
    print()
    res = requests.post(stockfishAnalysis, headers=headers, data=json.dumps(body), stream=True)
    # if res.encoding is None:
    #     res.encoding = 'utf-8'
    # for line in res.iter_lines(decode_unicode=True):
    #     if line: 
    #         print(line)
    return res 


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
    