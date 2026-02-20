INSERT INTO status (id, nome) VALUES
(1, 'Concluido'),
(2, 'Em andamento'),
(3, 'Nao iniciada'),
(4, 'Cancelado')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);
