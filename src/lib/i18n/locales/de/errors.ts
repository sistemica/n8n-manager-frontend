export default {
  status: {
    400: 'Ungültige Anfragedaten',
    401: 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.',
    403: 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.',
    404: 'Ressource nicht gefunden. Bitte überprüfen Sie die URL.',
    500: 'Serverfehler aufgetreten. Bitte versuchen Sie es später erneut.',
    502: 'Bad Gateway. Der Server könnte offline sein.',
    503: 'Service nicht verfügbar. Der Server könnte überlastet sein.',
    504: 'Gateway-Timeout. Der Server antwortet nicht.',
  },
  network: {
    offline: 'Sie scheinen offline zu sein. Bitte überprüfen Sie Ihre Internetverbindung.',
    timeout: 'Zeitüberschreitung der Anfrage. Bitte versuchen Sie es erneut.',
  },
  connection: {
    refused: 'Verbindung verweigert. Der Server könnte offline oder nicht erreichbar sein.',
    timeout: 'Zeitüberschreitung der Verbindung. Der Server antwortet nicht.',
    hostNotFound: 'Host nicht gefunden. Bitte überprüfen Sie die URL.',
  },
  ssl: {
    certExpired: 'SSL-Zertifikat ist abgelaufen.',
    certInvalid: 'Ungültiges SSL-Zertifikat. Erwägen Sie "SSL ignorieren" zu aktivieren.',
    selfSigned: 'Selbstsigniertes Zertifikat erkannt. Erwägen Sie "SSL ignorieren" zu aktivieren.',
  },
  validation: {
    generic: 'Validierungsfehler: {{error}}',
  },
  server: {
    generic: 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
  },
  unexpected: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  default: 'Verbindung fehlgeschlagen. Bitte überprüfen Sie die Konfiguration.',
};