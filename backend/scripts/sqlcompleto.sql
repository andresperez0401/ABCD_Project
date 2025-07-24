INSERT INTO destino (nombre, descripcion, ubicacion, "imageUrl") 
VALUES 
('Canadá', 'País de paisajes naturales y ciudades cosmopolitas', 'América del Norte', 'https://plus.unsplash.com/premium_photo-1694475393287-88027e0fbde4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Malta', 'Isla mediterránea con playas paradisíacas', ' Mar Mediterráneo', 'https://plus.unsplash.com/premium_photo-1661963984279-1b0fa1b3ac0d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Inglaterra', 'Cuna del idioma inglés con rica historia', 'Europa Occidental', 'https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Usa', 'País diverso con oportunidades educativas y culturales', 'América del Norte', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Irlanda', 'Isla verde con rica cultura y paisajes impresionantes', 'Europa Occidental', 'https://images.unsplash.com/photo-1549918864-48ac978761a4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Australia', 'País de paisajes diversos y cultura vibrante', 'Oceanía', 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1530&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Nueva Zelanda', 'Isla con paisajes naturales impresionantes y cultura maorí', 'Oceanía', 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Sudáfrica', 'País con diversidad cultural y paisajes únicos', 'África', 'https://plus.unsplash.com/premium_photo-1697730061063-ad499e343f26?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Emiratos Arabes Unidos', 'País de lujo y modernidad en el desierto, Disfruta de Dubai, en este increible país.', 'Asia Occidental', 'https://images.unsplash.com/flagged/photo-1559717865-a99cac1c95d8?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');



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



INSERT INTO idioma (nombre, descripcion) 
VALUES 
('Inglés', 'Idioma global para negocios y comunicación internacional'),
('Francés', 'Lengua romance hablada en 5 continentes'),
('Alemán', 'Importante idioma para ingeniería y tecnología');

--Ingles 1, Frances 2, Aleman 3



INSERT INTO servicio (nombre, descripcion, precio, "imageUrl") 
VALUES 
('Alojamiento en residencia', 'Habitación compartida en campus universitario', '1200.00', 'https://images.unsplash.com/photo-1647543348749-64f7131faaff?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Alojamiento en familia', 'Inmersión cultural con familia local', '950.00', 'https://images.unsplash.com/photo-1567428485548-c499e4931c10?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Seguro médico', 'Cobertura médica completa durante la estancia', '150.00', 'https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Traslados y recogida en el aeropuerto', 'Transporte privado ida y vuelta', '80.00', 'https://plus.unsplash.com/premium_photo-1661501562127-a8bb26defb35?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Actividades culturales', 'Excursiones y visitas guiadas semanales', '200.00', 'https://plus.unsplash.com/premium_photo-1716866636854-7cae06b7e437?q=80&w=1495&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');




-- Cursos en Canadá (ID destino=1) para Inglés (ID idioma=1)
INSERT INTO curso (nombre, descripcion, duracion, nivel, "tipoCurso" , edades, destino_id, idioma_id, "imageUrl") 
VALUES 
('Inglés Intensivo', 'Curso acelerado de 30 horas semanales', '4 semanas', 'Intermedio', 'Intensivo', '12-25', 1, 1, 'https://plus.unsplash.com/premium_photo-1681248156366-d54ce5840c61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Inglés Académico', 'Preparación para estudios universitarios', '12 semanas', 'Avanzado', 'Académico', '12+', 1, 1, 'https://images.unsplash.com/photo-1646579886135-068c73800308?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- Cursos en Malta (ID destino=2) para Ingles (ID idioma=1)
INSERT INTO curso (nombre, descripcion, duracion, nivel, "tipoCurso" , edades, destino_id, idioma_id, "imageUrl")  
VALUES 
('Ingles Turístico en Malta', 'Enfoque en comunicación para viajes', '2 semanas', 'Básico', 'Vacacional', '12+', 2, 1, 'https://images.unsplash.com/photo-1522307617379-e982f8754d27?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--Inglaterra
INSERT INTO curso (nombre, descripcion, duracion, nivel, "tipoCurso" , edades, destino_id, idioma_id, "imageUrl") 
VALUES 
('Estudia Inglés en Inglaterra!', 'Multinivel', '2-8 Semanas', 'Básico, Intermedio, Avanzado', 'Vacacional', '12+', 3, 1, 'https://images.unsplash.com/photo-1617160105398-3cc2cade5cd7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--USA
INSERT INTO curso (nombre, descripcion, duracion, nivel, "tipoCurso" , edades, destino_id, idioma_id, "imageUrl") 
VALUES
('Inglés General en USA', 'Curso de inglés para todos los niveles, en tu ciudad favorita', '3-9 semanas', 'Básico, Intermedio, Avanzado', 'General', '12+', 4, 1, 'https://images.unsplash.com/photo-1515861209048-dae6a1e1ed56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

--Irlanda
INSERT INTO curso (nombre, descripcion, duracion, nivel, "tipoCurso" , edades, destino_id, idioma_id, "imageUrl") 
VALUES
('Inglés en Irlanda', 'Descubre la increible ciudad de Dublin', '3-9 semanas', 'Intermedio, Avanzado', 'General', '12+', 5, 1, 'https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');



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



--Testimonios
INSERT INTO testimonio (nombre, mensaje, "videoUrl")
VALUES (
  'Joanmari Vega',
  '"Ellos me cumplieron el sueño de venir a Canadá a estudiar inglés"',
  'https://youtu.be/IiRKll13wDg?feature=shared'
);

INSERT INTO testimonio (nombre, mensaje, "videoUrl")
VALUES (
  'Mirasi Álvarez',
  '"Me acompañaron en todo el proceso de mi visa y mi curso de inglés desde el primer día"',
  'https://youtu.be/273fi1iyZFY?feature=shared'
);


INSERT INTO testimonio (nombre, mensaje, "videoUrl")
VALUES (
  'Wilfredo Herrera',
  '"Me atendieron de la mejor manera desde el principio"',
  'https://youtu.be/fn8a1LKh32c?feature=shared'
);   

INSERT INTO testimonio (nombre, mensaje, "videoUrl")
VALUES (
  'Rina Moncayo',
  '"Estoy super agradecida con el trato y responsabilidad que me dieron en ABCD Languages"',
  'https://youtu.be/KUh-i7NWwyA?feature=shared'
);