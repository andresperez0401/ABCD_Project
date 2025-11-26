--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_destino → curso_servicio → Testimonio

-- Ciudades para Canadá (ID destino = 1)
INSERT INTO ciudad (nombre, descripcion, destino_id, "imageUrl") 
VALUES 
('Toronto', 'Ciudad multicultural con rascacielos icónicos', 1, 'https://ejemplo.com/toronto.jpg'),
('Vancouver', 'Paraíso natural entre montañas y océano', 1, 'https://ejemplo.com/vancouver.jpg');

-- Ciudades para Malta (ID destino = 2)
INSERT INTO ciudad (nombre, descripcion, destino_id, "imageUrl") 
VALUES 
('La Valeta', 'Capital histórica con arquitectura barroca', 2, 'https://ejemplo.com/valeta.jpg'),
('Sliema', 'Zona costera con vibrante vida nocturna', 2, 'https://ejemplo.com/sliema.jpg');