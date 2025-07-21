from flask import Blueprint, request, jsonify
from api.models import db, Ciudad, Destino
from flask_jwt_extended import jwt_required

ciudad_bp = Blueprint('ciudad', __name__)

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 1) Ruta para obtener todas las ciudades

@ciudad_bp.route('', methods=['GET'])
def get_ciudades():
    ciudades = Ciudad.query.all()
    return jsonify([ciudad.serialize() for ciudad in ciudades]), 200

# Finalizar ruta para obtener todas las ciudades

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 2) Ruta para obtener una ciudad por ID

@ciudad_bp.route('/<int:id>', methods=['GET'])
def get_ciudad(id):
    ciudad = Ciudad.query.get(id)
    if not ciudad:
        return jsonify({"error": "Ciudad no encontrada"}), 404
    return jsonify(ciudad.serialize()), 200

# Finalizar ruta para obtener una ciudad por ID

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 3) Ruta para crear una nueva ciudad

@ciudad_bp.route('', methods=['POST'])
@jwt_required()
def create_ciudad():
    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400
    
    # Campos requeridos
    required_fields = ['nombre', 'descripcion', 'destino_id']
    empty_fields = [f for f in required_fields if not data.get(f)]
    if empty_fields:
        return jsonify({
            'msg': 'Campos obligatorios faltantes',
            'campos_faltantes': empty_fields
        }), 400
    
    # Verificar que el destino existe
    destino = Destino.query.get(data['destino_id'])
    if not destino:
        return jsonify({"error": "Destino no encontrado"}), 404
    
    # Verificar si la ciudad ya existe en ese destino
    existing_ciudad = Ciudad.query.filter_by(
        nombre=data['nombre'], 
        destino_id=data['destino_id']
    ).first()
    
    if existing_ciudad:
        return jsonify({"error": "Ya existe una ciudad con ese nombre en este destino"}), 400
    
    # Crear nueva ciudad
    nueva_ciudad = Ciudad(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        imageUrl=data.get('imageUrl'),
        destino_id=data['destino_id']
    )
    
    db.session.add(nueva_ciudad)
    try:
        db.session.commit()
        return jsonify(nueva_ciudad.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear ciudad", "details": str(e)}), 500

# Finalizar ruta para crear una nueva ciudad

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 4) Ruta para actualizar una ciudad por ID

@ciudad_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_ciudad(id):
    ciudad = Ciudad.query.get(id)
    if not ciudad:
        return jsonify({"error": "Ciudad no encontrada"}), 404

    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400

    # Actualizar campos
    if 'nombre' in data and data['nombre'].strip():
        # Verificar si el nuevo nombre ya existe en el mismo destino
        if data['nombre'] != ciudad.nombre:
            existing = Ciudad.query.filter_by(
                nombre=data['nombre'], 
                destino_id=ciudad.destino_id
            ).first()
            if existing:
                return jsonify({"error": "Ya existe una ciudad con ese nombre en este destino"}), 400
        ciudad.nombre = data['nombre'].strip()
    
    if 'descripcion' in data and data['descripcion'].strip():
        ciudad.descripcion = data['descripcion'].strip()
    
    if 'imageUrl' in data:
        ciudad.imageUrl = data['imageUrl'].strip() if data['imageUrl'] else None
    
    if 'destino_id' in data and data['destino_id'] != ciudad.destino_id:
        # Verificar que el nuevo destino existe
        destino = Destino.query.get(data['destino_id'])
        if not destino:
            return jsonify({"error": "Destino no encontrado"}), 404
        
        # Verificar si la ciudad ya existe en el nuevo destino
        existing_in_destino = Ciudad.query.filter_by(
            nombre=ciudad.nombre, 
            destino_id=data['destino_id']
        ).first()
        if existing_in_destino:
            return jsonify({"error": "Ya existe una ciudad con ese nombre en el destino seleccionado"}), 400
        
        ciudad.destino_id = data['destino_id']

    try:
        db.session.commit()
        return jsonify(ciudad.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar ciudad", "details": str(e)}), 500

# Finalizar ruta para actualizar una ciudad

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 5) Ruta para eliminar una ciudad por ID

@ciudad_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_ciudad(id):
    ciudad = Ciudad.query.get(id)
    if not ciudad:
        return jsonify({"error": "Ciudad no encontrada"}), 404
    
    # Verificar si tiene cursos asociados (depende de tu modelo)
    # if ciudad.cursos:
    #    return jsonify({"error": "No se puede eliminar porque tiene cursos asociados"}), 400
    
    db.session.delete(ciudad)
    try:
        db.session.commit()
        return jsonify({"msg": "Ciudad eliminada"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar ciudad", "details": str(e)}), 500

# Finalizar ruta para eliminar una ciudad por ID