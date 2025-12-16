import { TopicContent } from '@/types';

export const speichersystemeContent: TopicContent = {
  topicId: 'speichersysteme',
  flashcards: [
    // ===== RAID GRUNDLAGEN =====
    { id: '1', front: 'Was bedeutet RAID?', back: 'Redundant Array of Independent Disks - Verbund mehrerer Festplatten zur Steigerung von Performance und/oder Ausfallsicherheit' },
    { id: '2', front: 'Was ist JBOD und wie berechnet sich die Kapazität?', back: 'Just a Bunch of Disks - Festplatten ohne RAID zusammengefasst.\n\nFormel: Σ(alle Kapazitäten)\nBeispiel: 2TB + 3TB + 4TB = 9TB\n\nKeine Redundanz!' },
    { id: '3', front: 'Was ist RAID 0 (Striping) und wie berechnet sich die Kapazität?', back: 'Daten werden blockweise auf alle Platten verteilt.\n\nFormel: n × min(Kapazität)\nBeispiel: 4 × 2TB = 8TB\n\n✓ Maximale Performance\n✗ Keine Redundanz - 1 Ausfall = Totalverlust!' },
    { id: '4', front: 'Was ist RAID 1 (Mirroring) und wie berechnet sich die Kapazität?', back: 'Daten werden 1:1 gespiegelt.\n\nFormel: min(Kapazität)\nBeispiel: 2 × 4TB = 4TB nutzbar\n\n✓ Hohe Ausfallsicherheit\n✓ Schnelles Lesen\n✗ 50% Kapazitätsverlust' },
    { id: '5', front: 'Was ist RAID 5 und wie berechnet sich die Kapazität?', back: 'Striping mit verteilter Parität.\n\nFormel: (n-1) × min(Kapazität)\nBeispiel: 5 × 4TB = (5-1) × 4TB = 16TB\n\nMin. 3 Platten, toleriert 1 Ausfall' },
    { id: '6', front: 'Was ist RAID 6 und wie berechnet sich die Kapazität?', back: 'Striping mit doppelter verteilter Parität.\n\nFormel: (n-2) × min(Kapazität)\nBeispiel: 6 × 3TB = (6-2) × 3TB = 12TB\n\nMin. 4 Platten, toleriert 2 Ausfälle' },
    { id: '7', front: 'Was ist RAID 10 (1+0) und wie berechnet sich die Kapazität?', back: 'Erst Mirroring (RAID 1), dann Striping (RAID 0).\n\nFormel: (n/2) × min(Kapazität)\nBeispiel: 8 × 2TB = (8/2) × 2TB = 8TB\n\n✓ Hohe Performance + Ausfallsicherheit\n✗ 50% Kapazitätsverlust' },
    
    // ===== XOR PARITÄT =====
    { id: '8', front: 'Wie funktioniert XOR-Parität bei RAID 5/6?', back: 'XOR (Exklusiv-Oder) Wahrheitstabelle:\n\n0 ⊕ 0 = 0\n0 ⊕ 1 = 1\n1 ⊕ 0 = 1\n1 ⊕ 1 = 0\n\nMerke: Gleich = 0, Ungleich = 1' },
    { id: '9', front: 'Wie rekonstruiert man Daten mit XOR-Parität?', back: 'Beispiel mit 3 Platten:\nA=1, B=0, Parität=1\n\nWenn B ausfällt:\nB = A ⊕ Parität\nB = 1 ⊕ 1 = 0 ✓\n\nDie fehlenden Daten werden durch XOR der verbleibenden Daten + Parität rekonstruiert.' },
    { id: '10', front: 'Berechne: Was ist 1011 XOR 0110?', back: '1011\n0110\n----\n1101\n\nBitweise: 1⊕0=1, 0⊕1=1, 1⊕1=0, 1⊕0=1' },
    
    // ===== SPEICHERSYSTEME DAS/SAN/NAS =====
    { id: '11', front: 'Was ist DAS (Direct Attached Storage)?', back: 'Speicher direkt am Server angeschlossen.\n\n• Schnittstelle: SAS, SATA, USB\n• Max. Kabellänge: ~10m (SAS)\n• Tier: 0-1 (Performance)\n• Zugriff: Nur vom angeschlossenen Server\n\nBeispiel: Interne Festplatten, externe USB-Arrays' },
    { id: '12', front: 'Was ist SAN (Storage Area Network)?', back: 'Dediziertes Hochgeschwindigkeits-Speichernetzwerk.\n\n• Protokoll: Fibre Channel, iSCSI, FCoE\n• Blockbasierter Zugriff\n• Tier: 0-1 (Enterprise)\n• Teuer, aber höchste Performance\n\nFür: Datenbanken, Virtualisierung, kritische Anwendungen' },
    { id: '13', front: 'Was ist NAS (Network Attached Storage)?', back: 'Dateibasierter Speicher über Ethernet.\n\n• Protokoll: SMB/CIFS (Windows), NFS (Linux)\n• Dateibasierter Zugriff\n• Tier: 2-3 (Standard/Archiv)\n• Kostengünstig, einfach einzurichten\n\nFür: Dateifreigaben, Home-Verzeichnisse, Backups' },
    { id: '14', front: 'Vergleiche DAS, SAN und NAS', back: '| Merkmal | DAS | SAN | NAS |\n|---------|-----|-----|-----|\n| Zugriff | Block | Block | Datei |\n| Netzwerk | Direkt | FC/iSCSI | Ethernet |\n| Kosten | Niedrig | Hoch | Mittel |\n| Skalierung | Begrenzt | Sehr gut | Gut |\n| Sharing | Nein | Ja | Ja |' },
    { id: '15', front: 'Was sind Storage Tiers?', back: 'Tier 0: SSD/NVMe - Höchste Performance\nTier 1: SAS 15k/10k - Enterprise HDD\nTier 2: SATA/NL-SAS - Standard\nTier 3: Tape/Cloud - Archiv\n\nDAS/SAN: Tier 0-1\nNAS: Tier 2-3' },
    
    // ===== BACKUP VERFAHREN =====
    { id: '16', front: 'Was ist eine Vollsicherung (Full Backup)?', back: 'ALLE Daten werden komplett gesichert.\n\n✓ Einfachste Wiederherstellung (1 Medium)\n✓ Unabhängig von anderen Backups\n✗ Längste Sicherungszeit\n✗ Größter Speicherbedarf\n\nBasis für differentielle/inkrementelle Sicherungen' },
    { id: '17', front: 'Was ist eine differentielle Sicherung?', back: 'Alle Änderungen seit dem letzten VOLLBACKUP.\n\n✓ Schneller als Vollsicherung\n✓ Wiederherstellung: Voll + 1 Differentiell\n✗ Wächst täglich an\n\nMerke: Immer Bezug zur VOLLSICHERUNG!' },
    { id: '18', front: 'Was ist eine inkrementelle Sicherung?', back: 'Nur Änderungen seit der LETZTEN Sicherung (egal welcher Art).\n\n✓ Schnellste Sicherung\n✓ Geringster Speicherbedarf\n✗ Aufwändigste Wiederherstellung\n✗ Alle Kettenglieder nötig\n\nMerke: Bezug zur LETZTEN Sicherung!' },
    { id: '19', front: 'Unterschied: Differentiell vs. Inkrementell', back: 'DIFFERENTIELL:\n→ Seit letztem VOLLBACKUP\n→ Wiederherstellung: Voll + letztes Diff\n\nINKREMENTELL:\n→ Seit LETZTER Sicherung\n→ Wiederherstellung: Voll + ALLE Inkremente\n\nBeispiel Mo-Fr:\nDiff: Mo 10MB, Di 20MB, Mi 30MB...\nInkr: Mo 10MB, Di 10MB, Mi 10MB...' },
    
    // ===== BACKUP KONZEPTE =====
    { id: '20', front: 'Was ist die 3-2-1-Regel?', back: '3 - Drei Kopien der Daten\n2 - Auf zwei verschiedenen Medientypen\n1 - Eine Kopie extern (Offsite)\n\nBeispiel:\n• Original auf Server\n• Backup auf NAS (lokal)\n• Backup in Cloud (extern)' },
    { id: '21', front: 'Was ist das GFS-Prinzip (Grandfather-Father-Son)?', back: 'Rotationsprinzip für Backup-Medien:\n\nSon (Sohn) = Tägliche Sicherung\nFather (Vater) = Wöchentliche Sicherung\nGrandfather (Großvater) = Monatliche Sicherung\n\nÄltere Generationen werden länger aufbewahrt.' },
    { id: '22', front: 'Was ist RPO (Recovery Point Objective)?', back: 'Maximaler akzeptabler DATENVERLUST in Zeit.\n\n"Wie alt dürfen die Daten maximal sein?"\n\nRPO = 4h → Backup mind. alle 4 Stunden\nRPO = 0 → Synchrone Replikation nötig' },
    { id: '23', front: 'Was ist RTO (Recovery Time Objective)?', back: 'Maximale akzeptable AUSFALLZEIT.\n\n"Wie lange darf die Wiederherstellung dauern?"\n\nRTO = 1h → System muss in 1h wieder laufen\nRTO = 0 → Hochverfügbarkeit (HA) nötig' },
    { id: '24', front: 'Unterschied RPO vs. RTO', back: 'RPO = Datenverlust (Vergangenheit)\n"Wie viel Arbeit geht verloren?"\n\nRTO = Ausfallzeit (Zukunft)\n"Wie lange sind wir offline?"\n\nBeide zusammen definieren die Business Continuity Anforderungen.' },
    
    // ===== HOT-SPARE vs HOT-SWAP =====
    { id: '25', front: 'Was ist ein Hot-Spare?', back: 'Ersatzlaufwerk im RAID-Verbund, das AUTOMATISCH aktiviert wird.\n\n• Steht bereit, wird nicht genutzt\n• Bei Ausfall: Sofortiger Rebuild\n• Keine manuelle Aktion nötig\n• Reduziert Rebuild-Zeit erheblich' },
    { id: '26', front: 'Was ist Hot-Swap?', back: 'MANUELLER Austausch von Festplatten im laufenden Betrieb.\n\n• Wechselrahmen erforderlich\n• System läuft weiter\n• Admin tauscht defekte Platte\n• Rebuild startet nach Einbau' },
    { id: '27', front: 'Unterschied Hot-Spare vs. Hot-Swap', back: 'HOT-SPARE:\n• Automatisch\n• Ersatzplatte bereits eingebaut\n• Sofortiger Rebuild\n• Kostet Platz im Array\n\nHOT-SWAP:\n• Manuell\n• Wechselrahmen-Technologie\n• Admin-Eingriff nötig\n• Flexibler bei Plattengrößen' },
    
    // ===== WEITERE KONZEPTE =====
    { id: '28', front: 'Was sind die häufigsten Ursachen für Datenverlust?', back: '1. Hardware-Defekte (Festplattenausfall)\n2. Menschliche Fehler (versehentliches Löschen)\n3. Software-/Systemfehler\n4. Malware/Ransomware\n5. Naturkatastrophen (Feuer, Wasser)\n6. Diebstahl' },
    { id: '29', front: 'Was ist ein Offsite-Backup?', back: 'Datensicherung an einem geografisch getrennten Standort.\n\nSchützt vor:\n• Brand/Wasserschaden\n• Einbruch/Diebstahl\n• Naturkatastrophen\n• Lokalen Stromausfällen\n\nUmsetzung: Cloud, zweites RZ, Banktresor' },
    { id: '30', front: 'Was ist der Rebuild-Prozess bei RAID?', back: 'Wiederherstellung der Daten auf einer neuen/Ersatzplatte.\n\n• Nutzt Parität (RAID 5/6) oder Spiegel (RAID 1/10)\n• Belastet das Array (Performance sinkt)\n• Kritische Phase: Weitere Ausfälle möglich\n• Dauer: Stunden bis Tage je nach Größe' },
    { id: '31', front: 'Mindestanzahl Festplatten pro RAID-Level', back: 'JBOD: 1 (beliebig viele)\nRAID 0: 2\nRAID 1: 2\nRAID 5: 3\nRAID 6: 4\nRAID 10: 4 (gerade Anzahl)' },
    { id: '32', front: 'Welches RAID für welchen Einsatzzweck?', back: 'RAID 0: Video-Schnitt, Temp-Daten (keine Redundanz nötig)\nRAID 1: Boot-Laufwerke, kleine kritische Daten\nRAID 5: Dateiserver, allgemeine Nutzung\nRAID 6: Große Arrays, NAS mit vielen Platten\nRAID 10: Datenbanken, VMs, hohe I/O' },
    { id: '33', front: 'Was bedeutet "Parität" bei RAID?', back: 'Prüfsumme zur Datenrekonstruktion.\n\nBerechnung: XOR aller Datenblöcke\n\nRAID 5: 1 Paritätsblock pro Stripe\nRAID 6: 2 Paritätsblöcke pro Stripe\n\nParität ist VERTEILT auf alle Platten (kein Flaschenhals).' },
    { id: '34', front: 'Was ist iSCSI?', back: 'Internet Small Computer System Interface\n\nSCSI-Befehle über TCP/IP-Netzwerk.\n\n• Günstige SAN-Alternative\n• Nutzt vorhandenes Ethernet\n• Initiator (Client) ↔ Target (Storage)\n• Blockbasierter Zugriff wie FC-SAN' },
    { id: '35', front: 'Was ist Fibre Channel (FC)?', back: 'Hochgeschwindigkeits-Netzwerk für SAN.\n\n• Geschwindigkeiten: 8/16/32/64 Gbps\n• Eigene Infrastruktur (teuer)\n• Sehr niedrige Latenz\n• Für Enterprise/kritische Systeme' },
  ],
  quizQuestions: [
    // ===== RAID KAPAZITÄTSBERECHNUNGEN =====
    { 
      id: '1', 
      question: 'Sie haben 5 Festplatten mit je 4 TB im RAID 5. Wie viel Nettokapazität steht zur Verfügung?', 
      options: ['20 TB', '16 TB', '12 TB', '8 TB'], 
      correctIndex: 1,
      explanation: 'RAID 5 Formel: (n-1) × min(Kapazität) = (5-1) × 4 TB = 16 TB'
    },
    { 
      id: '2', 
      question: 'Welche Nettokapazität bietet ein RAID 6 mit 6 × 3 TB Festplatten?', 
      options: ['18 TB', '15 TB', '12 TB', '9 TB'], 
      correctIndex: 2,
      explanation: 'RAID 6 Formel: (n-2) × min(Kapazität) = (6-2) × 3 TB = 12 TB'
    },
    { 
      id: '3', 
      question: 'Ein RAID 10 besteht aus 8 × 2 TB Festplatten. Wie viel Speicher ist nutzbar?', 
      options: ['16 TB', '12 TB', '8 TB', '4 TB'], 
      correctIndex: 2,
      explanation: 'RAID 10 Formel: (n/2) × min(Kapazität) = (8/2) × 2 TB = 8 TB'
    },
    { 
      id: '4', 
      question: 'Sie haben 4 Festplatten: 2TB, 3TB, 4TB, 4TB im RAID 0. Wie viel Kapazität?', 
      options: ['13 TB', '8 TB', '6 TB', '2 TB'], 
      correctIndex: 1,
      explanation: 'RAID 0 Formel: n × min(Kapazität) = 4 × 2 TB = 8 TB (kleinste Platte bestimmt!)'
    },
    { 
      id: '5', 
      question: 'JBOD mit 3 Platten: 1TB, 2TB, 3TB. Gesamtkapazität?', 
      options: ['3 TB', '6 TB', '2 TB', '1 TB'], 
      correctIndex: 1,
      explanation: 'JBOD Formel: Σ(alle Kapazitäten) = 1 + 2 + 3 = 6 TB'
    },
    { 
      id: '6', 
      question: 'RAID 1 mit 2 × 8 TB Festplatten. Nutzbare Kapazität?', 
      options: ['16 TB', '8 TB', '4 TB', '0 TB'], 
      correctIndex: 1,
      explanation: 'RAID 1 Formel: min(Kapazität) = 8 TB (Spiegelung = 50% Verlust)'
    },
    { 
      id: '7', 
      question: '10 Festplatten à 6 TB in RAID 6. Nettokapazität?', 
      options: ['60 TB', '54 TB', '48 TB', '36 TB'], 
      correctIndex: 2,
      explanation: 'RAID 6: (n-2) × min(Kapazität) = (10-2) × 6 TB = 48 TB'
    },
    
    // ===== XOR PARITÄT =====
    { 
      id: '8', 
      question: 'Was ergibt 1 XOR 1?', 
      options: ['0', '1', '2', '11'], 
      correctIndex: 0,
      explanation: 'XOR: Gleiche Werte = 0. Also 1 ⊕ 1 = 0'
    },
    { 
      id: '9', 
      question: 'RAID 5: Platte A=1, Platte B=0, Parität=1. Platte B fällt aus. Wie rekonstruiert man B?', 
      options: ['A + Parität = 2', 'A XOR Parität = 0', 'Parität - A = 0', 'Nicht möglich'], 
      correctIndex: 1,
      explanation: 'Rekonstruktion: B = A XOR Parität = 1 ⊕ 1 = 0 ✓'
    },
    
    // ===== RAID SZENARIEN =====
    { 
      id: '10', 
      question: 'Welches RAID eignet sich für einen Datenbankserver mit hohen Anforderungen an Performance UND Ausfallsicherheit?', 
      options: ['RAID 0', 'RAID 5', 'RAID 10', 'JBOD'], 
      correctIndex: 2,
      explanation: 'RAID 10 bietet sowohl hohe Performance (Striping) als auch hohe Ausfallsicherheit (Mirroring)'
    },
    { 
      id: '11', 
      question: 'Für Videobearbeitung wird maximale Geschwindigkeit benötigt. Datenverlust ist akzeptabel. Welches RAID?', 
      options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6'], 
      correctIndex: 0,
      explanation: 'RAID 0 bietet maximale Kapazität und Performance, aber keine Redundanz'
    },
    { 
      id: '12', 
      question: 'Welches RAID-Level toleriert den Ausfall von 2 Festplatten gleichzeitig?', 
      options: ['RAID 1', 'RAID 5', 'RAID 6', 'RAID 0'], 
      correctIndex: 2,
      explanation: 'RAID 6 verwendet doppelte Parität und kann 2 gleichzeitige Ausfälle verkraften'
    },
    { 
      id: '13', 
      question: 'Wie viele Festplatten werden mindestens für RAID 5 benötigt?', 
      options: ['2', '3', '4', '5'], 
      correctIndex: 1,
      explanation: 'RAID 5 benötigt mindestens 3 Festplatten für Striping mit verteilter Parität'
    },
    
    // ===== SPEICHERSYSTEME =====
    { 
      id: '14', 
      question: 'Welches Speichersystem arbeitet blockbasiert und nutzt Fibre Channel?', 
      options: ['NAS', 'DAS', 'SAN', 'JBOD'], 
      correctIndex: 2,
      explanation: 'SAN (Storage Area Network) arbeitet blockbasiert über Fibre Channel oder iSCSI'
    },
    { 
      id: '15', 
      question: 'Welches Protokoll wird für NAS in Windows-Umgebungen verwendet?', 
      options: ['iSCSI', 'Fibre Channel', 'SMB/CIFS', 'FCoE'], 
      correctIndex: 2,
      explanation: 'SMB/CIFS ist das Standard-Dateifreigabeprotokoll für Windows-Netzwerke'
    },
    { 
      id: '16', 
      question: 'Was ist der Hauptunterschied zwischen NAS und SAN?', 
      options: ['NAS ist schneller', 'NAS arbeitet dateibasiert, SAN blockbasiert', 'SAN ist günstiger', 'NAS benötigt Fibre Channel'], 
      correctIndex: 1,
      explanation: 'NAS stellt Dateisysteme bereit (SMB/NFS), SAN stellt rohe Speicherblöcke zur Verfügung'
    },
    { 
      id: '17', 
      question: 'Maximale Kabellänge bei DAS mit SAS-Anschluss?', 
      options: ['1 m', '10 m', '100 m', '1000 m'], 
      correctIndex: 1,
      explanation: 'DAS über SAS hat eine maximale Kabellänge von ca. 10 Metern'
    },
    { 
      id: '18', 
      question: 'Welcher Storage-Tier ist für Archive und Cold Data geeignet?', 
      options: ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'], 
      correctIndex: 3,
      explanation: 'Tier 3 (Tape/Cloud) ist für Archivierung und selten benötigte Daten'
    },
    
    // ===== BACKUP VERFAHREN =====
    { 
      id: '19', 
      question: 'Welches Sicherungsverfahren benötigt bei der Wiederherstellung nur ein einziges Backup-Medium?', 
      options: ['Inkrementelle Sicherung', 'Differentielle Sicherung', 'Vollsicherung', 'Alle genannten'], 
      correctIndex: 2,
      explanation: 'Bei einer Vollsicherung sind alle Daten auf einem Medium, keine Verkettung nötig'
    },
    { 
      id: '20', 
      question: 'Montag: Vollsicherung. Di-Fr: Inkrementelle Sicherungen. Am Freitag Wiederherstellung nötig. Was brauchen Sie?', 
      options: ['Nur Freitags-Backup', 'Vollsicherung + Freitags-Backup', 'Vollsicherung + alle inkrementellen (Di-Fr)', 'Nur die Vollsicherung'], 
      correctIndex: 2,
      explanation: 'Inkrementell: Vollsicherung + ALLE Inkremente in der Kette werden benötigt'
    },
    { 
      id: '21', 
      question: 'Montag: Vollsicherung. Di-Fr: Differentielle Sicherungen. Am Freitag Wiederherstellung nötig. Was brauchen Sie?', 
      options: ['Nur Freitags-Backup', 'Vollsicherung + Freitags-Differentiell', 'Vollsicherung + alle Differentiellen', 'Nur die Vollsicherung'], 
      correctIndex: 1,
      explanation: 'Differentiell: Nur Vollsicherung + LETZTES Differentiell (enthält alle Änderungen seit Voll)'
    },
    { 
      id: '22', 
      question: 'Welche Sicherungsmethode hat die kürzeste Sicherungszeit?', 
      options: ['Vollsicherung', 'Differentielle Sicherung', 'Inkrementelle Sicherung', 'Alle gleich'], 
      correctIndex: 2,
      explanation: 'Inkrementell sichert nur Änderungen seit der letzten Sicherung - minimale Datenmenge'
    },
    { 
      id: '23', 
      question: 'Differentielle Sicherung bezieht sich auf Änderungen seit...?', 
      options: ['Der letzten Sicherung (egal welcher Art)', 'Der letzten Vollsicherung', 'Gestern', 'Der letzten Woche'], 
      correctIndex: 1,
      explanation: 'Differentiell = Alle Änderungen seit dem letzten VOLLBACKUP'
    },
    
    // ===== BACKUP KONZEPTE =====
    { 
      id: '24', 
      question: 'Was bedeutet die "1" in der 3-2-1-Regel?', 
      options: ['1 Vollsicherung pro Woche', '1 Kopie an einem externen Standort', '1 TB Mindestkapazität', '1 Administrator für Backups'], 
      correctIndex: 1,
      explanation: '3-2-1: 3 Kopien, 2 verschiedene Medien, 1 Kopie extern/offsite'
    },
    { 
      id: '25', 
      question: 'Im GFS-Schema steht "Grandfather" für welchen Sicherungszyklus?', 
      options: ['Täglich', 'Wöchentlich', 'Monatlich', 'Jährlich'], 
      correctIndex: 2,
      explanation: 'GFS: Son = täglich, Father = wöchentlich, Grandfather = monatlich'
    },
    { 
      id: '26', 
      question: 'Ein Unternehmen akzeptiert maximal 4 Stunden Datenverlust. Wie oft sollte mindestens gesichert werden?', 
      options: ['Täglich', 'Alle 4 Stunden', 'Stündlich', 'Wöchentlich'], 
      correctIndex: 1,
      explanation: 'RPO von 4 Stunden bedeutet: Sicherung mindestens alle 4 Stunden'
    },
    { 
      id: '27', 
      question: 'Welche Maßnahme schützt am besten vor Datenverlust durch Brand im Rechenzentrum?', 
      options: ['RAID 6', 'Tägliche Vollsicherung', 'Offsite-Backup', 'Hot-Spare'], 
      correctIndex: 2,
      explanation: 'Nur ein geografisch getrenntes Offsite-Backup schützt vor lokalen Katastrophen'
    },
    { 
      id: '28', 
      question: 'Was beschreibt RTO (Recovery Time Objective)?', 
      options: ['Maximaler Datenverlust', 'Maximale Ausfallzeit', 'Backup-Häufigkeit', 'Speicherkapazität'], 
      correctIndex: 1,
      explanation: 'RTO = Maximale akzeptable Ausfallzeit bis zur Wiederherstellung'
    },
    
    // ===== HOT-SPARE vs HOT-SWAP =====
    { 
      id: '29', 
      question: 'Was ist der Vorteil eines Hot-Spare im RAID-Verbund?', 
      options: ['Höhere Kapazität', 'Automatische Wiederherstellung bei Plattenausfall', 'Bessere Leseleistung', 'Geringerer Stromverbrauch'], 
      correctIndex: 1,
      explanation: 'Hot-Spare springt automatisch ein und startet sofort den Rebuild-Prozess'
    },
    { 
      id: '30', 
      question: 'Was ist der Unterschied zwischen Hot-Spare und Hot-Swap?', 
      options: ['Kein Unterschied', 'Hot-Spare ist automatisch, Hot-Swap ist manuell', 'Hot-Swap ist automatisch, Hot-Spare ist manuell', 'Hot-Spare ist für SSDs, Hot-Swap für HDDs'], 
      correctIndex: 1,
      explanation: 'Hot-Spare = automatische Ersatzplatte. Hot-Swap = manueller Wechsel im Betrieb'
    },
    { 
      id: '31', 
      question: 'Was benötigt man für Hot-Swap?', 
      options: ['Zusätzliche Ersatzplatte im Array', 'Wechselrahmen', 'RAID 6', 'Fibre Channel'], 
      correctIndex: 1,
      explanation: 'Hot-Swap erfordert einen Wechselrahmen für den Austausch im laufenden Betrieb'
    },
    
    // ===== GEMISCHTE FRAGEN =====
    { 
      id: '32', 
      question: 'Welches RAID bietet die höchste Speichereffizienz bei 4 Platten?', 
      options: ['RAID 0 (100%)', 'RAID 5 (75%)', 'RAID 6 (50%)', 'RAID 10 (50%)'], 
      correctIndex: 0,
      explanation: 'RAID 0 nutzt 100% der Kapazität (keine Redundanz). RAID 5: 75%, RAID 6/10: 50%'
    },
    { 
      id: '33', 
      question: 'Ein Server hat 6 × 4TB in RAID 5 mit 1 Hot-Spare. Nutzbare Kapazität?', 
      options: ['24 TB', '20 TB', '16 TB', '12 TB'], 
      correctIndex: 2,
      explanation: 'Hot-Spare zählt nicht zur Kapazität! 5 aktive Platten: (5-1) × 4TB = 16TB'
    },
    { 
      id: '34', 
      question: 'Welches Protokoll ermöglicht SAN über normales Ethernet?', 
      options: ['SMB', 'NFS', 'iSCSI', 'AFP'], 
      correctIndex: 2,
      explanation: 'iSCSI überträgt SCSI-Befehle über TCP/IP und ermöglicht SAN ohne Fibre Channel'
    },
    { 
      id: '35', 
      question: 'Was passiert bei RAID 5, wenn während des Rebuilds eine weitere Platte ausfällt?', 
      options: ['Rebuild wird fortgesetzt', 'Totalverlust aller Daten', 'Automatischer Wechsel zu RAID 6', 'Nur die neue Platte ist betroffen'], 
      correctIndex: 1,
      explanation: 'RAID 5 toleriert nur 1 Ausfall. Zweiter Ausfall während Rebuild = Datenverlust'
    },
  ],
};
