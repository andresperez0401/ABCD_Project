from flask import Blueprint, request, jsonify
from api.models import Usuario
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

# Ruta para hacer login de usuarios
@auth_bp.route('/login', methods=['POST'])
def login():

    # Verificar que se reciban datos
    data = request.get_json() or {}
    
    # Campos requeridos
    required_fields = ['email', 'clave']

    # Verificamos que no falte ninguno de los campos requeridos ni que estén vacíos
    empty_fields = [field for field in required_fields if not data.get(field)]

    if empty_fields:
        return jsonify({
            'msg': 'Algunos campos están vacíos o faltan',
            'Campos vacíos o faltantes': empty_fields
        }), 400

    usuario = Usuario.query.filter_by(email=data.get('email'), clave=data.get('clave')).first()
    if not usuario:
        return jsonify({"error": "Credenciales inválidas"}), 401

    # Crear token de acceso
    access_token = create_access_token(identity=usuario.email, expires_delta=timedelta(hours=1)) # Se le puede agregar aditional claims para mas datos con coma despues de expires delta

    return jsonify({ "msg" : "Acceso otorgado al usuario: " + usuario.email ,"token": access_token}), 200
