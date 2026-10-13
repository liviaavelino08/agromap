CREATE DATABASE IF NOT EXISTS agromap_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agromap_db;

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(30) DEFAULT 'produtor',
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Propriedade (
    id_propriedade INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    localizacao VARCHAR(255),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    area_total DECIMAL(12,2),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,

    CONSTRAINT fk_propriedade_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES Usuario(id_usuario)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Talhao (
    id_talhao INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    area DECIMAL(12,2),
    tipo_solo VARCHAR(100),
    id_propriedade INT NOT NULL,

    CONSTRAINT fk_talhao_propriedade
    FOREIGN KEY (id_propriedade)
    REFERENCES Propriedade(id_propriedade)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Cultura (
    id_cultura INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    ciclo_medio INT,
    unidade_producao VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Plantio (
    id_plantio INT AUTO_INCREMENT PRIMARY KEY,
    data_plantio DATE,
    data_prevista_colheita DATE,
    area_plantada DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'Planejado',
    id_talhao INT NOT NULL,
    id_cultura INT NOT NULL,

    CONSTRAINT fk_plantio_talhao
    FOREIGN KEY (id_talhao)
    REFERENCES Talhao(id_talhao)
    ON DELETE CASCADE,

    CONSTRAINT fk_plantio_cultura
    FOREIGN KEY (id_cultura)
    REFERENCES Cultura(id_cultura)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Dados_Climaticos (
    id_dado_climatico INT AUTO_INCREMENT PRIMARY KEY,
    data_coleta DATE NOT NULL,
    temperatura_media DECIMAL(8,2),
    precipitacao DECIMAL(10,2),
    umidade_media DECIMAL(8,2),
    vento_medio DECIMAL(8,2),
    fonte VARCHAR(100),
    id_talhao INT NOT NULL,

    CONSTRAINT fk_clima_talhao
    FOREIGN KEY (id_talhao)
    REFERENCES Talhao(id_talhao)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Previsao (
    id_previsao INT AUTO_INCREMENT PRIMARY KEY,
    data_previsao DATETIME DEFAULT CURRENT_TIMESTAMP,
    producao_esperada DECIMAL(12,2),
    cenario VARCHAR(100),
    confianca DECIMAL(5,2),
    modelo_utilizado VARCHAR(100),
    id_plantio INT NOT NULL,

    CONSTRAINT fk_previsao_plantio
    FOREIGN KEY (id_plantio)
    REFERENCES Plantio(id_plantio)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Previsao_Dados_Climaticos (
    id_previsao INT NOT NULL,
    id_dado_climatico INT NOT NULL,

    PRIMARY KEY (id_previsao, id_dado_climatico),

    CONSTRAINT fk_pdc_previsao
    FOREIGN KEY (id_previsao)
    REFERENCES Previsao(id_previsao)
    ON DELETE CASCADE,

    CONSTRAINT fk_pdc_clima
    FOREIGN KEY (id_dado_climatico)
    REFERENCES Dados_Climaticos(id_dado_climatico)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Perdas (
    id_perda INT AUTO_INCREMENT PRIMARY KEY,
    data_registro DATE NOT NULL,
    tipo_perda VARCHAR(100),
    causa VARCHAR(255),
    quantidade_perdida DECIMAL(12,2),
    observacoes TEXT,
    id_talhao INT NOT NULL,

    CONSTRAINT fk_perda_talhao
    FOREIGN KEY (id_talhao)
    REFERENCES Talhao(id_talhao)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Calendario_Agricola (
    id_calendario INT AUTO_INCREMENT PRIMARY KEY,
    regiao VARCHAR(100),
    mes_plantio_inicio INT,
    mes_plantio_fim INT,
    mes_colheita_inicio INT,
    mes_colheita_fim INT,
    id_cultura INT NOT NULL,

    CONSTRAINT fk_calendario_cultura
    FOREIGN KEY (id_cultura)
    REFERENCES Cultura(id_cultura)
    ON DELETE CASCADE
);

INSERT INTO Cultura
(nome, descricao, ciclo_medio, unidade_producao)
VALUES
('Soja', 'Cultura de grande importância na produção agrícola.', 120, 'sacas'),
('Milho', 'Cultura utilizada para alimentação humana e animal.', 120, 'sacas'),
('Feijão', 'Cultura alimentar de ciclo relativamente curto.', 90, 'sacas'),
('Café', 'Cultura agrícola de produção permanente.', 240, 'sacas');

INSERT INTO Calendario_Agricola
(regiao, mes_plantio_inicio, mes_plantio_fim,
 mes_colheita_inicio, mes_colheita_fim, id_cultura)
SELECT 'Sudeste', 10, 12, 2, 5, id_cultura
FROM Cultura
WHERE nome = 'Soja'
LIMIT 1;

INSERT INTO Calendario_Agricola
(regiao, mes_plantio_inicio, mes_plantio_fim,
 mes_colheita_inicio, mes_colheita_fim, id_cultura)
SELECT 'Sudeste', 9, 12, 1, 4, id_cultura
FROM Cultura
WHERE nome = 'Milho'
LIMIT 1;