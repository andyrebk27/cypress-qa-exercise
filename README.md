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
