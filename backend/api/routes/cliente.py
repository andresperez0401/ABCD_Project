from datetime import datetime
from flask import Blueprint, request, jsonify
from api.models import db, Cliente
from flask_jwt_extended import jwt_required

cliente_bp = Blueprint('cliente', __name__)

@cliente_bp.route('', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.all()
    return jsonify([cliente.serialize() for cliente in clientes]), 200

@cliente_bp.route('/<int:id>', methods=['GET'])
def get_cliente(id):
    cliente = Cliente.query.get(id)
    if not cliente:
        return jsonify({"error": "Cliente no encontrado"}), 404
    return jsonify(cliente.serialize()), 200

@cliente_bp.route('/email/<string:email>', methods=['GET'])
def get_cliente_by_email(email):
    cliente = Cliente.query.filter_by(email=email).first()
    if not cliente:
        return jsonify({"error": "Cliente no encontrado"}), 404
    return jsonify(cliente.serialize()), 200

@cliente_bp.route('', methods=['POST'])
def create_cliente():

    # Verificar que se reciban datos
    data = request.get_json() or {}
    if not data:
        return jsonify({'msg': 'No se recibieron datos'}), 400
    
    # Campos requeridos
    # Ahora también requerimos: interes, duracion, edad y como_se_entero
    required_fields = ['nombre', 'email', 'telefono', 'interes', 'duracion', 'edad', 'como_se_entero']

    # Verificamos que no falte ninguno de los campos requeridos ni que estén vacíos
    empty_fields = [field for field in required_fields if not data.get(field)]

    if empty_fields:
        return jsonify({
            'msg': 'Algunos campos están vacíos o faltan',
            'Campos vacíos o faltantes': empty_fields
        }), 400
    
    # Verificar si el email ya existe
    existing_cliente = Cliente.query.filter_by(email=data['email']).first()
    if existing_cliente:
        return jsonify({"error": "El email ya se encuentra registrado"}), 400

    # Validación adicional: si como_se_entero == 'Otro', se requiere el campo como_se_entero_otro
    if data.get('como_se_entero') == 'Otro' and not data.get('como_se_entero_otro'):
        return jsonify({
            'msg': 'Debe especificar el detalle en "Otro"',
            'Campos vacíos o faltantes': ['como_se_entero_otro']
        }), 400

    # Creamos el nuevo cliente
    nuevo_cliente = Cliente(
        nombre=data.get('nombre'),
        email=data.get('email'),
        telefono=data.get('telefono'),
        interes=data.get('interes', ''),
        estado='Registrado',
        fecha_registro=datetime.utcnow(),
        duracion=data.get('duracion'),
        edad=int(data.get('edad')) if str(data.get('edad')).isdigit() else None,
        como_se_entero=data.get('como_se_entero'),
        como_se_entero_otro=data.get('como_se_entero_otro')
    )

    # Agregar a la base de datos y confirmar
    db.session.add(nuevo_cliente)
    db.session.commit()

    return jsonify(nuevo_cliente.serialize()), 201

@cliente_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_cliente(id):
    cliente = Cliente.query.get(id)
    if not cliente:
        return jsonify({"error": "Cliente no encontrado"}), 404
    
    data = request.get_json()
    
    # Actualizar solo los campos permitidos
    if 'estado' in data:
        cliente.estado = data['estado']
    
    if 'nombre' in data:
        cliente.nombre = data['nombre']
    
    if 'email' in data:
        # Verificar si el nuevo email ya existe
        if data['email'] != cliente.email:
            existing = Cliente.query.filter_by(email=data['email']).first()
            if existing:
                return jsonify({"error": "El email ya está registrado"}), 400
        cliente.email = data['email']
    
    if 'telefono' in data:
        cliente.telefono = data['telefono']
    
    if 'interes' in data:
        cliente.interes = data['interes']
    if 'duracion' in data:
        cliente.duracion = data['duracion']
    if 'edad' in data:
        try:
            cliente.edad = int(data['edad']) if data['edad'] is not None else None
        except (TypeError, ValueError):
            return jsonify({"error": "Edad inválida"}), 400
    if 'como_se_entero' in data:
        cliente.como_se_entero = data['como_se_entero']
    if 'como_se_entero_otro' in data:
        cliente.como_se_entero_otro = data['como_se_entero_otro']
    
    db.session.commit()
    return jsonify(cliente.serialize()), 200

@cliente_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_cliente(id):
    cliente = Cliente.query.get(id)
    if not cliente:
        return jsonify({"error": "Cliente no encontrado"}), 404
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({"message": "Cliente eliminado"}), 200