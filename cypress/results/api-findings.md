Hallazgos API — echo-serv.tbxnet.com

Endpoints probados: GET /v1/qa/test1 y GET /v1/qa/test2. Cubiertos en: cypress/e2e/api/qa-endpoints.cy.js.

Bug: GET /v1/qa/test2 devuelve 500

Reproducible en todas las llamadas.

Response:

HTTP/1.1 500
Content-Type: application/json

{
  "code": "SYS-ERR",
  "message": "An Error",
  "details": "SYSTEM_ERROR",
  "status": 500
}

Reporte completo con la plantilla del equipo en bug_report_test2.docx.

Al menos falla de forma prolija: devuelve JSON bien formado con su Content-Type correcto, no un body vacío ni un error HTML. Eso también quedó cubierto en un test aparte.

Posibles mejoras
El mensaje de error ("An Error" / "SYSTEM_ERROR") no dice nada útil para debuggear. Estaría bueno un mensaje más específico o un request_id para rastrear el error en logs del servidor.
El campo status dentro del body es redundante con el status code HTTP real — no está mal, pero es un dato de más que puede desincronizarse.
Ningún endpoint devuelve headers de cache (Cache-Control). En test1 tiene sentido porque el date cambia en cada llamada (lo confirmamos con el test), pero declararlo explícito evitaría que algún proxy/CDN lo cachee por error.
Lo que sí funciona bien
Ambos endpoints responden bien por debajo de los 3 segundos pedidos.
test1 devuelve siempre { ok: true, date: <timestamp> } con un timestamp fresco en cada llamada (no cacheado, verificado con dos calls seguidas).
Los headers estándar (content-type, content-length, date, etag) están presentes y correctos en ambos casos