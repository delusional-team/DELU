-- Add up migration script here

INSERT INTO study_plan (id, year) VALUES
(1, 2018);

INSERT INTO teachers (id, name, grade, department) VALUES
(1, 'SOBERO RODRÍGUEZ, FANY YEXENIA', 0, 'Ing. de Software'),
(2, 'ARREDONDO CASTILLO, GUSTAVO', 0, 'Ing. de Software'),
(3, 'MENÉNDEZ MUERAS, ROSA', 0, 'Ing. de Software'),
(4, 'CHÁVEZ HERRERA, CARLOS ERNESTO', 0, 'Ing. de Software'),
(5, 'WONG PORTILLO, LENIS ROSSI', 0, 'Ing. de Software'),
(6, 'VALCARCEL ASCENCIOS, SERGIO PAULO', 0, 'Ing. de Software'),
(7, 'TICONA ZEGARRA, EDSON ARIEL', 0, 'Ing. de Software'),
(8, 'ESCOBEDO BAILON, FRANK', 0, 'Ing. de Sistemas');

INSERT INTO public.courses (id, code, name, semester, study_plan_id, description) VALUES
(1, '202W0601', 'Aseguramiento De La Calidad Del Software', 6, 1, NULL),
(2, '202W0602', 'Base De Datos I', 6, 1, NULL),
(3, '202W0603', 'Diseño De Software', 6, 1, NULL),
(4, '202W0604', 'Formación De Empresas De Software', 6, 1, NULL),
(5, '202W0605', 'Gestión De La Configuración Del Software', 6, 1, NULL),
(6, '202W0606', 'Interacción Hombre Computador', 6, 1, NULL),
(7, '202W0607', 'Sistemas Operativos', 6, 1, NULL),
(8, '202W0501', 'Análisis Y Diseño De Algoritmos', 5, 1, NULL),
(9, '202W0502', 'Arquitectura De Computadoras', 5, 1, NULL),
(10, '202W0503', 'Calidad De Software', 5, 1, NULL),
(11, '202W0504', 'Computación Visual', 5, 1, NULL),
(12, '202W0505', 'Estructura De Datos', 5, 1, NULL),
(13, '202W0506', 'Economía Para La Gestión', 5, 1, NULL),
(14, '202W0507', 'Ingeniería De Requisitos', 5, 1, NULL);

INSERT INTO public.teachers_courses (profesor_id, cursos_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(8, 4),
(5, 5),
(6, 6),
(7, 7);
