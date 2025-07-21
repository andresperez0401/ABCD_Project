from flask import Blueprint, request, jsonify
from api.models import db, Usuario
from flask_jwt_extended import jwt_required, get_jwt_identity

usuario_bp = Blueprint('usuario', __name__)

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 1) Ruta para obtener todos los usuarios 

@usuario_bp.route('', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([usuario.serialize() for usuario in usuarios]), 200

#Finalizar ruta para obtener todos los usuarios



# 2) Ruta para obtener un usuario por ID

@usuario_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_usuario(id):
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(usuario.serialize()), 200

# Finalizar ruta para obtener un usuario por ID



# 3) Ruta para crear un nuevo usuario

@usuario_bp.route('', methods=['POST'])
def create_usuario():
    
    # Verificar que se reciban datos
    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400
    
    # Campos requeridos
    required_fields = ['nombre', 'email', 'clave', 'telefono']
    empty_fields = [f for f in required_fields if not data.get(f)]
    if empty_fields:
        return jsonify({
            'msg': 'Algunos campos están vacíos o faltan',
            'Campos vacíos o faltantes': empty_fields
        }), 400
    
    # Verificar si el email ya existe
    existing_usuario = Usuario.query.filter_by(email=data['email']).first()
    if existing_usuario:
        return jsonify({"error": "El email ya está en uso"}), 400
    
    # Verificar si el teléfono ya existe
    existing_telefono = Usuario.query.filter_by(telefono=data['telefono']).first()
    if existing_telefono:
        return jsonify({"error": "El teléfono ya está en uso"}), 400
    
    # Crear el nuevo usuario
    nuevo_usuario = Usuario(
        nombre=data.get('nombre'),
        email=data.get('email'),
        clave=data.get('clave'),
        telefono=data.get('telefono')
    )

    # Guardar en la base de datos
    db.session.add(nuevo_usuario)
    db.session.commit()

    # Retornar el usuario creado
    return jsonify(nuevo_usuario.serialize()), 201

# Finalizar ruta para crear un nuevo usuario



# 4) Ruta para actualizar un usuario por ID

@usuario_bp.route('/edit', methods=['PUT'])
@jwt_required()
def update_usuario():

    # Verificar que se reciban datos
    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400
    
    # Verificar que el usuario existe
    email = get_jwt_identity()
    user = Usuario.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    # Validar contraseña
    if 'clave' in data and data['clave'].strip():
        if len(data['clave'].strip()) < 8:
            return jsonify({'msg': 'La clave debe tener al menos 8 caracteres'}), 400
        user.clave = data['clave'].strip()

    # Actualizar nombre
    if 'nombre' in data and data['nombre'].strip():
        user.nombre = data['nombre'].strip()

    try:
        db.session.commit()
        return jsonify({'msg': 'Usuario actualizado', 'usuario': user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': 'Error al actualizar usuario'}), 500
    
# Finalizar ruta para actualizar un usuario 



# 5) Ruta para eliminar un usuario por ID

@usuario_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):

    # Verificar que el usuario existe
    usuario = Usuario.query.get(id)
    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404
    
    # Eliminar el usuario
    db.session.delete(usuario)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado"}), 200

# Finalizar ruta para eliminar un usuario por ID