// cv-data.js — Single source of truth per il CV
// Per aggiungere una sezione: aggiungi un oggetto all'array "sections"
// Tipi supportati: "text", "timeline", "projects", "tags", "repos"

const CV_DATA = {
    meta: {
        name: "Tommaso Patriti",
        title: { it: "Software Engineer Freelance - sistemi distribuiti, cloud e AI", en: "Freelance Software Engineer - distributed systems, cloud and AI" },
        location: "Bologna, Italia",
        phone: "+39 392 075 2599",
        email: "tommasopatriti@gmail.com",
        pec: "tommaso.patriti@ingpec.eu",
        github: "github.com/Ro0t-set",
        linkedin: "linkedin.com/in/tommaso-patriti",
        website: "tommasopatriti.me",
        vat: "P.IVA 04291431205"
    },

    sections: [
        {
            key: "about",
            label: { it: "Chi sono", en: "About me" },
            type: "text",
            content: {
                it: "Sono un ingegnere informatico e costruisco prodotti software production-grade tra backend, cloud, mobile e AI. Mi occupo di microservizi, API, data pipeline, autenticazione, osservabilità e automazioni, con un gusto preciso per architetture semplici quando il dominio è complesso.",
                en: "I am a computer engineer building production-grade software products across backend, cloud, mobile and AI. I work on microservices, APIs, data pipelines, authentication, observability and automation, with a strong preference for simple architectures around complex domains."
            }
        },
        {
            key: "experience",
            label: { it: "Esperienza", en: "Experience" },
            type: "timeline",
            items: [
                {
                    date: { it: "Gen 2025 — Presente", en: "Jan 2025 — Present" },
                    title: { it: "Software Engineer Freelance", en: "Freelance Software Engineer" },
                    company: "Bologna, Italia",
                    description: { it: "Progettazione end-to-end di prodotti software: backend, frontend, mobile, infrastrutture cloud, automazioni AI/ML, sistemi di autenticazione e integrazioni B2B.", en: "End-to-end software product design: backend, frontend, mobile, cloud infrastructure, AI/ML automation, authentication systems and B2B integrations." }
                },
                {
                    date: { it: "Mag 2025 — Apr 2026", en: "May 2025 — Apr 2026" },
                    title: { it: "Collaboratore di ricerca", en: "Research Collaborator" },
                    company: { it: "Università di Bologna — CIRI ICT", en: "University of Bologna — CIRI ICT" },
                    description: { it: "Progetto di ricerca industriale strategica DISCOV.ER (PR FESR 2021-2027). Sviluppo di pipeline dati e modelli previsionali per dati ambientali con Python, Pandas/NumPy, PyTorch/Darts, FastAPI, scheduler e validazione su dataset del Parco del Delta del Po.", en: "Strategic industrial research project DISCOV.ER (PR FESR 2021-2027). Development of data pipelines and forecasting models for environmental data with Python, Pandas/NumPy, PyTorch/Darts, FastAPI, schedulers and validation on Po Delta Park datasets." },
                    logo: "assets/logos/unibo.png"
                },
                {
                    date: { it: "Lug 2024 — Nov 2024", en: "Jul 2024 — Nov 2024" },
                    title: { it: "Cloud Engineer — Tirocinio", en: "Cloud Engineer — Internship" },
                    company: "Dallara Automobili",
                    description: { it: "Sistema Simulation as a Service a microservizi per workload di simulazione. Studio e prototipazione di autoscaling Kubernetes con KEDA e Prometheus, backend in Go e principi di clean architecture.", en: "Microservices-based Simulation as a Service for simulation workloads. Research and prototyping of Kubernetes autoscaling with KEDA and Prometheus, Go backend and clean architecture principles." },
                    logo: "assets/logos/dallara.svg"
                },
                {
                    date: { it: "Nov 2023 — Nov 2024", en: "Nov 2023 — Nov 2024" },
                    title: { it: "Tutor Universitario", en: "University Tutor" },
                    company: { it: "Università di Bologna", en: "University of Bologna" },
                    description: { it: "Supporto alla didattica per studenti con DSA.", en: "Teaching support for students with learning disabilities." },
                    logo: "assets/logos/unibo.png"
                }
            ]
        },
        {
            key: "education",
            label: { it: "Formazione", en: "Education" },
            type: "timeline",
            items: [
                {
                    date: "2022 — 2025",
                    title: { it: "Laurea Magistrale in Ingegneria e Scienze Informatiche", en: "Master's Degree in Computer Science and Engineering" },
                    company: { it: "Università di Bologna — 110L", en: "University of Bologna — 110L" },
                    description: { it: "Focus su sistemi distribuiti, architetture software, machine learning. Tesi su simulazioni cloud distribuite.", en: "Focus on distributed systems, software architecture, machine learning. Thesis on distributed cloud simulations." },
                    links: [
                        { label: { it: "Tesi magistrale", en: "Master's thesis" }, url: "https://amslaurea.unibo.it/id/eprint/34457/" }
                    ]
                },
                {
                    date: "2023",
                    title: { it: "Erasmus+ — Master in Data Science", en: "Erasmus+ — Master's in Data Science" },
                    company: "UPC Barcelona",
                    description: { it: "Business Intelligence, Data Mining, Cybersecurity.", en: "Business Intelligence, Data Mining, Cybersecurity." }
                },
                {
                    date: "2019 — 2022",
                    title: { it: "Laurea Triennale in Ingegneria e Scienze Informatiche", en: "Bachelor's Degree in Computer Science and Engineering" },
                    company: { it: "Università di Bologna — 103", en: "University of Bologna — 103" },
                    description: { it: "Tesi su LoRa Mesh per comunicazione IoT. Pubblicazione IEEE CCNC 2023.", en: "Thesis on LoRa Mesh for IoT communication. IEEE CCNC 2023 publication." },
                    links: [
                        { label: { it: "Tesi triennale", en: "Bachelor's thesis" }, url: "https://amslaurea.unibo.it/id/eprint/26462/" }
                    ]
                }
            ]
        },
        {
            key: "freelance",
            label: { it: "Progetti Freelance", en: "Freelance Projects" },
            type: "projects",
            items: [
                {
                    date: { it: "Apr 2026 — Presente", en: "Apr 2026 — Present" },
                    title: { it: "Sviluppatore Android", en: "Android Developer" },
                    client: "IDEM Srl",
                    description: { it: "Sviluppo Android in Kotlin/Java con integrazione RabbitMQ, architettura esagonale e lavoro in Scrum.", en: "Android development in Kotlin/Java with RabbitMQ integration, hexagonal architecture and Scrum delivery." },
                    logo: "assets/logos/idem.png",
                    tech: ["Android SDK", "Kotlin", "Java", "RabbitMQ", { it: "Architettura Esagonale", en: "Hexagonal Architecture" }, "Scrum"]
                },
                {
                    date: "2026",
                    title: { it: "Sito web content-driven e CMS", en: "Content-driven website and CMS" },
                    client: { it: "Presa B+ — Palestra Boulder", en: "Presa B+ — Bouldering Gym" },
                    description: { it: "Sito web performante per palestra boulder con architettura Astro content-driven, componenti React mirati, Tailwind CSS, CMS Keystatic, contenuti Markdoc, integrazione Cloudflare e attenzione a SEO, internazionalizzazione e gestione editoriale.", en: "High-performance website for a bouldering gym with content-driven Astro architecture, targeted React components, Tailwind CSS, Keystatic CMS, Markdoc content, Cloudflare integration and a strong focus on SEO, internationalization and editorial workflows." },
                    tech: ["Astro 5", "TypeScript", "React", "Tailwind CSS", "Keystatic CMS", "Markdoc", "Cloudflare", "D3 Delaunay", "SEO", "i18n"],
                    logo: "assets/logos/presabpiu.svg"
                },
                {
                    date: { it: "Gen 2026 — Presente", en: "Jan 2026 — Present" },
                    title: "AgriMercati",
                    client: { it: "AgriMercati — Fondatore", en: "AgriMercati — Founder" },
                    description: { it: "Piattaforma per acquisire, normalizzare e distribuire prezzi delle commodity agricole italiane. Backend FastAPI con API Swagger/OpenAPI, scraping multi-mercato, download e deduplica PDF, parsing algoritmico con pdfplumber/Tesseract, fallback LLM OpenAI/Anthropic/Gemini, validazione automatica, tassonomia prodotti, scheduler APScheduler, dashboard e app mobile iOS/Android.", en: "Platform for acquiring, normalizing and distributing Italian agricultural commodity prices. FastAPI backend with Swagger/OpenAPI APIs, multi-market scraping, PDF download and deduplication, algorithmic parsing with pdfplumber/Tesseract, OpenAI/Anthropic/Gemini LLM fallback, automatic validation, product taxonomy, APScheduler jobs, dashboard and iOS/Android mobile app." },
                    tech: ["FastAPI", "TypeScript", "Python", "SQLAlchemy", "pdfplumber", "Tesseract OCR", "Selenium", "OpenAI API", "Anthropic Claude", "Gemini", "APScheduler", "Swagger/OpenAPI"],
                    logo: "assets/logos/agrimercati.png"
                },
                {
                    date: { it: "Nov 2025 — Feb 2026", en: "Nov 2025 — Feb 2026" },
                    title: { it: "Client Web Angular", en: "Angular Web Client" },
                    client: "Nowhere Solutions & Web",
                    description: { it: "Progettazione e sviluppo di client web Angular production-ready per dashboard operative e flussi utente complessi, con integrazione Keycloak, component library PrimeNG, grafici Chart.js, routing, form reattivi e build Docker/Traefik in ambiente multi-servizio.", en: "Design and development of production-ready Angular web clients for operational dashboards and complex user flows, with Keycloak integration, PrimeNG component library, Chart.js charts, routing, reactive forms and Docker/Traefik builds in a multi-service environment." },
                    tech: ["Angular 20", "TypeScript", "PrimeNG", "Keycloak", "RxJS", "Chart.js", "Tailwind CSS", "Docker", "Traefik", "PostgreSQL"],
                    logo: "assets/logos/nowhere.png"
                },
                {
                    date: { it: "Ago 2025 — Dic 2025", en: "Aug 2025 — Dec 2025" },
                    title: "React Frontend",
                    client: { it: "Università di Bologna", en: "University of Bologna" },
                    description: { it: "Frontend React per una piattaforma universitaria di prevenzione dell'abbandono basata su analytics predittivi. Implementazione di dashboard, viste dati, componenti riusabili, integrazione API, gestione stato e UX orientata al supporto decisionale.", en: "React frontend for a university dropout-prevention platform based on predictive analytics. Implemented dashboards, data views, reusable components, API integration, state management and decision-support UX." },
                    tech: ["React", "TypeScript", "Vite", "REST API", "Dashboard", "Data Visualization", "UX", "State Management"],
                    logo: "assets/logos/unibo.png"
                },
                {
                    date: { it: "Mag 2025 — Presente", en: "May 2025 — Present" },
                    title: "Elaria",
                    client: "Elaria",
                    description: { it: "Gestione dell'architettura a microservizi e dell'orchestrazione cloud per un gestionale modulare. Deploy Docker Swarm con reverse proxy Traefik, identity provider Keycloak, messaging RabbitMQ, servizi Spring Boot, osservabilità Grafana e procedure operative per ambienti production-like.", en: "Management of microservices architecture and cloud orchestration for a modular management platform. Docker Swarm deployment with Traefik reverse proxy, Keycloak identity provider, RabbitMQ messaging, Spring Boot services, Grafana observability and operational procedures for production-like environments." },
                    tech: ["Spring Boot", "Docker Swarm", "Traefik", "Keycloak", "RabbitMQ", "Grafana", "PostgreSQL", "CI/CD", "Observability"],
                    logo: "assets/logos/elaria.png"
                },
                {
                    date: { it: "Mag 2025 — Apr 2026", en: "May 2025 — Apr 2026" },
                    title: "Discov.er",
                    client: { it: "Università di Bologna — Progetto FESR", en: "University of Bologna — FESR Project" },
                    description: { it: "Pipeline ML per simulazione e previsione di dati ambientali nel progetto DISCOV.ER. API FastAPI con autenticazione via API key, ingestion schedulata, training/prediction service, storage SQLite/SQLAlchemy, deployment systemd su Debian e stack scientifico Pandas, NumPy, PyTorch/Darts, SciPy e UTide.", en: "ML pipeline for environmental-data simulation and forecasting in the DISCOV.ER project. FastAPI API with API-key authentication, scheduled ingestion, training/prediction services, SQLite/SQLAlchemy storage, systemd deployment on Debian and scientific stack with Pandas, NumPy, PyTorch/Darts, SciPy and UTide." },
                    tech: ["FastAPI", "Python", "PyTorch", "Darts", "Pandas", "NumPy", "SQLAlchemy", "APScheduler", "systemd", "Debian", "API Gateway", "ML Forecasting"],
                    logo: "assets/logos/unibo.png"
                }
            ]
        },
        {
            key: "coursework",
            label: { it: "Coursework", en: "Coursework" },
            type: "tags",
            categories: [
                { label: { it: "Magistrale", en: "Graduate" }, tags: ["Software Process Engineering", "Distributed Systems", "Software Architectures", "Concurrent Programming", "Cybersecurity", "Machine Learning", "Web Programming"] },
                { label: { it: "Triennale", en: "Undergraduate" }, tags: ["Algorithms", "Data Structures", "Operating Systems", "Object Oriented Programming", "Software Engineering", "Mobile Programming", "Embedded Systems", "IoT"] }
            ]
        },
        {
            key: "techstack",
            label: { it: "Stack Tecnologico", en: "Tech Stack" },
            type: "tags",
            categories: [
                { label: { it: "Linguaggi", en: "Languages" }, tags: ["Java", "Kotlin", "Go", "Python", "Scala", "TypeScript", "JavaScript", "C++", "Dart"] },
                { label: "Backend", tags: ["Spring Boot", "FastAPI", "Micronaut", "Quarkus", "Node.js", "NestJS", "REST API", "OpenAPI", "JPA/Hibernate", "SQLAlchemy"] },
                { label: { it: "Frontend e Mobile", en: "Frontend & Mobile" }, tags: ["React", "Angular", "Vue.js", "Astro", "Vite", "Tailwind CSS", "PrimeNG", "Flutter", "Android SDK", "Riverpod"] },
                { label: { it: "Cloud e DevOps", en: "Cloud & DevOps" }, tags: ["Docker", "Kubernetes", "Docker Swarm", "DigitalOcean", "Cloudflare", "GitHub Actions", "Terraform", "KEDA", "systemd"] },
                { label: { it: "Dati e AI", en: "Data & AI" }, tags: ["Machine Learning", "PyTorch", "Darts", "LLM", "OCR", "Tesseract", "pdfplumber", "Pandas", "NumPy", "Data Pipeline", "PostgreSQL", "SQLite", "Redis"] },
                { label: { it: "Architetture", en: "Architecture" }, tags: [{ it: "Microservizi", en: "Microservices" }, { it: "Sistemi distribuiti", en: "Distributed Systems" }, "Event-driven", "RabbitMQ", "Kafka", "Keycloak", "Traefik", "Prometheus", "Grafana", "API Gateway"] },
                { label: { it: "Qualità", en: "Quality" }, tags: ["TDD", "BDD", "JUnit 5", "Cucumber", "CI/CD", "Clean Architecture", "Hexagonal Architecture", "Observability"] }
            ]
        },
        {
            key: "languages",
            label: { it: "Lingue", en: "Languages" },
            type: "tags",
            categories: [
                { label: { it: "Lingue", en: "Languages" }, tags: [{ it: "Italiano: madrelingua", en: "Italian: native" }, { it: "Inglese: B2", en: "English: B2" }] }
            ]
        },
        {
            key: "opensource",
            label: { it: "Open Source", en: "Open Source" },
            type: "repos",
            items: [
                { name: "piper-kt", lang: "Kotlin", description: { it: "App chat microservizi", en: "Microservices chat app" }, stars: 13 },
                { name: "piperchat", lang: "TypeScript", description: { it: "Chat con WebRTC", en: "Chat with WebRTC" }, stars: 16 },
                { name: "Jhaturanga", lang: "Java", description: { it: "Gioco di scacchi", en: "Chess game" }, stars: 10 },
                { name: "ScafiWeb3", lang: "Scala", description: { it: "Framework 3D aggregato", en: "3D aggregate framework" }, stars: 8 }
            ]
        }
    ]
};
