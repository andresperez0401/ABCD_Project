# api/routes/testimonio.py
from flask import Blueprint, jsonify
from api.models import db, Testimonio

testimonio_bp = Blueprint('testimonio', __name__)

@testimonio_bp.route('/', methods=['GET'])
def get_testimonios():
    """
    Devuelve la lista de testimonios serializados.
    GET /testimonio
    """
    lista = Testimonio.query.all()
    # Serializamos cada objeto
    resultados = [t.serialize() for t in lista]
    return jsonify(resultados), 200
