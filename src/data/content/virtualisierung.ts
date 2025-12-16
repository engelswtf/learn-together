import { TopicContent } from '@/types';

export const virtualisierungContent: TopicContent = {
  topicId: 'virtualisierung',
  flashcards: [
    // ===== GRUNDPRINZIP DER VIRTUALISIERUNG (1-5) =====
    { 
      id: '1', 
      front: 'Was ist das Grundprinzip der Virtualisierung?', 
      back: 'Physische Ressourcen (CPU, RAM, Speicher) in mehrere virtuelle Instanzen unterteilen, um simultane Ausführung mehrerer Betriebssysteme ohne gegenseitige Beeinträchtigung zu ermöglichen.' 
    },
    { 
      id: '2', 
      front: 'Welche 5 Schlüsselelemente gehören zur Virtualisierung?', 
      back: '1. Hypervisor (VMM)\n2. Virtual Machine (VM)\n3. Ressourcenpooling\n4. Isolation\n5. Portabilität' 
    },
    { 
      id: '3', 
      front: 'Was ist ein Hypervisor (VMM)?', 
      back: 'Virtual Machine Monitor - Software zur Erstellung, Verwaltung und Ausführung von virtuellen Maschinen. Verwaltet die Zuweisung physischer Ressourcen an VMs.' 
    },
    { 
      id: '4', 
      front: 'Was bedeutet Ressourcenpooling bei Virtualisierung?', 
      back: 'Zusammenfassung physischer Ressourcen (CPU, RAM, Storage) in einen gemeinsamen Pool, der dynamisch an virtuelle Maschinen verteilt wird.' 
    },
    { 
      id: '5', 
      front: 'Was bedeutet Isolation im Kontext der Virtualisierung?', 
      back: 'Jede VM läuft in einer abgeschotteten Umgebung. Fehler oder Sicherheitsprobleme in einer VM beeinflussen andere VMs nicht.' 
    },

    // ===== HYPERVISOR TYPE 1 (BARE-METAL) (6-10) =====
    { 
      id: '6', 
      front: 'Was ist ein Type-1-Hypervisor (Bare-Metal)?', 
      back: 'Ein Hypervisor, der direkt auf der physischen Hardware installiert wird und direkt mit CPU und RAM interagiert - ohne Host-Betriebssystem dazwischen.' 
    },
    { 
      id: '7', 
      front: 'Für welche Einsatzgebiete ist Type-1-Hypervisor geeignet?', 
      back: 'Rechenzentren, Cloud-Plattformen, Produktionsumgebungen - überall wo maximale Performance und Zuverlässigkeit erforderlich sind.' 
    },
    { 
      id: '8', 
      front: 'Nenne 4 Beispiele für Type-1-Hypervisoren.', 
      back: '1. VMware ESXi\n2. Microsoft Hyper-V\n3. Xen\n4. Proxmox VE (basiert auf KVM)' 
    },
    { 
      id: '9', 
      front: 'Warum ist Type-1-Hypervisor performanter als Type-2?', 
      back: 'Kein Host-OS-Overhead - der Hypervisor kommuniziert direkt mit der Hardware ohne Umweg über ein Betriebssystem.' 
    },
    { 
      id: '10', 
      front: 'Was ist KVM (Kernel-based Virtual Machine)?', 
      back: 'Ein in den Linux-Kernel integrierter Type-1-Hypervisor. Wird von Proxmox VE und vielen Cloud-Providern genutzt.' 
    },

    // ===== HYPERVISOR TYPE 2 (HOSTED) (11-14) =====
    { 
      id: '11', 
      front: 'Was ist ein Type-2-Hypervisor (Hosted)?', 
      back: 'Ein Hypervisor, der als Anwendung innerhalb eines Host-Betriebssystems läuft. Das Host-OS vermittelt den Hardware-Zugriff.' 
    },
    { 
      id: '12', 
      front: 'Für welche Einsatzgebiete ist Type-2-Hypervisor geeignet?', 
      back: 'Desktop-Virtualisierung, Entwicklung, Tests, Schulungen - überall wo Flexibilität wichtiger ist als maximale Performance.' 
    },
    { 
      id: '13', 
      front: 'Nenne 3 Beispiele für Type-2-Hypervisoren.', 
      back: '1. Oracle VirtualBox\n2. VMware Workstation\n3. VMware Fusion (macOS)' 
    },
    { 
      id: '14', 
      front: 'Was ist der Performance-Nachteil von Type-2-Hypervisoren?', 
      back: 'Mehr Overhead durch das Host-Betriebssystem - alle Hardware-Zugriffe müssen durch das Host-OS geleitet werden.' 
    },

    // ===== CONTAINER VS VM (KRITISCH!) (15-20) =====
    { 
      id: '15', 
      front: 'Was ist der fundamentale Unterschied zwischen Container und VM?', 
      back: 'Container: Teilen den Host-Kernel, kein eigenes OS\nVM: Eigenes vollständiges OS, vollständige Hardware-Virtualisierung' 
    },
    { 
      id: '16', 
      front: 'Wie unterscheidet sich die Isolation bei Container vs VM?', 
      back: 'VM: Vollständige Isolation durch eigenes OS und virtualisierte Hardware\nContainer: Geringere Isolation, da Kernel mit Host geteilt wird' 
    },
    { 
      id: '17', 
      front: 'Wie unterscheidet sich die Startzeit bei Container vs VM?', 
      back: 'Container: Sekunden (kein Kernel-Boot nötig)\nVM: Minuten (vollständiger OS-Boot erforderlich)' 
    },
    { 
      id: '18', 
      front: 'Wie unterscheidet sich der Ressourcenverbrauch bei Container vs VM?', 
      back: 'Container: Weniger Ressourcen (kein eigenes OS, geteilter Kernel)\nVM: Mehr Ressourcen (vollständiges OS pro VM)' 
    },
    { 
      id: '19', 
      front: 'Wann sollte man VMs statt Container verwenden?', 
      back: '- Verschiedene Betriebssysteme erforderlich\n- Höhere Sicherheitsanforderungen\n- Vollständige Isolation benötigt\n- Legacy-Anwendungen' 
    },
    { 
      id: '20', 
      front: 'Wann sollte man Container statt VMs verwenden?', 
      back: '- Microservices-Architektur\n- Schnelle Skalierung erforderlich\n- CI/CD-Pipelines\n- Ressourceneffizienz wichtig' 
    },

    // ===== DOCKER 3 ARTEFAKTE (21-24) =====
    { 
      id: '21', 
      front: 'Was sind die 3 Docker-Artefakte?', 
      back: '1. Dockerfile: Textdatei mit Build-Anweisungen\n2. Docker Image: Unveränderliche Vorlage (read-only)\n3. Docker Container: Laufende Instanz eines Images' 
    },
    { 
      id: '22', 
      front: 'Was ist ein Dockerfile?', 
      back: 'Eine Textdatei mit Anweisungen zum automatischen Erstellen eines Docker-Images. Enthält Befehle wie FROM, RUN, COPY, CMD.' 
    },
    { 
      id: '23', 
      front: 'Was ist ein Docker Image?', 
      back: 'Eine unveränderliche (immutable), schichtbasierte Vorlage, die alle Abhängigkeiten, Bibliotheken und Konfigurationen für eine Anwendung enthält. Read-only.' 
    },
    { 
      id: '24', 
      front: 'Was ist ein Docker Container?', 
      back: 'Eine laufende, isolierte Instanz eines Docker-Images. Container sind kurzlebig und können erstellt, gestartet, gestoppt und gelöscht werden.' 
    },

    // ===== DOCKERFILE BEFEHLE (25-32) =====
    { 
      id: '25', 
      front: 'Was macht die FROM-Anweisung im Dockerfile?', 
      back: 'Definiert das Basis-Image, auf dem das neue Image aufgebaut wird. Muss die erste Anweisung sein.\nBeispiel: FROM ubuntu:22.04' 
    },
    { 
      id: '26', 
      front: 'Was macht die RUN-Anweisung im Dockerfile?', 
      back: 'Führt einen Befehl während des Image-Builds aus. Jeder RUN-Befehl erstellt eine neue Schicht.\nBeispiel: RUN apt-get update && apt-get install -y nginx' 
    },
    { 
      id: '27', 
      front: 'Was ist der Unterschied zwischen COPY und ADD im Dockerfile?', 
      back: 'COPY: Kopiert nur lokale Dateien\nADD: Kann zusätzlich URLs herunterladen und tar-Archive automatisch entpacken\nEmpfehlung: COPY bevorzugen' 
    },
    { 
      id: '28', 
      front: 'Was macht die WORKDIR-Anweisung im Dockerfile?', 
      back: 'Setzt das Arbeitsverzeichnis für nachfolgende Befehle (RUN, CMD, COPY, etc.).\nBeispiel: WORKDIR /app' 
    },
    { 
      id: '29', 
      front: 'Was macht die ENV-Anweisung im Dockerfile?', 
      back: 'Setzt Umgebungsvariablen, die während Build und Runtime verfügbar sind.\nBeispiel: ENV NODE_ENV=production' 
    },
    { 
      id: '30', 
      front: 'Was macht die EXPOSE-Anweisung im Dockerfile?', 
      back: 'Dokumentiert, welche Ports die Anwendung nutzt. Öffnet KEINE Ports automatisch! Dient nur als Dokumentation.\nBeispiel: EXPOSE 8080' 
    },
    { 
      id: '31', 
      front: 'Was ist der Unterschied zwischen CMD und ENTRYPOINT?', 
      back: 'CMD: Standardbefehl beim Start, kann überschrieben werden\nENTRYPOINT: Hauptprozess, wird immer ausgeführt\nKombination: ENTRYPOINT definiert Programm, CMD die Argumente' 
    },
    { 
      id: '32', 
      front: 'Was macht die ARG-Anweisung im Dockerfile?', 
      back: 'Definiert Build-Zeit-Variablen, die mit --build-arg übergeben werden können. Nur während Build verfügbar, nicht zur Runtime.\nBeispiel: ARG VERSION=1.0' 
    },

    // ===== DOCKER BEFEHLE (33-40) =====
    { 
      id: '33', 
      front: 'Welcher Befehl erstellt ein Docker-Image aus einem Dockerfile?', 
      back: 'docker build -t <image-name>:<tag> .\nDer Punkt gibt das Build-Verzeichnis an.' 
    },
    { 
      id: '34', 
      front: 'Welcher Befehl startet einen Container aus einem Image?', 
      back: 'docker run <image>\nMit Optionen: docker run -d -p 8080:80 --name mycontainer <image>' 
    },
    { 
      id: '35', 
      front: 'Welcher Befehl zeigt laufende Container an?', 
      back: 'docker ps (nur laufende)\ndocker ps -a (alle, auch gestoppte)' 
    },
    { 
      id: '36', 
      front: 'Welche Befehle stoppen und starten Container?', 
      back: 'docker stop <container> - Stoppt Container graceful\ndocker start <container> - Startet gestoppten Container\ndocker restart <container> - Neustart' 
    },
    { 
      id: '37', 
      front: 'Wie führt man einen Befehl in einem laufenden Container aus?', 
      back: 'docker exec -it <container> <befehl>\nBeispiel: docker exec -it mycontainer bash\n-i: interaktiv, -t: Terminal' 
    },
    { 
      id: '38', 
      front: 'Welcher Befehl zeigt die Logs eines Containers?', 
      back: 'docker logs <container>\ndocker logs -f <container> (follow/live)\ndocker logs --tail 100 <container> (letzte 100 Zeilen)' 
    },
    { 
      id: '39', 
      front: 'Welcher Befehl entfernt Container und Images?', 
      back: 'docker rm <container> - Container löschen\ndocker rmi <image> - Image löschen\ndocker container prune - Alle gestoppten Container löschen' 
    },
    { 
      id: '40', 
      front: 'Was ist Docker Hub?', 
      back: 'Die Standard-Registry für Docker-Images. Öffentliche und private Repositories möglich.\ndocker pull <image> - Image herunterladen\ndocker push <image> - Image hochladen' 
    },
  ],
  quizQuestions: [
    // ===== HYPERVISOR ARCHITEKTUR (1-4) =====
    {
      id: '1',
      question: 'Ein Unternehmen plant ein neues Rechenzentrum für Cloud-Services. Welcher Hypervisor-Typ sollte eingesetzt werden?',
      options: ['Type-2 (Hosted)', 'Type-1 (Bare-Metal)', 'Type-3 (Hybrid)', 'Container-Runtime'],
      correctIndex: 1,
      explanation: 'Type-1-Hypervisoren (Bare-Metal) wie VMware ESXi oder Proxmox VE sind für Rechenzentren und Cloud-Plattformen konzipiert, da sie direkt auf der Hardware laufen und maximale Performance bieten.'
    },
    {
      id: '2',
      question: 'Ein Entwickler möchte auf seinem Windows-Laptop schnell eine Linux-Umgebung für Tests einrichten. Welche Lösung ist am praktischsten?',
      options: ['VMware ESXi installieren', 'Oracle VirtualBox nutzen', 'Proxmox VE aufsetzen', 'Microsoft Hyper-V Server'],
      correctIndex: 1,
      explanation: 'VirtualBox ist ein Type-2-Hypervisor, der als Anwendung auf Windows läuft. Ideal für Entwickler, da keine Neuinstallation des Systems nötig ist.'
    },
    {
      id: '3',
      question: 'Warum hat ein Type-1-Hypervisor weniger Overhead als Type-2?',
      options: ['Type-1 nutzt schnellere CPUs', 'Type-1 interagiert direkt mit CPU und RAM ohne Host-OS', 'Type-1 hat mehr Arbeitsspeicher', 'Type-1 verwendet SSD-Speicher'],
      correctIndex: 1,
      explanation: 'Type-1-Hypervisoren sind direkt auf der Hardware installiert und kommunizieren ohne Umweg über ein Host-Betriebssystem mit CPU und RAM.'
    },
    {
      id: '4',
      question: 'Welche der folgenden ist KEIN Type-1-Hypervisor?',
      options: ['VMware ESXi', 'Oracle VirtualBox', 'Microsoft Hyper-V', 'Proxmox VE'],
      correctIndex: 1,
      explanation: 'Oracle VirtualBox ist ein Type-2-Hypervisor (Hosted), der als Anwendung auf einem Host-Betriebssystem läuft.'
    },

    // ===== CONTAINER VS VM VERGLEICH (5-9) =====
    {
      id: '5',
      question: 'Warum starten Container in Sekunden, während VMs Minuten brauchen?',
      options: ['Container haben schnellere Prozessoren', 'Container müssen keinen eigenen Kernel booten', 'Container nutzen SSD-Speicher', 'Container haben weniger Dateien'],
      correctIndex: 1,
      explanation: 'Container teilen sich den Kernel des Host-Systems. VMs müssen ein vollständiges Betriebssystem mit eigenem Kernel hochfahren.'
    },
    {
      id: '6',
      question: 'Ein Sicherheitsteam benötigt maximale Isolation zwischen Workloads. Was ist die bessere Wahl?',
      options: ['Docker Container', 'Virtuelle Maschinen', 'Kubernetes Pods', 'Docker Compose'],
      correctIndex: 1,
      explanation: 'VMs bieten vollständige Isolation durch eigenes OS und virtualisierte Hardware. Container teilen den Host-Kernel, was die Isolation reduziert.'
    },
    {
      id: '7',
      question: 'Welche Aussage über Container ist KORREKT?',
      options: ['Container haben ein eigenes Betriebssystem', 'Container bieten vollständige Hardware-Virtualisierung', 'Container teilen den Kernel des Host-Systems', 'Container starten langsamer als VMs'],
      correctIndex: 2,
      explanation: 'Container teilen sich den Host-Kernel und virtualisieren nur die Anwendungsschicht - das macht sie leichtgewichtig und schnell.'
    },
    {
      id: '8',
      question: 'Ein Team möchte Windows- und Linux-Anwendungen auf demselben Server betreiben. Was ist erforderlich?',
      options: ['Docker Container', 'Virtuelle Maschinen', 'Docker Compose', 'Kubernetes'],
      correctIndex: 1,
      explanation: 'Container können nur das gleiche OS wie der Host ausführen (Linux-Container auf Linux-Host). Für verschiedene Betriebssysteme sind VMs erforderlich.'
    },
    {
      id: '9',
      question: 'Welches Szenario profitiert am meisten von Containern statt VMs?',
      options: ['Legacy-Windows-Anwendungen', 'Microservices mit schneller Skalierung', 'Maximale Sicherheitsisolation', 'Verschiedene Betriebssysteme'],
      correctIndex: 1,
      explanation: 'Container sind ideal für Microservices: schneller Start, geringer Ressourcenverbrauch, einfache Skalierung und perfekt für CI/CD-Pipelines.'
    },

    // ===== DOCKER ARTEFAKTE (10-12) =====
    {
      id: '10',
      question: 'In welcher Reihenfolge werden Docker-Artefakte erstellt?',
      options: ['Container → Image → Dockerfile', 'Image → Dockerfile → Container', 'Dockerfile → Image → Container', 'Container → Dockerfile → Image'],
      correctIndex: 2,
      explanation: 'Workflow: 1. Dockerfile schreiben, 2. docker build erstellt Image, 3. docker run erstellt Container aus Image.'
    },
    {
      id: '11',
      question: 'Was ist die wichtigste Eigenschaft eines Docker Images?',
      options: ['Es ist veränderbar (mutable)', 'Es ist unveränderlich (immutable/read-only)', 'Es läuft automatisch', 'Es enthält nur Code'],
      correctIndex: 1,
      explanation: 'Docker Images sind unveränderlich (immutable). Änderungen erstellen neue Image-Schichten. Das garantiert Reproduzierbarkeit.'
    },
    {
      id: '12',
      question: 'Was unterscheidet einen Docker Container von einem Docker Image?',
      options: ['Container sind größer', 'Container sind laufende Instanzen eines Images', 'Container sind unveränderlich', 'Container enthalten das Dockerfile'],
      correctIndex: 1,
      explanation: 'Ein Image ist eine statische Vorlage (read-only). Ein Container ist eine laufende, isolierte Instanz dieses Images.'
    },

    // ===== DOCKERFILE BEFEHLE (13-17) =====
    {
      id: '13',
      question: 'Welche Dockerfile-Anweisung MUSS als erste stehen?',
      options: ['RUN', 'CMD', 'FROM', 'WORKDIR'],
      correctIndex: 2,
      explanation: 'FROM definiert das Basis-Image und muss immer die erste Anweisung im Dockerfile sein (außer ARG für Build-Argumente).'
    },
    {
      id: '14',
      question: 'Was macht die EXPOSE-Anweisung im Dockerfile?',
      options: ['Öffnet automatisch Ports auf dem Host', 'Dokumentiert, welche Ports die Anwendung nutzt', 'Blockiert alle anderen Ports', 'Erstellt Firewall-Regeln'],
      correctIndex: 1,
      explanation: 'EXPOSE ist nur Dokumentation! Um Ports tatsächlich zu veröffentlichen, muss docker run -p verwendet werden.'
    },
    {
      id: '15',
      question: 'Ein Container soll immer "python app.py" ausführen, aber mit verschiedenen Argumenten gestartet werden können. Welche Kombination ist richtig?',
      options: ['Nur CMD ["python", "app.py"]', 'Nur ENTRYPOINT ["python", "app.py"]', 'ENTRYPOINT ["python"] und CMD ["app.py"]', 'RUN python app.py'],
      correctIndex: 2,
      explanation: 'ENTRYPOINT definiert den festen Hauptbefehl (python), CMD die überschreibbaren Standardargumente (app.py).'
    },
    {
      id: '16',
      question: 'Welche Anweisung sollte bevorzugt werden, um lokale Dateien ins Image zu kopieren?',
      options: ['ADD', 'COPY', 'RUN cp', 'IMPORT'],
      correctIndex: 1,
      explanation: 'COPY ist für einfache Dateikopiervorgänge empfohlen. ADD hat zusätzliche Features (URL, tar-Entpacken), die selten benötigt werden.'
    },
    {
      id: '17',
      question: 'Was ist der Unterschied zwischen ENV und ARG im Dockerfile?',
      options: ['Kein Unterschied', 'ENV nur zur Build-Zeit, ARG zur Runtime', 'ARG nur zur Build-Zeit, ENV auch zur Runtime', 'ARG ist veraltet'],
      correctIndex: 2,
      explanation: 'ARG-Variablen existieren nur während des Builds. ENV-Variablen sind sowohl beim Build als auch zur Container-Runtime verfügbar.'
    },

    // ===== DOCKER BEFEHLE (18-22) =====
    {
      id: '18',
      question: 'Welcher Befehl zeigt ALLE Container an, einschließlich gestoppter?',
      options: ['docker list --all', 'docker ps -a', 'docker containers --stopped', 'docker show all'],
      correctIndex: 1,
      explanation: 'docker ps -a zeigt alle Container. Ohne -a werden nur laufende Container angezeigt.'
    },
    {
      id: '19',
      question: 'Wie öffnet man eine interaktive Bash-Shell in einem laufenden Container "webserver"?',
      options: ['docker shell webserver', 'docker exec -it webserver bash', 'docker run -it webserver bash', 'docker connect webserver'],
      correctIndex: 1,
      explanation: 'docker exec führt Befehle in laufenden Containern aus. -i (interaktiv) und -t (Terminal) ermöglichen die Shell-Nutzung.'
    },
    {
      id: '20',
      question: 'Welcher Befehl erstellt ein Image mit dem Tag "myapp:v1.0" aus dem aktuellen Verzeichnis?',
      options: ['docker create -t myapp:v1.0 .', 'docker build -t myapp:v1.0 .', 'docker make myapp:v1.0 .', 'docker image myapp:v1.0 .'],
      correctIndex: 1,
      explanation: 'docker build -t erstellt ein Image. Der Punkt (.) gibt das aktuelle Verzeichnis als Build-Kontext an.'
    },
    {
      id: '21',
      question: 'Wie entfernt man alle gestoppten Container auf einmal?',
      options: ['docker rm --all', 'docker container prune', 'docker clean', 'docker delete stopped'],
      correctIndex: 1,
      explanation: 'docker container prune entfernt alle gestoppten Container. docker system prune entfernt zusätzlich ungenutzte Images und Netzwerke.'
    },
    {
      id: '22',
      question: 'Welcher Befehl zeigt die Live-Logs eines Containers an?',
      options: ['docker logs <container>', 'docker logs -f <container>', 'docker output <container>', 'docker stream <container>'],
      correctIndex: 1,
      explanation: 'docker logs -f (follow) zeigt Logs in Echtzeit an. Ohne -f werden nur die bisherigen Logs angezeigt.'
    },
  ],
};
