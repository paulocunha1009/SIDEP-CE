-- SIDEP-CE - Regionais administrativas iniciais

insert into regional (codigo, nome, tipo) values
('SEFOR-1', 'Superintendência das Escolas Estaduais de Fortaleza 1', 'SEFOR'),
('SEFOR-2', 'Superintendência das Escolas Estaduais de Fortaleza 2', 'SEFOR'),
('SEFOR-3', 'Superintendência das Escolas Estaduais de Fortaleza 3', 'SEFOR'),
('CREDE-1', 'Coordenadoria Regional de Desenvolvimento da Educação 1', 'CREDE'),
('CREDE-2', 'Coordenadoria Regional de Desenvolvimento da Educação 2', 'CREDE'),
('CREDE-3', 'Coordenadoria Regional de Desenvolvimento da Educação 3', 'CREDE'),
('CREDE-4', 'Coordenadoria Regional de Desenvolvimento da Educação 4', 'CREDE'),
('CREDE-5', 'Coordenadoria Regional de Desenvolvimento da Educação 5', 'CREDE'),
('CREDE-6', 'Coordenadoria Regional de Desenvolvimento da Educação 6', 'CREDE'),
('CREDE-7', 'Coordenadoria Regional de Desenvolvimento da Educação 7', 'CREDE'),
('CREDE-8', 'Coordenadoria Regional de Desenvolvimento da Educação 8', 'CREDE'),
('CREDE-9', 'Coordenadoria Regional de Desenvolvimento da Educação 9', 'CREDE'),
('CREDE-10', 'Coordenadoria Regional de Desenvolvimento da Educação 10', 'CREDE'),
('CREDE-11', 'Coordenadoria Regional de Desenvolvimento da Educação 11', 'CREDE'),
('CREDE-12', 'Coordenadoria Regional de Desenvolvimento da Educação 12', 'CREDE'),
('CREDE-13', 'Coordenadoria Regional de Desenvolvimento da Educação 13', 'CREDE'),
('CREDE-14', 'Coordenadoria Regional de Desenvolvimento da Educação 14', 'CREDE'),
('CREDE-15', 'Coordenadoria Regional de Desenvolvimento da Educação 15', 'CREDE'),
('CREDE-16', 'Coordenadoria Regional de Desenvolvimento da Educação 16', 'CREDE'),
('CREDE-17', 'Coordenadoria Regional de Desenvolvimento da Educação 17', 'CREDE'),
('CREDE-18', 'Coordenadoria Regional de Desenvolvimento da Educação 18', 'CREDE'),
('CREDE-19', 'Coordenadoria Regional de Desenvolvimento da Educação 19', 'CREDE'),
('CREDE-20', 'Coordenadoria Regional de Desenvolvimento da Educação 20', 'CREDE')
on conflict (codigo) do nothing;
