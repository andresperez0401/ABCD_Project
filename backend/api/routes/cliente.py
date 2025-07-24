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
    required_fields = ['nombre', 'email', 'telefono']

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

    # Creamos el nuevo cliente
    nuevo_cliente = Cliente(
        nombre=data.get('nombre'),
        email=data.get('email'),
        telefono=data.get('telefono'),
        interes=data.get('interes', ''),
        estado='Registrado',
        fecha_registro=datetime.utcnow()
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