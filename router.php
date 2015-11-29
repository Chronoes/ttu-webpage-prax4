<?php
if (strpos($_SERVER['REQUEST_URI'], '/api') !== false) {
    return false;
} else {
    $extension = explode('.', $_SERVER['REQUEST_URI']);
    switch (end($extension)) {
    case 'css':
        header('Content-Type: text/css');
        break;
    case 'js':
        header('Content-Type: text/javascript');
        break;
    case 'svg':
        header('Content-Type: image/svg+xml');
        break;
    default:
        include_once __DIR__."/prax4/index.html";
        return true;
    }
    include_once __DIR__."/prax4$_SERVER[REQUEST_URI]";
}
?>
