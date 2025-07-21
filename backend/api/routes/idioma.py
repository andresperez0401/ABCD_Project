from flask import Blueprint, request, jsonify
from api.models import db, Idioma
from flask_jwt_extended import jwt_required

idioma_bp = Blueprint('idioma', __name__)

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 1) Ruta para obtener todos los idiomas

@idioma_bp.route('', methods=['GET'])
def get_idiomas():
    idiomas = Idioma.query.all()
    return jsonify([idioma.serialize() for idioma in idiomas]), 200

# Finalizar ruta para obtener todos los idiomas

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 2) Ruta para obtener un idioma por ID

@idioma_bp.route('/<int:id>', methods=['GET'])
def get_idioma(id):
    idioma = Idioma.query.get(id)
    if not idioma:
        return jsonify({"error": "Idioma no encontrado"}), 404
    return jsonify(idioma.serialize()), 200

# Finalizar ruta para obtener un idioma por ID

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 3) Ruta para crear un nuevo idioma

@idioma_bp.route('', methods=['POST'])
@jwt_required()
def create_idioma():
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
    
    # Verificar si el idioma ya existe
    existing_idioma = Idioma.query.filter_by(nombre=data['nombre']).first()
    if existing_idioma:
        return jsonify({"error": "Ya existe un idioma con ese nombre"}), 400
    
    # Crear nuevo idioma
    nuevo_idioma = Idioma(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        imageUrl=data.get('imageUrl')
    )
    
    db.session.add(nuevo_idioma)
    try:
        db.session.commit()
        return jsonify(nuevo_idioma.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear idioma", "details": str(e)}), 500

# Finalizar ruta para crear un nuevo idioma

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 4) Ruta para actualizar un idioma por ID

@idioma_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_idioma(id):
    idioma = Idioma.query.get(id)
    if not idioma:
        return jsonify({"error": "Idioma no encontrado"}), 404

    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400

    # Actualizar campos
    if 'nombre' in data and data['nombre'].strip():
        # Verificar si el nuevo nombre ya existe
        if data['nombre'] != idioma.nombre:
            existing = Idioma.query.filter_by(nombre=data['nombre']).first()
            if existing:
                return jsonify({"error": "Ya existe un idioma con ese nombre"}), 400
        idioma.nombre = data['nombre'].strip()
    
    if 'descripcion' in data and data['descripcion'].strip():
        idioma.descripcion = data['descripcion'].strip()
    
    if 'imageUrl' in data:
        idioma.imageUrl = data['imageUrl'].strip() if data['imageUrl'] else None

    try:
        db.session.commit()
        return jsonify(idioma.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar idioma", "details": str(e)}), 500

# Finalizar ruta para actualizar un idioma

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 5) Ruta para eliminar un idioma por ID

@idioma_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_idioma(id):
    idioma = Idioma.query.get(id)
    if not idioma:
        return jsonify({"error": "Idioma no encontrado"}), 404
    
    # Verificar si tiene cursos asociados
    if idioma.cursos:
        return jsonify({"error": "No se puede eliminar porque tiene cursos asociados"}), 400
    
    db.session.delete(idioma)
    try:
        db.session.commit()
        return jsonify({"msg": "Idioma eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar idioma", "details": str(e)}), 500

# Finalizar ruta para eliminar un idioma por ID