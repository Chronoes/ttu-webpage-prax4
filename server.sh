#!/usr/bin/zsh
php -S localhost:1337 -d open_basedir=none -d display_errors=On router.php
