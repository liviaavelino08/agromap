
<?php
$host = "localhost";
$banco = "NOME_DO_SEU_BANCO";
$usuario = "SEU_USUARIO";
$senha = "SUA_SENHA";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    header("Content-Type: application/json; charset=utf-8");

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Não foi possível conectar ao banco de dados."
    ]);

    exit;
}
