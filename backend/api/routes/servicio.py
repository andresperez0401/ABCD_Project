from flask import Blueprint, request, jsonify
from api.models import db, Servicio
from flask_jwt_extended import jwt_required

servicio_bp = Blueprint('servicio', __name__)

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 1) Ruta para obtener todos los servicios

@servicio_bp.route('', methods=['GET'])
def get_servicios():
    servicios = Servicio.query.all()
    return jsonify([servicio.serialize() for servicio in servicios]), 200

# Finalizar ruta para obtener todos los servicios

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 2) Ruta para obtener un servicio por ID

@servicio_bp.route('/<int:id>', methods=['GET'])
def get_servicio(id):
    servicio = Servicio.query.get(id)
    if not servicio:
        return jsonify({"error": "Servicio no encontrado"}), 404
    return jsonify(servicio.serialize()), 200

# Finalizar ruta para obtener un servicio por ID

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 3) Ruta para crear un nuevo servicio

@servicio_bp.route('', methods=['POST'])
@jwt_required()
def create_servicio():
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
    
    # Verificar si el servicio ya existe
    existing_servicio = Servicio.query.filter_by(nombre=data['nombre']).first()
    if existing_servicio:
        return jsonify({"error": "Ya existe un servicio con ese nombre"}), 400
    
    # Crear nuevo servicio
    nuevo_servicio = Servicio(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        precio=data.get('precio'),
        imageUrl=data.get('imageUrl')
    )
    
    db.session.add(nuevo_servicio)
    try:
        db.session.commit()
        return jsonify(nuevo_servicio.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear servicio", "details": str(e)}), 500

# Finalizar ruta para crear un nuevo servicio

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 4) Ruta para actualizar un servicio por ID

@servicio_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_servicio(id):
    servicio = Servicio.query.get(id)
    if not servicio:
        return jsonify({"error": "Servicio no encontrado"}), 404

    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400

    # Actualizar campos
    if 'nombre' in data and data['nombre'].strip():
        # Verificar si el nuevo nombre ya existe
        if data['nombre'] != servicio.nombre:
            existing = Servicio.query.filter_by(nombre=data['nombre']).first()
            if existing:
                return jsonify({"error": "Ya existe un servicio con ese nombre"}), 400
        servicio.nombre = data['nombre'].strip()
    
    if 'descripcion' in data and data['descripcion'].strip():
        servicio.descripcion = data['descripcion'].strip()
    
    if 'precio' in data:
        servicio.precio = data['precio']
    
    if 'imageUrl' in data:
        servicio.imageUrl = data['imageUrl'].strip() if data['imageUrl'] else None

    try:
        db.session.commit()
        return jsonify(servicio.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar servicio", "details": str(e)}), 500

# Finalizar ruta para actualizar un servicio

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 5) Ruta para eliminar un servicio por ID

@servicio_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_servicio(id):
    servicio = Servicio.query.get(id)
    if not servicio:
        return jsonify({"error": "Servicio no encontrado"}), 404
    
    # Verificar si está asociado a cursos
    if servicio.cursos:
        return jsonify({"error": "No se puede eliminar porque está asociado a cursos"}), 400
    
    db.session.delete(servicio)
    try:
        db.session.commit()
        return jsonify({"msg": "Servicio eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar servicio", "details": str(e)}), 500

# Finalizar ruta para eliminar un servicio por ID