
from flask import Flask, abort, request
from tempfile import NamedTemporaryFile
import whisper
import torch
from flask_cors import CORS, cross_origin
import openai
import gpt3

openai.api_key = ''


torch.cuda.is_available()
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

model = whisper.load_model("base.en", device=DEVICE)
results = []
app = Flask(__name__)
cors = CORS(app)
@app.route("/", methods=['GET'])
def hello():
    return "Whisper Hello World!"

@app.route('/whisper', methods=['POST'])
def handler():
    if(len(results) == 0):
        for filename, handle in request.files.items():
            temp = NamedTemporaryFile()
            
            handle.save(temp)
            
            result = model.transcribe(temp.name)
            text = result['text']
            gpt3_answer= gpt3.gpt3complete(text)
            results.append({
                'filename': filename,
                'transcript': text.strip(),
                'index': len(results),
                'answer': gpt3_answer.strip(),
                
            })
    else:
        results.clear()
        handler()

    return "FINISHED"   



@app.route('/getapi', methods=['GET'])
def get_transcriped_data():
    
    return {'results': results}



