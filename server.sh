#!/usr/bin/zsh
sudo systemctl start mysqld
php -S 0.0.0.0:1337 -d open_basedir=none -d display_errors=On router.php
