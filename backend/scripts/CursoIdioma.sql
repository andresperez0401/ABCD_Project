-- Orden de ejecución: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_destino → curso_idioma → curso_servicio

-- Relaciones Curso-Idioma (muchos a muchos)
-- Cursos con sus idiomas disponibles

-- Curso 1: Inglés General - Inglés
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (1, 1);

-- Curso 2: Francés Intensivo - Francés
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (2, 2);

-- Curso 3: Alemán para Negocios - Alemán
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (3, 3);

-- Curso 4: Inglés + Trabajo - Inglés
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (4, 1);

-- Curso 5: Preparación Cambridge - Inglés
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (5, 1);

-- Curso 6: Campamento de Verano - Inglés y Francés (curso multiidioma)
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (6, 1);
INSERT INTO curso_idioma (curso_id, idioma_id) VALUES (6, 2);
