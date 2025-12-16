import { TopicContent } from '@/types';

export const cloudComputingContent: TopicContent = {
  topicId: 'cloud-computing',
  flashcards: [
    // ==========================================
    // NIST 5 MERKMALE (Essential Characteristics)
    // ==========================================
    { 
      id: 'cc-1', 
      front: 'Was bedeutet "On-Demand Self-Service" laut NIST?', 
      back: 'Ressourcen können automatisch angefordert werden, ohne manuelle Tätigkeit des Providers. Der Nutzer kann selbstständig Rechenleistung, Speicher etc. bereitstellen - ohne menschliche Interaktion mit dem Anbieter.' 
    },
    { 
      id: 'cc-2', 
      front: 'Was bedeutet "Broad Network Access" laut NIST?', 
      back: 'Zugriff auf Cloud-Dienste erfolgt über standardisierte Internetprotokolle (HTTP, HTTPS, APIs). Die Dienste sind von verschiedenen Endgeräten (Laptop, Smartphone, Tablet) über das Netzwerk erreichbar.' 
    },
    { 
      id: 'cc-3', 
      front: 'Was bedeutet "Resource Pooling" laut NIST?', 
      back: 'Multi-Tenant-Modell mit dynamischer Zuweisung: Die Ressourcen des Anbieters werden gebündelt und mehreren Kunden dynamisch zugewiesen. Der Kunde hat keine Kontrolle über den genauen physischen Standort der Ressourcen.' 
    },
    { 
      id: 'cc-4', 
      front: 'Was bedeutet "Rapid Elasticity" laut NIST?', 
      back: 'Schnelle, bedarfsgerechte Bereitstellung von Ressourcen - virtuell unbegrenzt. Kapazitäten können schnell und elastisch (oft automatisch) skaliert werden. Für den Nutzer erscheinen die Ressourcen unbegrenzt.' 
    },
    { 
      id: 'cc-5', 
      front: 'Was bedeutet "Measured Service" laut NIST?', 
      back: 'Automatische Messung des Ressourcenverbrauchs mit voller Transparenz für Anbieter und Nutzer. Ermöglicht nutzungsbasierte Abrechnung (Pay-as-you-go) und Optimierung der Ressourcennutzung.' 
    },
    { 
      id: 'cc-6', 
      front: 'Nenne alle 5 NIST Essential Characteristics des Cloud Computing.', 
      back: '1. On-Demand Self-Service\n2. Broad Network Access\n3. Resource Pooling\n4. Rapid Elasticity\n5. Measured Service' 
    },

    // ==========================================
    // SERVICE-MODELLE (IaaS, PaaS, SaaS)
    // ==========================================
    { 
      id: 'cc-7', 
      front: 'Was ist IaaS (Infrastructure as a Service)?', 
      back: 'Bereitstellung von VMs, Netzwerken und Speicher. Der Kunde verwaltet: Betriebssystem, Middleware, Runtime und Anwendungen. Der Anbieter verwaltet: Virtualisierung, Server, Storage, Netzwerk. Beispiele: AWS EC2, Azure VMs, Google Compute Engine.' 
    },
    { 
      id: 'cc-8', 
      front: 'Was ist PaaS (Platform as a Service)?', 
      back: 'Entwicklungsplattform mit Runtime, Middleware und Datenbanken. Der Kunde verwaltet nur den Code/die Anwendung. Der Anbieter verwaltet alles darunter. Ideal für Entwickler, die sich nur auf Programmierung konzentrieren wollen. Beispiele: Heroku, Google App Engine.' 
    },
    { 
      id: 'cc-9', 
      front: 'Was ist SaaS (Software as a Service)?', 
      back: 'Fertige Anwendungen, die der Kunde nur nutzt. Der Anbieter verwaltet ALLES (Infrastruktur, Plattform, Anwendung). Zugriff typischerweise über Webbrowser. Beispiele: Microsoft 365, Salesforce, Google Workspace, Dropbox.' 
    },
    { 
      id: 'cc-10', 
      front: 'Vergleiche die Verantwortlichkeiten bei IaaS, PaaS und SaaS.', 
      back: 'IaaS: Kunde verwaltet OS, Middleware, Apps\nPaaS: Kunde verwaltet nur Code/Apps\nSaaS: Kunde nutzt nur die fertige Software\n\nJe höher das "as a Service", desto weniger Verantwortung beim Kunden.' 
    },
    { 
      id: 'cc-11', 
      front: 'Welches Service-Modell wählt ein Entwickler, der nur programmieren möchte?', 
      back: 'PaaS (Platform as a Service) - Der Entwickler kümmert sich nur um den Code. Die gesamte Infrastruktur (Server, OS, Runtime, Middleware) wird vom Anbieter verwaltet.' 
    },

    // ==========================================
    // BEREITSTELLUNGSMODELLE (Deployment Models)
    // ==========================================
    { 
      id: 'cc-12', 
      front: 'Was ist eine Public Cloud?', 
      back: 'Cloud-Infrastruktur von einem Drittanbieter, öffentlich zugänglich über Internet. Vorteile: Kostengünstig durch geteilte Ressourcen, schnelle Skalierung. Nachteile: Weniger Kontrolle, Daten bei Drittanbieter. Beispiele: AWS, Azure, Google Cloud.' 
    },
    { 
      id: 'cc-13', 
      front: 'Was ist eine Private Cloud?', 
      back: 'Cloud-Infrastruktur exklusiv für EINE Organisation, auf eigenen Servern oder dediziert bei einem Anbieter. Vorteile: Hohe Sicherheit, volle Kontrolle, Compliance. Nachteile: Höhere Kosten, eigenes Personal nötig.' 
    },
    { 
      id: 'cc-14', 
      front: 'Was ist eine Community Cloud?', 
      back: 'Cloud-Infrastruktur wird von MEHREREN Organisationen mit gemeinsamen Interessen geteilt (z.B. gleiche Branche, Compliance-Anforderungen, Sicherheitsbedürfnisse). Beispiele: Gesundheitswesen, Behörden, Finanzsektor.' 
    },
    { 
      id: 'cc-15', 
      front: 'Was ist eine Hybrid Cloud?', 
      back: 'Kombination aus Private Cloud und Public Cloud, verbunden durch standardisierte Technologien. Ermöglicht: Sensible Daten in Private Cloud, skalierbare Workloads in Public Cloud. Flexibilität bei Kosten und Sicherheit.' 
    },
    { 
      id: 'cc-16', 
      front: 'Nenne alle 4 NIST Deployment Models.', 
      back: '1. Public Cloud - Drittanbieter, öffentlich\n2. Private Cloud - Eine Organisation, eigene Server\n3. Community Cloud - Mehrere Organisationen mit gemeinsamen Interessen\n4. Hybrid Cloud - Kombination Private + Public' 
    },

    // ==========================================
    // WORKLOAD-TYPEN (A-F)
    // ==========================================
    { 
      id: 'cc-17', 
      front: 'Workload Typ A: Statisch - Ist Cloud geeignet?', 
      back: 'UNGEEIGNET für Cloud! Konstante, vorhersehbare Ressourcennutzung ohne Schwankungen. Keine Elastizität benötigt. Besser: On-Premises oder Reserved Instances (günstiger bei konstantem Bedarf).' 
    },
    { 
      id: 'cc-18', 
      front: 'Workload Typ B: Periodisch - Ist Cloud geeignet?', 
      back: 'GUT geeignet für Cloud! Regelmäßig wiederkehrende Lastspitzen (z.B. Monatsabschluss, Weihnachtsgeschäft, Black Friday). Planbare Skalierung, Pay-as-you-go bei Spitzen.' 
    },
    { 
      id: 'cc-19', 
      front: 'Workload Typ C: Einmalig/Selten - Ist Cloud geeignet?', 
      back: 'EXTREM geeignet für Cloud! (Höchstes Peak-to-Average Ratio) Einmalige, zeitlich begrenzte Ressourcenanforderung (z.B. Produktlaunch, Datenmigration, Event). Ressourcen nur bei Bedarf, keine langfristige Bindung.' 
    },
    { 
      id: 'cc-20', 
      front: 'Workload Typ D: Zufällig/Unvorhersehbar - Ist Cloud geeignet?', 
      back: 'GUT geeignet für Cloud! Unvorhersehbare Lastspitzen ohne erkennbares Muster. Automatisierung (Auto-Scaling) ist hier besonders wichtig. Pay-as-you-go ideal für unplanbare Spitzen.' 
    },
    { 
      id: 'cc-21', 
      front: 'Workload Typ E: Kontinuierlich wachsend - Ist Cloud geeignet?', 
      back: 'MITTEL geeignet für Cloud. Stetig steigender Ressourcenbedarf. Cloud ermöglicht einfache Skalierung ohne Hardware-Kauf, aber bei starkem Wachstum können Reserved Instances günstiger sein.' 
    },
    { 
      id: 'cc-22', 
      front: 'Workload Typ F: Kontinuierlich sinkend - Ist Cloud geeignet?', 
      back: 'MITTEL geeignet für Cloud. Stetig sinkender Ressourcenbedarf. Cloud ermöglicht einfaches Downsizing ohne Hardware-Entsorgung. Pay-as-you-go passt sich automatisch an.' 
    },

    // ==========================================
    // PEAK-TO-AVERAGE RATIO
    // ==========================================
    { 
      id: 'cc-23', 
      front: 'Was ist das Peak-to-Average Ratio (p/a) und wann ist Cloud sinnvoll?', 
      back: 'p/a = Spitzenlast / Durchschnittslast\n\nCloud ist sinnvoll wenn: p/a > c/d\n(c = Cloud-Kosten, d = Datacenter-Kosten)\n\nJe höher die Lastschwankung (hohes p/a), desto besser eignet sich Cloud Computing.' 
    },
    { 
      id: 'cc-24', 
      front: 'Warum ist ein hohes Peak-to-Average Ratio gut für Cloud?', 
      back: 'Bei hohem p/a (starke Lastschwankungen) würde On-Premises-Hardware für Spitzenlast dimensioniert, aber meist ungenutzt sein. Cloud ermöglicht: Nur bei Bedarf zahlen, keine Überkapazitäten, schnelle Skalierung bei Spitzen.' 
    },

    // ==========================================
    // WIRTSCHAFTLICHE ASPEKTE
    // ==========================================
    { 
      id: 'cc-25', 
      front: 'Was ist der Unterschied zwischen CapEx und OpEx?', 
      back: 'CapEx (Capital Expenditure): Einmalige Investitionen in Hardware/Infrastruktur.\nOpEx (Operational Expenditure): Laufende Betriebskosten.\n\nCloud wandelt CapEx in OpEx um - keine Vorabinvestitionen, stattdessen nutzungsbasierte Abrechnung.' 
    },
    { 
      id: 'cc-26', 
      front: 'Was ist Pay-as-you-go im Cloud Computing?', 
      back: 'Bezahlung nur für tatsächlich genutzte Ressourcen. Keine Vorabinvestitionen nötig. Ideal für: Startups (wenig Kapital), variable Workloads, Projekte mit unklarem Ressourcenbedarf.' 
    },
    { 
      id: 'cc-27', 
      front: 'Was ist Vendor Lock-in und warum ist es problematisch?', 
      back: 'Abhängigkeit von einem Cloud-Anbieter durch proprietäre Dienste, APIs und Datenformate. Probleme: Wechsel zu anderem Anbieter wird schwierig und teuer, Preiserhöhungen schwer zu vermeiden, Abhängigkeit von Anbieter-Roadmap.' 
    },
    { 
      id: 'cc-28', 
      front: 'Wann ist On-Premises besser als Cloud?', 
      back: '• Statische Workloads (konstanter Bedarf)\n• Strenge Compliance/Datenschutz-Anforderungen\n• Datenhoheit muss gewährleistet sein\n• Niedrige Latenz kritisch\n• Vorhandene Hardware noch nicht abgeschrieben\n• Sehr hohe, konstante Auslastung' 
    },

    // ==========================================
    // PRAXISSZENARIEN
    // ==========================================
    { 
      id: 'cc-29', 
      front: 'Szenario: Start-up will kostengünstig und schnell skalieren. Welche Cloud?', 
      back: 'Public Cloud! Vorteile für Startups:\n• Keine Vorabinvestitionen (CapEx → OpEx)\n• Schnelle Skalierung bei Wachstum\n• Pay-as-you-go passt zu unsicheren Anforderungen\n• Fokus auf Produkt statt Infrastruktur' 
    },
    { 
      id: 'cc-30', 
      front: 'Szenario: Behörde mit sensiblen Bürgerdaten. Welche Cloud?', 
      back: 'Private Cloud! Gründe:\n• Volle Kontrolle über Daten\n• Compliance mit Datenschutzgesetzen\n• Keine Daten bei Drittanbietern\n• Hohe Sicherheitsanforderungen erfüllbar' 
    },
    { 
      id: 'cc-31', 
      front: 'Szenario: Krankenhaus - Patientendaten intern, E-Mail in Cloud. Welche Cloud?', 
      back: 'Hybrid Cloud! Kombination:\n• Private Cloud: Sensible Patientendaten (Compliance, DSGVO)\n• Public Cloud: E-Mail, Office-Anwendungen (kostengünstig, weniger sensibel)\n• Beste aus beiden Welten' 
    },
    { 
      id: 'cc-32', 
      front: 'Szenario: Nutzer will fertige Software im Browser nutzen. Welches Modell?', 
      back: 'SaaS (Software as a Service)! Der Nutzer:\n• Greift über Browser auf fertige Anwendung zu\n• Verwaltet nichts selbst\n• Zahlt meist Abo-Gebühr\nBeispiele: Microsoft 365, Salesforce, Google Docs' 
    },
  ],
  quizQuestions: [
    // ==========================================
    // NIST MERKMALE - Quiz
    // ==========================================
    { 
      id: 'cc-q1', 
      question: 'Welches NIST-Merkmal beschreibt, dass Ressourcen automatisch angefordert werden können, ohne manuelle Tätigkeit des Providers?', 
      options: ['Broad Network Access', 'Rapid Elasticity', 'Measured Service', 'On-Demand Self-Service'], 
      correctIndex: 3,
      explanation: 'On-Demand Self-Service ermöglicht die automatische Anforderung von Ressourcen ohne menschliche Interaktion mit dem Anbieter.'
    },
    { 
      id: 'cc-q2', 
      question: 'Welches NIST-Merkmal beschreibt das Multi-Tenant-Modell mit dynamischer Zuweisung?', 
      options: ['Resource Pooling', 'Measured Service', 'Rapid Elasticity', 'Broad Network Access'], 
      correctIndex: 0,
      explanation: 'Resource Pooling beschreibt das Multi-Tenant-Modell, bei dem Ressourcen gebündelt und mehreren Kunden dynamisch zugewiesen werden.'
    },
    { 
      id: 'cc-q3', 
      question: 'Welches NIST-Merkmal ermöglicht die automatische Messung des Ressourcenverbrauchs mit Transparenz für beide Seiten?', 
      options: ['On-Demand Self-Service', 'Measured Service', 'Resource Pooling', 'Rapid Elasticity'], 
      correctIndex: 1,
      explanation: 'Measured Service ermöglicht die automatische Messung des Ressourcenverbrauchs und schafft Transparenz für Anbieter und Nutzer.'
    },
    { 
      id: 'cc-q4', 
      question: 'Welches NIST-Merkmal beschreibt die schnelle, bedarfsgerechte Bereitstellung mit virtuell unbegrenzten Kapazitäten?', 
      options: ['Broad Network Access', 'Resource Pooling', 'Rapid Elasticity', 'Measured Service'], 
      correctIndex: 2,
      explanation: 'Rapid Elasticity ermöglicht schnelle, bedarfsgerechte Bereitstellung - für den Nutzer erscheinen die Kapazitäten virtuell unbegrenzt.'
    },
    { 
      id: 'cc-q5', 
      question: 'Welches NIST-Merkmal beschreibt den Zugriff über standardisierte Internetprotokolle?', 
      options: ['On-Demand Self-Service', 'Broad Network Access', 'Resource Pooling', 'Measured Service'], 
      correctIndex: 1,
      explanation: 'Broad Network Access beschreibt den Zugriff auf Cloud-Dienste über standardisierte Internetprotokolle von verschiedenen Endgeräten.'
    },

    // ==========================================
    // SERVICE-MODELLE - Quiz
    // ==========================================
    { 
      id: 'cc-q6', 
      question: 'Ein Entwickler möchte nur programmieren und sich nicht um Server, OS oder Middleware kümmern. Welches Service-Modell?', 
      options: ['IaaS', 'PaaS', 'SaaS', 'Private Cloud'], 
      correctIndex: 1,
      explanation: 'PaaS (Platform as a Service) ist ideal für Entwickler - sie verwalten nur den Code, der Anbieter kümmert sich um die gesamte Infrastruktur.'
    },
    { 
      id: 'cc-q7', 
      question: 'Bei welchem Service-Modell verwaltet der Kunde VMs, Netzwerke und Speicher, aber auch OS, Middleware und Apps?', 
      options: ['SaaS', 'PaaS', 'IaaS', 'Community Cloud'], 
      correctIndex: 2,
      explanation: 'Bei IaaS erhält der Kunde VMs, Netzwerke und Speicher. Er verwaltet selbst: OS, Middleware, Runtime und Anwendungen.'
    },
    { 
      id: 'cc-q8', 
      question: 'Ein Nutzer möchte fertige Software im Browser nutzen, ohne irgendetwas zu verwalten. Welches Modell?', 
      options: ['IaaS', 'PaaS', 'SaaS', 'Hybrid Cloud'], 
      correctIndex: 2,
      explanation: 'SaaS bietet fertige Anwendungen - der Kunde nutzt nur, der Anbieter verwaltet alles (Infrastruktur, Plattform, Anwendung).'
    },
    { 
      id: 'cc-q9', 
      question: 'Bei welchem Service-Modell hat der Kunde die MEISTE Verantwortung?', 
      options: ['SaaS', 'PaaS', 'IaaS', 'Alle gleich'], 
      correctIndex: 2,
      explanation: 'Bei IaaS verwaltet der Kunde am meisten selbst: OS, Middleware, Runtime, Daten und Anwendungen. Nur die Basis-Infrastruktur kommt vom Anbieter.'
    },

    // ==========================================
    // BEREITSTELLUNGSMODELLE - Quiz
    // ==========================================
    { 
      id: 'cc-q10', 
      question: 'Ein Start-up möchte kostengünstig und schnell skalieren. Welches Bereitstellungsmodell?', 
      options: ['Private Cloud', 'Public Cloud', 'Community Cloud', 'On-Premises'], 
      correctIndex: 1,
      explanation: 'Public Cloud ist ideal für Startups: Kostengünstig durch geteilte Ressourcen, keine Vorabinvestitionen, schnelle Skalierung möglich.'
    },
    { 
      id: 'cc-q11', 
      question: 'Eine Behörde muss sensible Bürgerdaten speichern und volle Kontrolle behalten. Welches Modell?', 
      options: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Community Cloud'], 
      correctIndex: 1,
      explanation: 'Private Cloud bietet exklusive Nutzung, volle Kontrolle und hohe Sicherheit - ideal für sensible Behördendaten.'
    },
    { 
      id: 'cc-q12', 
      question: 'Ein Krankenhaus möchte Patientendaten intern halten, aber E-Mail in der Cloud nutzen. Welches Modell?', 
      options: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Community Cloud'], 
      correctIndex: 2,
      explanation: 'Hybrid Cloud kombiniert Private (sensible Patientendaten) und Public Cloud (E-Mail) - das Beste aus beiden Welten.'
    },
    { 
      id: 'cc-q13', 
      question: 'Mehrere Krankenhäuser wollen eine gemeinsame Cloud mit gleichen Compliance-Anforderungen nutzen. Welches Modell?', 
      options: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Community Cloud'], 
      correctIndex: 3,
      explanation: 'Community Cloud wird von mehreren Organisationen mit gemeinsamen Interessen (hier: Gesundheitswesen, Compliance) geteilt.'
    },

    // ==========================================
    // WORKLOAD-TYPEN - Quiz
    // ==========================================
    { 
      id: 'cc-q14', 
      question: 'Welcher Workload-Typ ist UNGEEIGNET für Cloud Computing?', 
      options: ['Periodisch (Typ B)', 'Einmalig/Selten (Typ C)', 'Statisch (Typ A)', 'Zufällig (Typ D)'], 
      correctIndex: 2,
      explanation: 'Statische Workloads (Typ A) haben konstante Ressourcennutzung ohne Schwankungen - keine Elastizität nötig, On-Premises oft günstiger.'
    },
    { 
      id: 'cc-q15', 
      question: 'Welcher Workload-Typ hat das höchste Peak-to-Average Ratio und ist EXTREM Cloud-geeignet?', 
      options: ['Statisch (Typ A)', 'Periodisch (Typ B)', 'Einmalig/Selten (Typ C)', 'Kontinuierlich wachsend (Typ E)'], 
      correctIndex: 2,
      explanation: 'Einmalige/Seltene Workloads (Typ C) haben das höchste p/a Ratio - massive Spitze bei sonst keiner Nutzung. Ideal für Cloud!'
    },
    { 
      id: 'cc-q16', 
      question: 'Ein Online-Shop erwartet jedes Jahr massive Lastspitzen am Black Friday. Welcher Workload-Typ?', 
      options: ['Statisch (Typ A)', 'Periodisch (Typ B)', 'Einmalig (Typ C)', 'Zufällig (Typ D)'], 
      correctIndex: 1,
      explanation: 'Black Friday ist ein regelmäßig wiederkehrendes Event - ein periodischer Workload (Typ B) mit planbaren Lastspitzen.'
    },
    { 
      id: 'cc-q17', 
      question: 'Bei welchem Workload-Typ ist Auto-Scaling besonders wichtig?', 
      options: ['Statisch (Typ A)', 'Periodisch (Typ B)', 'Kontinuierlich sinkend (Typ F)', 'Zufällig/Unvorhersehbar (Typ D)'], 
      correctIndex: 3,
      explanation: 'Bei zufälligen/unvorhersehbaren Workloads (Typ D) ist Automatisierung (Auto-Scaling) besonders wichtig, da Spitzen nicht planbar sind.'
    },

    // ==========================================
    // PEAK-TO-AVERAGE & WIRTSCHAFT - Quiz
    // ==========================================
    { 
      id: 'cc-q18', 
      question: 'Wann ist Cloud Computing laut Peak-to-Average Ratio sinnvoll?', 
      options: ['Wenn p/a < c/d', 'Wenn p/a > c/d', 'Wenn p/a = 1', 'Wenn p/a = 0'], 
      correctIndex: 1,
      explanation: 'Cloud ist sinnvoll wenn p/a > c/d (Peak-to-Average > Cloud-Kosten/Datacenter-Kosten). Je höher die Lastschwankung, desto besser für Cloud.'
    },
    { 
      id: 'cc-q19', 
      question: 'Welcher Vorteil von Cloud Computing ist für Startups mit wenig Kapital besonders wichtig?', 
      options: ['Höhere Sicherheit', 'Keine Vorabinvestitionen (CapEx → OpEx)', 'Bessere Performance', 'Mehr Kontrolle'], 
      correctIndex: 1,
      explanation: 'Pay-as-you-go eliminiert hohe Anfangsinvestitionen und wandelt CapEx in OpEx um - ideal für Startups mit begrenztem Kapital.'
    },
    { 
      id: 'cc-q20', 
      question: 'Was ist ein Hauptrisiko bei der Nutzung proprietärer Cloud-Dienste?', 
      options: ['Höhere Sicherheit', 'Vendor Lock-in', 'Zu viel Kontrolle', 'Zu niedrige Kosten'], 
      correctIndex: 1,
      explanation: 'Vendor Lock-in entsteht durch Abhängigkeit von proprietären Diensten und APIs - ein Anbieterwechsel wird schwierig und teuer.'
    },
    { 
      id: 'cc-q21', 
      question: 'Wann ist On-Premises besser als Cloud?', 
      options: [
        'Bei variablen Workloads mit Lastspitzen', 
        'Bei statischen Workloads und strengen Compliance-Anforderungen', 
        'Für Startups ohne Kapital', 
        'Bei einmaligen Projekten'
      ], 
      correctIndex: 1,
      explanation: 'On-Premises ist besser bei statischen Workloads (konstanter Bedarf), strengen Compliance-Anforderungen und wenn Datenhoheit kritisch ist.'
    },

    // ==========================================
    // GEMISCHTE SZENARIEN - Quiz
    // ==========================================
    { 
      id: 'cc-q22', 
      question: 'Ein Unternehmen führt einmalig eine große Datenmigration durch. Welcher Workload-Typ und wie Cloud-geeignet?', 
      options: [
        'Statisch - UNGEEIGNET', 
        'Periodisch - GUT geeignet', 
        'Einmalig - EXTREM geeignet', 
        'Kontinuierlich wachsend - MITTEL'
      ], 
      correctIndex: 2,
      explanation: 'Eine einmalige Datenmigration ist ein "Once-in-a-lifetime" Workload (Typ C) - EXTREM Cloud-geeignet, da Ressourcen nur temporär benötigt werden.'
    },
    { 
      id: 'cc-q23', 
      question: 'Welche Aussage über die NIST Service-Modelle ist KORREKT?', 
      options: [
        'Bei SaaS verwaltet der Kunde das Betriebssystem', 
        'Bei IaaS verwaltet der Anbieter die Anwendungen', 
        'Bei PaaS verwaltet der Kunde nur den Code', 
        'Bei allen Modellen hat der Kunde gleich viel Verantwortung'
      ], 
      correctIndex: 2,
      explanation: 'Bei PaaS verwaltet der Kunde nur den Code/die Anwendung. Der Anbieter kümmert sich um Runtime, Middleware, OS und Infrastruktur.'
    },
    { 
      id: 'cc-q24', 
      question: 'Welche Kombination beschreibt die Public Cloud am besten?', 
      options: [
        'Drittanbieter, öffentlich, kostengünstig', 
        'Eine Organisation, eigene Server, hohe Sicherheit', 
        'Mehrere Organisationen, gemeinsame Interessen', 
        'Kombination aus Private und Public'
      ], 
      correctIndex: 0,
      explanation: 'Public Cloud wird von Drittanbietern bereitgestellt, ist öffentlich zugänglich und kostengünstig durch geteilte Ressourcen.'
    },
  ],
};
