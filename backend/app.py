import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv

# Importar modelos
from api.models import db

# Importar Blueprints
from api.routes.auth import auth_bp
from api.routes.usuario import usuario_bp
from api.routes.cliente import cliente_bp
from api.routes.destino import destino_bp
from api.routes.ciudad import ciudad_bp
from api.routes.idioma import idioma_bp
from api.routes.curso import curso_bp
from api.routes.servicio import servicio_bp
from api.routes.testimonio import testimonio_bp

load_dotenv()

app = Flask(__name__)
CORS(app, 
     resources={r"/*": {"origins": ["http://abcdlanguages.com", "http://localhost:3000"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE"]
)

# Configuración de la base de datos
base_dir = os.path.dirname(os.path.realpath(__file__))
ruta_sqlite = os.path.join(base_dir, "sqlite", "abcdatabase.db")
default_uri = f"sqlite:///{ruta_sqlite}"
db_uri = os.getenv("DATABASE_URL", default_uri).replace("postgres://", "postgresql://")
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configuración JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "super-secret")  # Cambia esto en producción
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

db.init_app(app)
Migrate(app, db, compare_type=True)
jwt = JWTManager(app)

# Registrar Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(usuario_bp, url_prefix='/usuario')
app.register_blueprint(cliente_bp, url_prefix='/cliente')
app.register_blueprint(destino_bp, url_prefix='/destino')
app.register_blueprint(ciudad_bp, url_prefix='/ciudad')
app.register_blueprint(idioma_bp, url_prefix='/idioma')
app.register_blueprint(curso_bp, url_prefix='/curso')
app.register_blueprint(servicio_bp, url_prefix='/servicio')
app.register_blueprint(testimonio_bp, url_prefix='/testimonio')

# Ruta base
@app.route('/')
def index():
    return jsonify({"mensaje": "Bienvenido a la API de ABCD"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8080)