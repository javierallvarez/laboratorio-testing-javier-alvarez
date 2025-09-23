Módulo 05 - Testing
Alumno: Javier Álvarez García

## Laboratorio obligatorio:
- Para el compnente project.mapper.ts he usado Vitest.
- En el caso de confirmation-dialog.component.tsx y confirmation-dialog.hook.ts he optado por testear con Jest.

## Laboratio opcional:
- Usé Vitest para spinner.component.tsx, configurando ci.yml para ajecutarlo con cada pull request en GitHub Actions.
- Instalé Playwright y estamos testeando la scene de login. También se ejecuta en cada pull req, agregé las variables de entorno necesarias en Actions.

## Errores encontrados:
- La ejecución fallaba en CI porque Vitest trataba de ejecutar también el archivo de Playwright, fue un reto averiguar por qué test.describe() no era reconocido, me volvía loco el conflicto.

## Dudas sobre la entrega:
- Debido a que necesitaba comprobar y reparar errores en la ejecucuón de los tests en Actions, hice varias pull req de las ramas a main, por lo que no pude dejar todos los cambios en una PR abierta.
- Tras comprobar que funciona, dejo abierta una PR de la rama /opcional a /obligatorio. Si alguien lo revisa verá que los tests pasan ok en Actions, sin embargo los únicos cambios del commit son texto comentado y este Readme, los cambios anteriores se pueden ver en commits previos. 

Espero que sea correcto, de lo contrario trabajaré en cualquier cambio necesario, muchas gracias de antemano.