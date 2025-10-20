# backend/app.py
import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv

# Importar modelos y blueprints
from api.models import db
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

app = Flask(__name__, static_folder="static", static_url_path="/")

# Si sirves frontend desde el mismo dominio, CORS podría ser innecesario.
# Si prefieres mantenerlo:
CORS(app, supports_credentials=True)

# DB: usa DATABASE_URL si existe; si no, cae a SQLite (solo dev local)
base_dir = os.path.dirname(os.path.realpath(__file__))
ruta_sqlite = os.path.join(base_dir, "sqlite", "abcdatabase.db")
default_uri = f"sqlite:///{ruta_sqlite}"
# "postgresql+psycopg://neondb_owner:npg_xsBDCO19fVhS@ep-blue-math-a4s3507k-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

db_uri = os.getenv("DATABASE_URL", default_uri).replace("postgres://", "postgresql://")
print(db_uri)
app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "change-me")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

db.init_app(app)
Migrate(app, db, compare_type=True)
jwt = JWTManager(app)

# Blueprints API
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(usuario_bp, url_prefix='/usuario')
app.register_blueprint(cliente_bp, url_prefix='/cliente')
app.register_blueprint(destino_bp, url_prefix='/destino')
app.register_blueprint(ciudad_bp, url_prefix='/ciudad')
app.register_blueprint(idioma_bp, url_prefix='/idioma')
app.register_blueprint(curso_bp, url_prefix='/curso')
app.register_blueprint(servicio_bp, url_prefix='/servicio')
app.register_blueprint(testimonio_bp, url_prefix='/testimonio')

# Salud
@app.route('/healthz')
def healthz():
    return jsonify(ok=True)

# SPA fallback: sirve index.html para rutas que no sean archivos estáticos
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    file_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Solo para local
    app.run(host='0.0.0.0', debug=True, port=5000)
