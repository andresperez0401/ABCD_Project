--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_servicio

-- Cursos en Canadá (ID destino=1) para Inglés (ID idioma=1)
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Inglés Intensivo', 'Curso acelerado de 30 horas semanales', '4 semanas', 'Intermedio', 'Intensivo', '12-25', 1, 1, 'https://plus.unsplash.com/premium_photo-1681248156366-d54ce5840c61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Inglés Académico', 'Preparación para estudios universitarios', '12 semanas', 'Avanzado', 'Académico', '12+', 1, 1, 'https://images.unsplash.com/photo-1646579886135-068c73800308?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Cursos en Malta (ID destino=2) para Ingles (ID idioma=1)
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Ingles Turístico en Malta', 'Enfoque en comunicación para viajes', '2 semanas', 'Básico', 'Vacacional', '12+', 2, 1, 'https://images.unsplash.com/photo-1522307617379-e982f8754d27?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--Inglaterra
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl) 
VALUES 
('Estudia Inglés en Inglaterra!', 'Multinivel', '2-8 Semanas', 'Básico, Intermedio, Avanzado', 'Vacacional', '12+', 3, 1, 'https://images.unsplash.com/photo-1617160105398-3cc2cade5cd7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--USA
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl)
VALUES
('Inglés General en USA', 'Curso de inglés para todos los niveles, en tu ciudad favorita', '3-9 semanas', 'Básico, Intermedio, Avanzado', 'General', '12+', 4, 1, 'https://images.unsplash.com/photo-1515861209048-dae6a1e1ed56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--Irlanda
INSERT INTO curso (nombre, descripcion, duracion, nivel, tipoCurso, edades, destino_id, idioma_id, imageUrl)
VALUES
('Inglés en Irlanda', 'Descubre la increible ciudad de Dublin', '3-9 semanas', 'Intermedio, Avanzado', 'General', '12+', 5, 1, 'https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');