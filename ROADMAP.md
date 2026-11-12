# STC Logistics · Roadmap operativa

Aggiornamento del 12 novembre 2026. Lo scopo della prima consegna è riprodurre la web app GitHub e usare la stessa interfaccia per collegare preventivi, clienti, attività e operatori.

## Punto di partenza verificato

- [x] Individuata la base web su `main` al commit `45b6afe`. Sono presenti l’interfaccia responsive, l’accesso, il cruscotto, la gestione utenti e il calcolo preventivi.
- [x] Individuato il ramo `codex/archivio-listino-sqlite` con il generatore, i test e il workflow per il listino. [Specifiche del listino](LISTINO_PREZZI.md)
- [ ] Riconciliare l’ultima versione del listino commerciale con il contenuto del repository. Il generatore attuale riproduce le tariffe già presenti. La documentazione segnala modifiche locali ai prezzi che possono prevalere sul listino di base.

## Piano di rilascio

Una riga è completata quando il referente registra nella colonna Evidenza il commit o la PR e l’esito della prova indicata. Le dipendenze stabiliscono l’ordine di integrazione.

| ID | Stato | Referente | Consegna e prova di accettazione | Dipende da | Evidenza |
| --- | --- | --- | --- | --- | --- |
| 01 | Da verificare | Frontend e QA | Pubblicare la copia fedele. Confrontare accesso, menu, preventivo campione e tabella prezzi con il medesimo commit su desktop e mobile. | Base GitHub | — |
| 02 | Da fare | Dati e tariffe | Confrontare file aggiornato e tariffe per zona, fascia, unità e supplemento. Registrare scostamenti e validità. Rigenerare SQLite e verificare importi e arrotondamenti sul preventivo campione. | File commerciale identificato | — |
| 03 | Da definire | Tariffe e magazzino | Distinguere carico, scarico e deposito per notte. Confermare importi, unità e regola di conteggio delle notti. Collaudare quantità diverse, ritiro parziale e attraversamento di mezzanotte. | Conferma commerciale | — |
| 04 | Da fare | Backend e CRM | Collegare utenti, clienti, sedi, documenti e attività mediante identificativi persistenti. Verificare da due sessioni che i dati condivisi siano coerenti e che ciascun ruolo veda solo le operazioni consentite. | 01 | — |
| 05 | Da fare | CRM e tariffe | Collegare committente, partita IVA, contatti, indirizzi e condizioni con decorrenza. Stabilire su quali voci applicare sconto o rincaro. Verificare i due casi e conservare le condizioni del preventivo già accettato. | 02, 04 | — |
| 06 | Da fare | Operazioni | Collegare una scheda operatore all’utente e assegnarla a un’attività. Un preventivo accettato genera l’attività collegata una sola volta anche dopo un nuovo invio. | 04, 05 | — |
| 07 | Da fare | Documenti e integrazioni | Importare le bolle/DDT distinguendo committente e luogo di scarico. Collegare documento, pesi, volumi e quantità all’attività. Un reinvio non duplica il lavoro e i dati incompleti arrivano in revisione. | 04, 06 | — |
| 08 | Da fare | Operazioni e frontend | Mostrare in calendario data, orario, cliente, operatore e stato. Ripianificare un’attività e verificare l’aggiornamento per l’operatore. Raccogliere le attività prive di data in una vista da pianificare. | 06, 07 | — |
| 09 | Da fare | PM e QA | Eseguire due spedizioni campione, una da preventivo e una da DDT. Controllare tariffa cliente, voci bancale, assegnazione, calendario e tracciabilità fino alla fonte. | 03, 05–08 | — |

## Come mantenere aggiornata la roadmap

Il responsabile di ogni modifica indica l’ID nella PR, aggiorna lo stato, registra la prova e collega la PR o il commit nella stessa modifica. Il PM verifica l’esito prima di segnare la riga come completata. Per un blocco, indicare il dato o la decisione necessaria e chi può fornirla.
