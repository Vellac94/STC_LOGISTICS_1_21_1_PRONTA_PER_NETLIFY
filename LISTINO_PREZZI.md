# Listino prezzi STC Logistics

La fonte dei prezzi di base è il file tabellare tariffs.json.
Il generatore lo controlla, crea l'archivio SQLite e da SQLite ricava i dati
della tabella già presente nel gestionale. Non serve un server SQLite nel browser.

Il primo contenuto riproduce i prezzi esistenti nel repository.
I nuovi file del fornitore non sono ancora stati ricevuti: nessun nuovo prezzo
è stato ricostruito o ipotizzato. Prima di importarli vanno verificate fasce,
unità di misura, validità, clienti e supplementi.

## Come si aggiorna

1. Si confrontano i file originali con prezzi e condizioni attuali.
2. Si aggiornano le righe verificate di tariffs.json.
3. Dopo il salvataggio su main, GitHub controlla e genera automaticamente
   l'archivio SQLite e aggiorna la dichiarazione prezzi in app.js.
4. Il risultato SQLite è scaricabile dall'esecuzione Actions,
   artefatto listino-sqlite. I file del sito si pubblicano con il processo
   di distribuzione già in uso. Questo workflow non configura Netlify o Pages.

Per eseguire la generazione a mano con Python 3.10 o successivo:

    python -m unittest discover -s tests -v
    python tools/build_tariffs.py
    node tests/tariff-calculations.cjs

Il database viene generato in build/listino.sqlite.
Non modificare contemporaneamente tariffs.json e la dichiarazione TARIFFS in app.js:
il secondo viene generato dal primo tramite SQLite.

## Struttura SQLite

| Tabella | Contenuto |
| --- | --- |
| zones | Regione, zona, ordine di visualizzazione, supplemento |
| bands | Le sette fasce già utilizzate dal calcolatore |
| rates | Un prezzo in centesimi per zona e fascia |
| aliases | Nomi alternativi espliciti delle zone |
| metadata | Unità di misura, valuta e impronta della fonte |
| tariff_table (vista) | Tabella unica leggibile e interrogabile |

Esempio di lettura:

    SELECT region, zone, lower_q, upper_q, mode, cents, supplement_cents
    FROM tariff_table
    WHERE region = 'VENETO' AND zone = 'VR'
    ORDER BY band_index;

Il minimo fino a 3 quintali è un importo fisso. Le altre sei fasce sono prezzi
per quintale. Un quintale corrisponde a 100 kg. Il calcolatore mantiene
l'arrotondamento e le regole attuali; oltre 50 quintali richiede quotazione manuale.

Gli importi sono centesimi interi: 2985 significa 29,85 euro.
Dati incompleti, importi negativi, decimali nei centesimi, zone duplicate,
alias ambigui e campi sconosciuti bloccano la generazione.

## Modifiche salvate nei dispositivi

Le modifiche locali dei prezzi fatte dall'amministratore continuano ad avere
precedenza sul listino di base. Non sono sincronizzate con SQLite o con altri
dispositivi. Anche preventivi e copie storiche dei prezzi restano nel loro archivio.

Questa versione copre le sette fasce e il supplemento fisso già supportati.
Un listino con altre fasce, prezzi a pallet, condizioni cliente o scadenze richiede
prima una mappatura esplicita; non viene convertito forzatamente nelle sette fasce.
