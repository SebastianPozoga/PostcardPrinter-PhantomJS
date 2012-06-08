<?php

//ini_set('display_errors', 1);
//ini_set('log_errors', 1);
//error_reporting(E_ALL);

//Validate
$title = htmlspecialchars($_POST['title']);
$content = strip_tags($_POST['content'], "<br><br/><p><b><i>");
$picture = (int) $_POST['picture'];

//Create data
$data = array();
$data['title'] = $title;
$data['content'] = $content;
$data['picture'] = $picture;
$data['file'] = 'png';

$filename = dirname(__FILE__).'/'.sendPOST('http://localhost:9696', $data);
sleep(1);
if (is_file($filename)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename='.basename($filename));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($filename));
    ob_clean();
    flush();
    readfile($filename);
    unlink($filename);
    exit;
}else{
    unlink($filename);
    exit("File $filename isn't exist");
}

function sendPOST($url, array $data) {
    $options = array('http' => array('method' => 'POST', 'content' => http_build_query($data)));
    $context = stream_context_create($options);
    return file_get_contents($url, false, $context);
}

?>
