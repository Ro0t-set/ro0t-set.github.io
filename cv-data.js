// cv-data.js — Single source of truth per il CV
// Per aggiungere una sezione: aggiungi un oggetto all'array "sections"
// Tipi supportati: "text", "timeline", "projects", "tags", "repos"

const CV_DATA = {
    meta: {
        name: "Tommaso Patriti",
        title: { it: "Software Engineer Freelance", en: "Freelance Software Engineer" },
        location: "Bologna, Italia",
        phone: "+39 392 075 2599",
        email: "tommasopatriti@gmail.com",
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
                it: "Ingegnere informatico con la passione per il codice pulito ed elegante. Mi occupo di sistemi distribuiti e microservizi, trasformando architetture over-engineered in soluzioni semplici e manutenibili. La semplicità non è solo un obiettivo, è una filosofia.",
                en: "Computer Engineer passionate about clean and elegant code. I work with distributed systems and microservices, transforming over-engineered architectures into simple, maintainable solutions. Simplicity isn't just a goal, it's a philosophy."
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
                    description: { it: "Progettazione e sviluppo di architetture microservizi, sistemi distribuiti e soluzioni cloud-native.", en: "Design and development of microservices architectures, distributed systems and cloud-native solutions." }
                },
                {
                    date: { it: "Mag 2025 — Presente", en: "May 2025 — Present" },
                    title: { it: "Collaboratore di ricerca", en: "Research Collaborator" },
                    company: { it: "Università di Bologna — CIRI ICT", en: "University of Bologna — CIRI ICT" },
                    description: { it: "Progetto di ricerca industriale strategica DISCOV.ER (PR FESR 2021–2027). Sviluppo di modelli di simulazione e predizione di dati ambientali mediante tecniche AI, validazione su dataset del Parco del Delta del Po, integrazione in piattaforma Digital Twin.", en: "Strategic industrial research project DISCOV.ER (PR FESR 2021–2027). Development of AI simulation and prediction models for environmental data, validation on Po Delta Park datasets, Digital Twin platform integration." }
                },
                {
                    date: { it: "Lug 2024 — Nov 2024", en: "Jul 2024 — Nov 2024" },
                    title: { it: "Cloud Engineer — Tirocinio", en: "Cloud Engineer — Internship" },
                    company: "Dallara Automobili",
                    description: { it: "Sistema Simulation as a Service con architettura microservizi. Autoscaling con KEDA, Prometheus e Kubernetes. Backend in Golang.", en: "Simulation as a Service system with microservices architecture. Autoscaling with KEDA, Prometheus and Kubernetes. Backend in Golang." }
                },
                {
                    date: { it: "Nov 2023 — Nov 2024", en: "Nov 2023 — Nov 2024" },
                    title: { it: "Tutor Universitario", en: "University Tutor" },
                    company: { it: "Università di Bologna", en: "University of Bologna" },
                    description: { it: "Supporto alla didattica per studenti con DSA.", en: "Teaching support for students with learning disabilities." }
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
                    description: { it: "Focus su sistemi distribuiti, architetture software, machine learning. Tesi su simulazioni cloud distribuite.", en: "Focus on distributed systems, software architecture, machine learning. Thesis on distributed cloud simulations." }
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
                    description: { it: "Tesi su LoRa Mesh per comunicazione IoT. Pubblicazione IEEE CCNC 2023.", en: "Thesis on LoRa Mesh for IoT communication. IEEE CCNC 2023 publication." }
                }
            ]
        },
        {
            key: "freelance",
            label: { it: "Progetti Freelance", en: "Freelance Projects" },
            type: "projects",
            items: [
                {
                    date: { it: "Gen 2026 — Presente", en: "Jan 2026 — Present" },
                    title: "AgriMercati",
                    client: { it: "AgriMercati — Fondatore", en: "AgriMercati — Founder" },
                    description: { it: "Piattaforma digitale per l'aggregazione, normalizzazione e distribuzione dei prezzi delle commodity agricole italiane. Pipeline di acquisizione dati con OCR basato su AI, app mobile multipiattaforma (iOS/Android) e assistente conversazionale LLM per l'analisi delle dinamiche di prezzo. Infrastruttura con protezione anti-scraping/DDoS e API B2B.", en: "Digital platform for aggregation, normalization and distribution of Italian agricultural commodity prices. Data acquisition pipeline with AI-based OCR, cross-platform mobile app (iOS/Android) and LLM-based conversational assistant for price dynamics analysis. Infrastructure with anti-scraping/DDoS protection and B2B API." },
                    tech: ["OCR / AI", "LLM", "Mobile App", "API B2B", "Anti-DDoS", "Data Pipeline"]
                },
                {
                    date: { it: "Nov 2025 — Feb 2026", en: "Nov 2025 — Feb 2026" },
                    title: { it: "Client Web Angular", en: "Angular Web Client" },
                    client: "Nowhere Solutions & Web",
                    description: { it: "Progettazione e sviluppo di un client web production-ready Angular, con le stesse funzionalità di un'applicazione mobile esistente.", en: "Design and development of a production-ready Angular web client, with the same features as an existing mobile application." },
                    tech: ["Angular", "TypeScript", "Frontend"]
                },
                {
                    date: { it: "Ago 2025 — Dic 2025", en: "Aug 2025 — Dec 2025" },
                    title: "React Frontend",
                    client: { it: "Università di Bologna", en: "University of Bologna" },
                    description: { it: "Sviluppo del frontend React per una piattaforma per la prevenzione dell'abbandono universitario basata su analisi predittive e sistemi di supporto agli studenti.", en: "React frontend development for a platform preventing university dropout based on predictive analytics and student support systems." },
                    tech: ["React", "TypeScript", "Frontend"]
                },
                {
                    date: { it: "Mag 2025 — Presente", en: "May 2025 — Present" },
                    title: "Elaria",
                    client: "Elaria",
                    description: { it: "Gestione completa dell'architettura a microservizi e dell'orchestrazione cloud. Infrastruttura basata su Spring Boot e Docker Swarm per un gestionale altamente modulare, scalabile ed espandibile.", en: "Full management of microservices architecture and cloud orchestration. Infrastructure based on Spring Boot and Docker Swarm for a highly modular, scalable and expandable management system." },
                    tech: ["Spring Boot", "Docker Swarm", "Traefik", "Keycloak", "RabbitMQ", "Grafana"]
                },
                {
                    date: { it: "Mag 2025 — Presente", en: "May 2025 — Present" },
                    title: "Discov.er",
                    client: { it: "Università di Bologna — Progetto FESR", en: "University of Bologna — FESR Project" },
                    description: { it: "Progetto di ricerca industriale strategica DISCOV.ER (PR FESR 2021–2027). Sviluppo di modelli di simulazione e previsione di dati ambientali con tecniche di AI e Machine Learning.", en: "Strategic industrial research project DISCOV.ER (PR FESR 2021–2027). Development of simulation and prediction models for environmental data using AI and Machine Learning techniques." },
                    tech: ["AI", "Machine Learning", "Python"]
                }
            ]
        },
        {
            key: "techstack",
            label: { it: "Stack Tecnologico", en: "Tech Stack" },
            type: "tags",
            categories: [
                { label: { it: "Linguaggi", en: "Languages" }, tags: ["Java", "Kotlin", "Go", "Python", "Scala", "TypeScript"] },
                { label: { it: "Framework", en: "Frameworks" }, tags: ["Spring Boot", "Micronaut", "Node.js", "Vue.js", "React"] },
                { label: "DevOps", tags: ["Docker", "Kubernetes", "Docker Swarm", "Traefik", "GitHub Actions"] }
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
