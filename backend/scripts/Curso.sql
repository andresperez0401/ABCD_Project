--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_servicio

-- Cursos en Canadá (ID destino=1) para Inglés (ID idioma=1)
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Inglés Intensivo', 'Curso acelerado de 30 horas semanales', '4 semanas', 'Intermedio', 'Intensivo', '18-25', 1, 1, 'https://ejemplo.com/curso_intensivo.jpg'),
('Inglés Académico', 'Preparación para estudios universitarios', '12 semanas', 'Avanzado', 'Académico', '18+', 1, 1, 'https://ejemplo.com/academico.jpg');

-- Cursos en Francia (ID destino=4) para Francés (ID idioma=2)
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Francés Turístico', 'Enfoque en comunicación para viajes', '2 semanas', 'Básico', 'Vacacional', '16+', 4, 2, 'https://ejemplo.com/frances_turistico.jpg');