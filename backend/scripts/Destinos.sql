--Orden de ejecucion: Destinos → Ciudades → Idiomas → Servicios → Cursos → curso_servicio

-- Insertar destinos principales
INSERT INTO destino (nombre, descripcion, ubicacion, imageUrl) 
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