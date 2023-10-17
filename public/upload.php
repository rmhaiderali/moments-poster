<?php
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Headers: *");

error_reporting(0);
$max_size = 5 * 1024 ** 2;

function json_encoder($message)
{
  return json_encode($message, JSON_UNESCAPED_SLASHES);
}

function send($message, $code = 200, $exit = true)
{
  http_response_code($code);
  header("Content-Type: application/json");
  echo json_encoder($message);
  if ($exit) exit();
}


if ($_SERVER["REQUEST_METHOD"] !== "POST")
  send(["error" => "This API only supports POST Method."]);

$data = file_get_contents("php://input");

if ($_SERVER["CONTENT_TYPE"] == "text/url") {
  if (filter_var($data, FILTER_VALIDATE_URL) === false)
    send(["error" => "Provided URL is not valid."], 400);

  $context = stream_context_create(["http" => ["timeout" => 5]]);
  $data = file_get_contents($data, false, $context, 0, $max_size + 1);

  // error_get_last()["message"]
  if ($data === false)
    send(["error" => "Unable to fetch Image from provided URL."], 500);
}

$size = strlen($data);
$type = explode("/", finfo_buffer(finfo_open(FILEINFO_MIME_TYPE), $data))[1];

if ($size > $max_size)
  send(["error" => "Image file size should not exceed 5MB."], 400);

if ($size == 0)
  send(["error" => "Unable to locate Image data."], 400);

if (!in_array($type, ["jpeg", "png"]))
  send(["error" => "Only JPEG and PNG files are allowed."], 400);

$random = sprintf("%04x", mt_rand(0, 65535));
$name = time() . "_" . $random . "." . $type;
file_put_contents("images/" . $name, $data);

// require_once("report.php");
// report($name);

send(["file" => $name]);
