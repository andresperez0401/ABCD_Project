from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite solicitudes desde otros orígenes (React)

@app.route('/')
def index():
    return jsonify({"mensaje": "Hola desde Flask!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Ejecuta la aplicación en el puerto 5000	
