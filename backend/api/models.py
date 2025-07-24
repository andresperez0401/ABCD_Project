from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, Float, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, time, datetime
import uuid

db = SQLAlchemy()

# Tabla de asociación para la relación Curso-Servicio
curso_servicio = Table(
    'curso_servicio',
    db.metadata,
    Column('curso_id', Integer, ForeignKey('curso.idCurso'), primary_key=True),
    Column('servicio_id', Integer, ForeignKey('servicio.idServicio'), primary_key=True)
)

# ---------------------------- Usuario ----------------------------
class Usuario(db.Model):
    __tablename__ = 'usuario'
    idUsuario: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    clave: Mapped[str] = mapped_column(String(120), nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=False)

    def serialize(self):
        return {
            'idUsuario': self.idUsuario,
            'nombre': self.nombre,
            'email': self.email,
            'telefono': self.telefono
        }

# ---------------------------- Cliente -----------------------------
class Cliente(db.Model):
    __tablename__ = 'cliente'
    idCliente: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=False)
    interes: Mapped[str] = mapped_column(String(255), nullable=False)
    estado: Mapped[str] = mapped_column(String(50), nullable=True)
    fecha_registro: Mapped[datetime] = mapped_column(db.DateTime, nullable=False)  # Nuevo campo


    def serialize(self):
        return {
            'idCliente': self.idCliente,
            'nombre': self.nombre,
            'email': self.email,
            'telefono': self.telefono,
            'interes': self.interes, 
            'estado': self.estado,
            'fecha_registro': self.fecha_registro.isoformat() if self.fecha_registro else None
         }

# ---------------------------- Destino -----------------------------
class Destino(db.Model):
    __tablename__ = 'destino'
    idDestino: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    ubicacion: Mapped[str] = mapped_column(String(255), nullable=True)
    imageUrl: Mapped[str] = mapped_column(String(255), nullable=True)

    ciudades: Mapped[list['Ciudad']] = relationship('Ciudad', back_populates='destino', cascade='all, delete-orphan')
    cursos: Mapped[list['Curso']] = relationship('Curso', back_populates='destino')

    def serialize(self):
        return {
            'idDestino': self.idDestino,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'ubicacion': self.ubicacion,
            'imageUrl': self.imageUrl
        }

# ---------------------------- Ciudad ------------------------------
class Ciudad(db.Model):
    __tablename__ = 'ciudad'
    idCiudad: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    imageUrl: Mapped[str] = mapped_column(String(255), nullable=True)
    destino_id: Mapped[int] = mapped_column(Integer, ForeignKey('destino.idDestino'), nullable=False)

    destino: Mapped['Destino'] = relationship('Destino', back_populates='ciudades')

    def serialize(self):
        return {
            'idCiudad': self.idCiudad,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'destino_id': self.destino_id,
            'imageUrl': self.imageUrl
        }

# ---------------------------- Idioma ------------------------------
class Idioma(db.Model):
    __tablename__ = 'idioma'
    idIdioma: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    imageUrl: Mapped[str] = mapped_column(String(255), nullable=True)

    cursos: Mapped[list['Curso']] = relationship('Curso', back_populates='idioma')

    def serialize(self):
        return {
            'idIdioma': self.idIdioma,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'imageUrl': self.imageUrl
        }

# ---------------------------- Curso ------------------------------
class Curso(db.Model):
    __tablename__ = 'curso'
    idCurso: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    duracion: Mapped[str] = mapped_column(String(50), nullable=False)
    nivel: Mapped[str] = mapped_column(String(50), nullable=False)
    imageUrl: Mapped[str] = mapped_column(String(255), nullable=True)
    tipoCurso: Mapped[str] = mapped_column(String(50), nullable=False)
    edades: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relaciones simplificadas
    servicios: Mapped[list['Servicio']] = relationship(
        'Servicio', 
        secondary=curso_servicio, 
        back_populates='cursos'
    )

    destino_id: Mapped[int] = mapped_column(Integer, ForeignKey('destino.idDestino'), nullable=False)
    destino: Mapped['Destino'] = relationship('Destino', back_populates='cursos')

    idioma_id: Mapped[int] = mapped_column(Integer, ForeignKey('idioma.idIdioma'), nullable=False)
    idioma: Mapped['Idioma'] = relationship('Idioma', back_populates='cursos')

    def serialize(self):
        return {
            'idCurso': self.idCurso,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'duracion': self.duracion,
            'nivel': self.nivel,
            'imageUrl': self.imageUrl,
            'tipoCurso': self.tipoCurso,
            'edades': self.edades,
            'destino': self.destino.serialize() if self.destino else None,
            'idioma': self.idioma.serialize() if self.idioma else None,
            'servicios': [s.serialize() for s in self.servicios]
        }

# ---------------------------- Servicio ---------------------------
class Servicio(db.Model):
    __tablename__ = 'servicio'
    idServicio: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(String(255), nullable=False)
    precio: Mapped[str] = mapped_column(String(50), nullable=True)
    imageUrl: Mapped[str] = mapped_column(String(255), nullable=True)

    cursos: Mapped[list['Curso']] = relationship(
        'Curso', 
        secondary=curso_servicio, 
        back_populates='servicios'
    )

    def serialize(self):
        return {
            'idServicio': self.idServicio,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'precio': self.precio,
            'imageUrl': self.imageUrl
        }
    

# ---------------------------- Testimonio ---------------------------
class Testimonio(db.Model):
    
    __tablename__ = 'testimonio'
    idTestimonio: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    mensaje: Mapped[str] = mapped_column(String(255), nullable=False)
    videoUrl: Mapped[str] = mapped_column(String(255), nullable=True)

    def serialize(self):
        return {
            'idTestimonio': self.idTestimonio,
            'nombre': self.nombre,
            'mensaje': self.mensaje,
            'videoUrl': self.videoUrl
        }