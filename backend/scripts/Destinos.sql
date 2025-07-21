--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_servicio

-- Insertar destinos principales
INSERT INTO destino (nombre, descripcion, ubicacion, imageUrl) 
VALUES 
('Canadá', 'País de paisajes naturales y ciudades cosmopolitas', 'América del Norte', 'https://ejemplo.com/canada.jpg'),
('Malta', 'Isla mediterránea con playas paradisíacas', 'Mediterráneo', 'https://ejemplo.com/malta.jpg'),
('Inglaterra', 'Cuna del idioma inglés con rica historia', 'Europa Occidental', 'https://ejemplo.com/inglaterra.jpg'),
('Francia', 'Destino cultural y gastronómico por excelencia', 'Europa Occidental', 'https://ejemplo.com/francia.jpg');