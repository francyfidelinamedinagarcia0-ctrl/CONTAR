CONTAR S.A.S. — PARALLAX FINAL CON CAPAS ALINEADAS

Esta versión corrige el problema de desenfoque:
- La portada NO utiliza la captura borrosa como fondo.
- Se utilizan directamente los PNG recortados enviados para la composición.
- Todos los PNG de la portada tienen 1920x1080 y están alineados.
- Se apilan en la misma posición para reconstruir la portada.
- El Parallax es sutil y fluido: cada capa se mueve unos pocos píxeles según scroll y mouse.
- letra.png (mitad superior) y letra-2.png (mitad inferior) se recortan con clip-path para formar 6 capas sin superponer texto:, porque son copias exactas y superponerlas produciría texto borroso.
- "letra-2.png" se conserva en img como recurso original entregado.
- La sección "Nuestro Equipo" utiliza la foto de la oficina como fondo con un Parallax independiente y suave.
- No aparece ningún texto de "primer plano", "plano medio" o similar.

Archivos principales:
index.html
css/main.css
js/main.js
img/oficina1.png
img/oficina2.png
img/letra.png
img/letra-2.png
img/abajo-1.png
img/abajo2.png
