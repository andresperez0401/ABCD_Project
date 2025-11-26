--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_destino → curso_servicio

-- Asociar destinos al curso "Inglés Intensivo" (ID curso=1)
-- Este curso está disponible en Canadá
INSERT INTO curso_destino (curso_id, destino_id) 
VALUES 
(1, 1);  -- Canadá

-- Asociar destinos al curso "Inglés Académico" (ID curso=2)
-- Este curso está disponible en Canadá, USA e Inglaterra
INSERT INTO curso_destino (curso_id, destino_id) 
VALUES 
(2, 1),  -- Canadá
(2, 3),  -- Inglaterra
(2, 4);  -- USA

-- Asociar destinos al curso "Inglés Turístico en Malta" (ID curso=3)
-- Este curso está disponible solo en Malta
INSERT INTO curso_destino (curso_id, destino_id) 
VALUES 
(3, 2);  -- Malta

-- Asociar destinos al curso "Estudia Inglés en Inglaterra!" (ID curso=4)
-- Este curso está disponible en Inglaterra
INSERT INTO curso_destino (curso_id, destino_id) 
VALUES 
(4, 3);  -- Inglaterra

-- Asociar destinos al curso "Inglés General en USA" (ID curso=5)
-- Este curso está disponible en USA
INSERT INTO curso_destino (curso_id, destino_id) 
VALUES 
(5, 4);  -- USA

-- Asociar destinos al curso "Inglés en Irlanda" (ID curso=6)
-- Este curso está disponible en Irlanda
INSERT INTO curso_destino (curso_id, destino_id) 
VALUES 
(6, 5);  -- Irlanda
