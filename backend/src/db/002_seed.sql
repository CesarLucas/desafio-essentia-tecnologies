INSERT INTO status (id, nome) VALUES
(1, 'Concluído'),
(2, 'Em andamento'),
(3, 'Não iniciada')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);
