from flask import Blueprint, request, jsonify
from api.models import db, Curso, Destino, Idioma, Servicio
from flask_jwt_extended import jwt_required

curso_bp = Blueprint('curso', __name__)

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 1) Ruta para obtener todos los cursos

@curso_bp.route('', methods=['GET'])
def get_cursos():
    cursos = Curso.query.all()
    return jsonify([curso.serialize() for curso in cursos]), 200

# Finalizar ruta para obtener todos los cursos

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 2) Ruta para obtener un curso por ID

@curso_bp.route('/<int:id>', methods=['GET'])
def get_curso(id):
    curso = Curso.query.get(id)
    if not curso:
        return jsonify({"error": "Curso no encontrado"}), 404
    return jsonify(curso.serialize()), 200

# Finalizar ruta para obtener un curso por ID

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 3) Ruta para crear un nuevo curso

@curso_bp.route('', methods=['POST'])
@jwt_required()
def create_curso():
    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400
    
    # Campos requeridos
    required_fields = [
        'nombre', 'descripcion', 'duracion', 'nivel', 
        'tipoCurso', 'edades', 'destino_id', 'idioma_id'
    ]
    empty_fields = [f for f in required_fields if not data.get(f)]
    if empty_fields:
        return jsonify({
            'msg': 'Campos obligatorios faltantes',
            'campos_faltantes': empty_fields
        }), 400
    
    # Verificar que destino e idioma existen
    destino = Destino.query.get(data['destino_id'])
    if not destino:
        return jsonify({"error": "Destino no encontrado"}), 404
    
    idioma = Idioma.query.get(data['idioma_id'])
    if not idioma:
        return jsonify({"error": "Idioma no encontrado"}), 404
    
    # Verificar si el curso ya existe
    existing_curso = Curso.query.filter_by(nombre=data['nombre']).first()
    if existing_curso:
        return jsonify({"error": "Ya existe un curso con ese nombre"}), 400
    
    # Crear nuevo curso
    nuevo_curso = Curso(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        duracion=data['duracion'],
        nivel=data['nivel'],
        imageUrl=data.get('imageUrl'),
        tipoCurso=data['tipoCurso'],
        edades=data['edades'],
        destino_id=data['destino_id'],
        idioma_id=data['idioma_id']
    )
    
    # Asociar servicios
    servicio_ids = data.get('servicios', [])
    for servicio_id in servicio_ids:
        servicio = Servicio.query.get(servicio_id)
        if servicio:
            nuevo_curso.servicios.append(servicio)
    
    db.session.add(nuevo_curso)
    try:
        db.session.commit()
        return jsonify(nuevo_curso.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear curso", "details": str(e)}), 500

# Finalizar ruta para crear un nuevo curso

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 4) Ruta para actualizar un curso por ID

@curso_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_curso(id):
    curso = Curso.query.get(id)
    if not curso:
        return jsonify({"error": "Curso no encontrado"}), 404

    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400

    # Actualizar campos
    if 'nombre' in data and data['nombre'].strip():
        # Verificar si el nuevo nombre ya existe
        if data['nombre'] != curso.nombre:
            existing = Curso.query.filter_by(nombre=data['nombre']).first()
            if existing:
                return jsonify({"error": "Ya existe un curso con ese nombre"}), 400
        curso.nombre = data['nombre'].strip()
    
    if 'descripcion' in data and data['descripcion'].strip():
        curso.descripcion = data['descripcion'].strip()
    
    if 'duracion' in data and data['duracion'].strip():
        curso.duracion = data['duracion'].strip()
    
    if 'nivel' in data and data['nivel'].strip():
        curso.nivel = data['nivel'].strip()
    
    if 'tipoCurso' in data and data['tipoCurso'].strip():
        curso.tipoCurso = data['tipoCurso'].strip()
    
    if 'edades' in data and data['edades'].strip():
        curso.edades = data['edades'].strip()
    
    if 'imageUrl' in data:
        curso.imageUrl = data['imageUrl'].strip() if data['imageUrl'] else None
    
    if 'destino_id' in data and data['destino_id'] != curso.destino_id:
        destino = Destino.query.get(data['destino_id'])
        if not destino:
            return jsonify({"error": "Destino no encontrado"}), 404
        curso.destino_id = data['destino_id']
    
    if 'idioma_id' in data and data['idioma_id'] != curso.idioma_id:
        idioma = Idioma.query.get(data['idioma_id'])
        if not idioma:
            return jsonify({"error": "Idioma no encontrado"}), 404
        curso.idioma_id = data['idioma_id']
    
    # Actualizar servicios
    if 'servicios' in data:
        servicio_ids = data['servicios']
        curso.servicios = []
        for servicio_id in servicio_ids:
            servicio = Servicio.query.get(servicio_id)
            if servicio:
                curso.servicios.append(servicio)

    try:
        db.session.commit()
        return jsonify(curso.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar curso", "details": str(e)}), 500

# Finalizar ruta para actualizar un curso

#--------------------------------------------------------------------------------------------------------------------------------------------------
# 5) Ruta para eliminar un curso por ID

@curso_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_curso(id):
    curso = Curso.query.get(id)
    if not curso:
        return jsonify({"error": "Curso no encontrado"}), 404
    
    db.session.delete(curso)
    try:
        db.session.commit()
        return jsonify({"msg": "Curso eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar curso", "details": str(e)}), 500

# Finalizar ruta para eliminar un curso por ID