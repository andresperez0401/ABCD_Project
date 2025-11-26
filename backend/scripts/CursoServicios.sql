--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_destino → curso_servicio

-- Asociar servicios al curso "Inglés Intensivo" (ID curso=1)
INSERT INTO curso_servicio (curso_id, servicio_id) 
VALUES 
(1, 1),  -- Alojamiento en residencia
(1, 3),  -- Seguro médico
(1, 4),  -- Traslados aeropuerto
(1, 5);  -- Actividades culturales

-- Asociar servicios al curso "Francés Turístico" (ID curso=3)
INSERT INTO curso_servicio (curso_id, servicio_id) 
VALUES 
(3, 2),  -- Alojamiento en familia
(3, 5);  -- Actividades culturales