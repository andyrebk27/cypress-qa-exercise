# Automation Exercise + QA API — Cypress Tests

Suite de pruebas con Cypress para dos partes:

1. **UI**: registro de usuario y flujo de login en [automationexercise.com](https://automationexercise.com/).
2. **API**: dos endpoints de [echo-serv.tbxnet.com](https://echo-serv.tbxnet.com) (`/v1/qa/test1` y `/v1/qa/test2`).

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

La primera vez que instalás, Cypress descarga su binario (~150-300 MB) desde `download.cypress.io`. Si estás detrás de una red restringida y falla, corré `npm install` desde una red sin restricciones.

## Cómo correr las pruebas

```bash
# Abrir el runner interactivo de Cypress (recomendado para ver los tests correr)
npm run cypress:open

# Correr todo en modo headless (CI-style)
npm run cypress:run

# Correr solo las pruebas de UI
npm run test:ui

# Correr solo las pruebas de API
npm run test:api
```

## Estructura del proyecto

```
cypress/
  e2e/
    ui/
      registration.cy.js   # Registro de usuario nuevo
      login.cy.js           # Login (válido, password incorrecto, email no registrado)
    api/
      qa-endpoints.cy.js    # Tests para /v1/qa/test1 y /v1/qa/test2
  support/
    commands.js             # Comandos custom: generateTestUser, fillAccountInformationForm
    e2e.js                  # Config global de soporte
cypress.config.js
```

## Parte 1 — Pruebas de UI

### Registro de usuario (`registration.cy.js`)

Sigue el Test Case #1 documentado por el propio sitio (automationexercise.com/test_cases):

1. Visita la home y va a "Signup / Login".
2. Completa nombre + email en el formulario de signup.
3. Completa el formulario de "ENTER ACCOUNT INFORMATION" (datos personales y de dirección).
4. Verifica el mensaje "Account Created!".
5. Verifica que quede logueado como el usuario recién creado.
6. Limpia el dato de prueba borrando la cuenta al final, para que el test se pueda re-correr sin chocar con "email ya existe".

Incluye además un segundo caso: intentar registrarse con un email ya existente y verificar el mensaje de error correspondiente.

Cada corrida genera un usuario con email único (basado en timestamp), así que el test es repetible sin intervención manual.

### Login (`login.cy.js`)

Como el sitio no expone una cuenta de prueba fija y pública, el test crea una cuenta propia en el `before()` (y la borra en el `after()`), y contra esa cuenta valida:

- Login exitoso con email y password correctos.
- Error al loguearse con password incorrecto.
- Error al loguearse con un email no registrado.

En ambos casos se verifica el mensaje "Your email or password is incorrect!".

## Parte 2 — Pruebas de API

Se eligieron `GET /v1/qa/test1` y `GET /v1/qa/test2`.

### `test1` — camino feliz

- Verifica status `200`.
- Verifica `content-type: application/json`.
- Verifica que el body tenga `{ ok: true, date: <ISO 8601> }`.
- Verifica que `date` sea una fecha válida y cercana al momento actual (dentro de 5 minutos).
- Verifica que el tiempo de respuesta esté por debajo de 2000 ms.
- Test adicional: dos llamadas consecutivas devuelven timestamps distintos (no está cacheado/estático).

### `test2` — bug conocido

Al momento de escribir esta suite, este endpoint devuelve **500 Internal Server Error** en vez de una respuesta exitosa (bug documentado por separado en `bug_report_test2.docx`, generado a partir de la plantilla `bugreport.md` del equipo).

El test está escrito para **documentar el comportamiento actual** (falla con 500) en vez de fallar el suite completo — es un test de regresión: el día que el bug se arregle, este test empezará a fallar, lo cual es la señal para reemplazarlo por las mismas validaciones que se le hacen a `test1`.

## Notas y limitaciones conocidas

- Los selectores de UI usan los atributos `data-qa` que expone automationexercise.com específicamente para automatización; si el sitio cambia su markup, estos selectores tendrían que revisarse.
- El ambiente donde se armó este proyecto no tenía salida a internet, por lo que las pruebas se escribieron y se validó su sintaxis, pero no se ejecutaron end-to-end contra los sitios reales. Se recomienda correr `npm run cypress:open` localmente antes de dar la suite por definitiva, para confirmar que los selectores siguen vigentes.
- El umbral de tiempo de respuesta (2000 ms) es arbitrario, pensado como un límite razonable para un endpoint de prueba tipo "echo"; se puede ajustar según el SLA real que se quiera validar.
