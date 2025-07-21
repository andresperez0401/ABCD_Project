from flask import Blueprint, request, jsonify
from api.models import db, Destino
from flask_jwt_extended import jwt_required

destino_bp = Blueprint('destino', __name__)

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 1) Ruta para obtener todos los destinos

@destino_bp.route('', methods=['GET'])
def get_destinos():
    destinos = Destino.query.all()
    return jsonify([destino.serialize() for destino in destinos]), 200

# Finalizar ruta para obtener todos los destinos

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 2) Ruta para obtener un destino por ID

@destino_bp.route('/<int:id>', methods=['GET'])
def get_destino(id):
    destino = Destino.query.get(id)
    if not destino:
        return jsonify({"error": "Destino no encontrado"}), 404
    return jsonify(destino.serialize()), 200

# Finalizar ruta para obtener un destino por ID

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 3) Ruta para crear un nuevo destino

@destino_bp.route('', methods=['POST'])
@jwt_required()
def create_destino():
    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400
    
    # Campos requeridos
    required_fields = ['nombre', 'descripcion']
    empty_fields = [f for f in required_fields if not data.get(f)]
    if empty_fields:
        return jsonify({
            'msg': 'Campos obligatorios faltantes',
            'campos_faltantes': empty_fields
        }), 400
    
    # Verificar si el destino ya existe
    existing_destino = Destino.query.filter_by(nombre=data['nombre']).first()
    if existing_destino:
        return jsonify({"error": "Ya existe un destino con ese nombre"}), 400
    
    # Crear nuevo destino
    nuevo_destino = Destino(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        ubicacion=data.get('ubicacion'),
        imageUrl=data.get('imageUrl')
    )
    
    db.session.add(nuevo_destino)
    try:
        db.session.commit()
        return jsonify(nuevo_destino.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear destino", "details": str(e)}), 500

# Finalizar ruta para crear un nuevo destino

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 4) Ruta para actualizar un destino por ID

@destino_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_destino(id):
    destino = Destino.query.get(id)
    if not destino:
        return jsonify({"error": "Destino no encontrado"}), 404

    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400

    # Actualizar campos
    if 'nombre' in data and data['nombre'].strip():
        # Verificar si el nuevo nombre ya existe
        if data['nombre'] != destino.nombre:
            existing = Destino.query.filter_by(nombre=data['nombre']).first()
            if existing:
                return jsonify({"error": "Ya existe un destino con ese nombre"}), 400
        destino.nombre = data['nombre'].strip()
    
    if 'descripcion' in data and data['descripcion'].strip():
        destino.descripcion = data['descripcion'].strip()
    
    if 'ubicacion' in data:
        destino.ubicacion = data['ubicacion'].strip() if data['ubicacion'] else None
    
    if 'imageUrl' in data:
        destino.imageUrl = data['imageUrl'].strip() if data['imageUrl'] else None

    try:
        db.session.commit()
        return jsonify(destino.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar destino", "details": str(e)}), 500

# Finalizar ruta para actualizar un destino

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 5) Ruta para eliminar un destino por ID

@destino_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_destino(id):
    destino = Destino.query.get(id)
    if not destino:
        return jsonify({"error": "Destino no encontrado"}), 404
    
    # Verificar si tiene ciudades asociadas
    if destino.ciudades:
        return jsonify({"error": "No se puede eliminar porque tiene ciudades asociadas"}), 400
    
    db.session.delete(destino)
    try:
        db.session.commit()
        return jsonify({"msg": "Destino eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar destino", "details": str(e)}), 500

# Finalizar ruta para eliminar un destino por ID