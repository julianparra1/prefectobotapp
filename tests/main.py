                                                                        
#  .oPYo.               d'b                 o          .oPYo.          o  
#  8    8               8                   8          8   `8          8  
# o8YooP' oPYo. .oPYo. o8P  .oPYo. .oPYo.  o8P .oPYo. o8YooP' .oPYo.  o8P 
#  8      8  `' 8oooo8  8   8oooo8 8    '   8  8    8  8   `b 8    8   8  
#  8      8     8.      8   8.     8    .   8  8    8  8    8 8    8   8  
#  8      8     `Yooo'  8   `Yooo' `YooP'   8  `YooP'  8oooP' `YooP'   8  
# :..:::::..:::::.....::..:::.....::.....:::..::.....::......::.....:::..:
# ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
"""
PrefectoBot
~~~~~~~~~~~~~~~~~~~~~

Robot con la capacidad de realizar tareas de prefecto 

:copyright: (c) 2023-present by Julian Parra
:license: MIT License, see LICENSE for more details.
"""
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    PushServerError,
    PushTicketError,
)
import json
import os
from string import Template
import secrets
from flask import Flask, flash, request, redirect, url_for, send_from_directory
from flask_socketio import SocketIO, emit
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Creamos aplicacion de Flask
# y los 'cubrimos' con la capa de SocketIo
app = Flask(__name__)
socketio = SocketIO(app, logger=False)

# Damos acceso a el directorio donde se encuentran las fotos para reconocimiento
@app.route('/uploads/<path:path>')
def send_report(path):
    return send_from_directory('dataset', path)

# Devuelve la pagina principal (index)
# Pasamos los eventos que ya tenemos guardados para incluirlos en la tabla de la template
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/post', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        if 'photo' not in request.files:
            return json.dumps({'response': '400 Bad Request'}), 400
        if True:
            return json.dumps({'response': '200 Success', 'user': 'J'}), 200

        
@app.route('/new', methods=['POST'])
def new_face():
    if request.method == 'POST':
        if 'photo' not in request.files:
            return json.dumps({'response': '400 Bad Request'}), 400
        if True:
            print(request.files['photo'].filename)
            print(request.form['user'])
            return json.dumps({'response': '200 Success'}), 200

def send_push_message(token, title, message, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        title=title,
                        body=message,
                        data=extra))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        print(
            {
                'token': token,
                'message': message,
                'extra': extra,
                'errors': exc.errors,
                'response_data': exc.response_data,
            })
        raise

if __name__ == '__main__':
    x =  '{"files" : []}'
    z = json.loads(x)
    for f in os.listdir():
        print(f)
        y = Template('{"url": "${file}"}')
        z["files"].append(y.substitute(file=f))
        
    send_push_message('ExponentPushToken[VY4iFDOLwuwP1ketscb_VI]', 'Running', 'Hello!', {'url': 'http://192.168.1.65:5000'})
    print(json.dumps(z))
    # Iniciamos aplicacion Flask+SocketIo
    socketio.run(app, host='0.0.0.0', port=5000) #ssl_context='adhoc'
