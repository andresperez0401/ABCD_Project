--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_servicio

-- Cursos en Canadá (ID destino=1) para Inglés (ID idioma=1)
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Inglés Intensivo', 'Curso acelerado de 30 horas semanales', '4 semanas', 'Intermedio', 'Intensivo', '18-25', 1, 1, 'https://plus.unsplash.com/premium_photo-1681248156366-d54ce5840c61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Inglés Académico', 'Preparación para estudios universitarios', '12 semanas', 'Avanzado', 'Académico', '18+', 1, 1, 'https://images.unsplash.com/photo-1646579886135-068c73800308?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Cursos en Francia (ID destino=4) para Francés (ID idioma=2)
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Ingles Turístico en Malta', 'Enfoque en comunicación para viajes', '2 semanas', 'Básico', 'Vacacional', '16+', 2, 1, 'https://images.unsplash.com/photo-1522307617379-e982f8754d27?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');