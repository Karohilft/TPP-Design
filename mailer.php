<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$name    = trim(strip_tags($_POST['name']    ?? ''));
$email   = trim(strip_tags($_POST['email']   ?? ''));
$phone   = trim(strip_tags($_POST['phone']   ?? ''));
$service = trim(strip_tags($_POST['service'] ?? ''));
$message = trim(strip_tags($_POST['message'] ?? ''));

if (!$name || !$email || !$message || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Pflichtfelder fehlen']);
    exit;
}

$to      = 'office@tpp-design.at';
$subject = '=?UTF-8?B?' . base64_encode('Neue Anfrage: ' . $name) . '?=';

$body  = "Neue Anfrage von der Website:\n\n";
$body .= "Name:      $name\n";
$body .= "E-Mail:    $email\n";
if ($phone)   $body .= "Telefon:   $phone\n";
if ($service) $body .= "Leistung:  $service\n";
$body .= "\nNachricht:\n$message\n";
$body .= "\n---\nGesendet über das Kontaktformular auf tpp-design.at";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: TPP Design <office@tpp-design.at>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// -f sets the envelope sender (required on some shared hosting)
$sent = mail($to, $subject, $body, $headers, '-f office@tpp-design.at');

echo json_encode(['ok' => (bool)$sent]);
