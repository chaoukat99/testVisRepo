-- AI-Synergy-Hub: Backend Database Schema
-- Matches Front-end Logic 100% (Companies, Consultants, Missions)
-- Compatible with MySQL / MariaDB

-- ==========================================
-- 0. REGISTRATION REQUESTS (ADMIN VERIFICATION)
-- ==========================================

-- Companies waiting for admin approval
CREATE TABLE company_registration_requests (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    legal_form VARCHAR(50) NOT NULL,
    siret VARCHAR(20),
    main_sector VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    
    -- Main Contact
    contact_first_name VARCHAR(100) NOT NULL,
    contact_last_name VARCHAR(100) NOT NULL,
    contact_position VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Store multi-select preferences as JSON during the request phase
    -- Includes: contact_preferences, mission_types, work_modes, target_zones
    preferences_json JSON,
    
    password_hash TEXT NOT NULL,
    
    -- Admin Status
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consultants waiting for admin approval
CREATE TABLE consultant_registration_requests (
    id VARCHAR(36) PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email_professionnel VARCHAR(255) NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- Expertise & Profile Data
    profile_data_json JSON, -- Stores all professional data, experiences, and preferences in JSON format
    
    -- Admin Status
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 1. COMPANIES (ACTIVE)
-- ==========================================

CREATE TABLE companies (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    legal_form VARCHAR(50) NOT NULL, -- SA, SARL, SAS, etc.
    siret VARCHAR(20),
    main_sector VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) NOT NULL, -- 1-10, 11-50, etc.
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    
    -- Main Contact Info
    contact_first_name VARCHAR(100) NOT NULL,
    contact_last_name VARCHAR(100) NOT NULL,
    contact_position VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Account Settings
    password_hash TEXT NOT NULL,
    account_language VARCHAR(10) DEFAULT 'FR',
    consulting_frequency VARCHAR(100), -- Occasionnel, Régulier, etc.
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Active' -- Active, Suspended
);

-- Multi-select join tables for Company Preferences
CREATE TABLE company_contact_preferences (
    company_id VARCHAR(36),
    preference VARCHAR(50), -- Email, Téléphone, Visio, WhatsApp
    PRIMARY KEY (company_id, preference),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE company_mission_types (
    company_id VARCHAR(36),
    mission_type VARCHAR(100), -- Stratégie, Data/IA, IT & Dév, etc.
    PRIMARY KEY (company_id, mission_type),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE company_work_modes (
    company_id VARCHAR(36),
    work_mode VARCHAR(50), -- 100% remote, Hybride, etc.
    PRIMARY KEY (company_id, work_mode),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE company_target_zones (
    company_id VARCHAR(36),
    target_zone VARCHAR(100), -- Maroc, France, Europe, etc.
    PRIMARY KEY (company_id, target_zone),
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);


-- ==========================================
-- 2. CONSULTANTS & PROFILES
-- ==========================================

CREATE TABLE consultants (
    id VARCHAR(36) PRIMARY KEY,
    prenom VARCHAR(100) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    email_professionnel VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    photo_profil_url TEXT,
    
    -- Localization
    pays_residence VARCHAR(100),
    ville VARCHAR(100),
    adresse_complete TEXT,
    
    -- Professional Info
    statut_professionnel VARCHAR(100), -- Freelance, Auto-entrepreneur, etc.
    annee_debut_activite INTEGER,
    site_web TEXT,
    linkedin TEXT,
    identifiant_fiscal VARCHAR(50),
    
    -- Expertise
    domaine VARCHAR(100),
    metier VARCHAR(100),
    domaine_autre TEXT,
    experience_totale VARCHAR(50), -- 0-3, 3-7, 7-15, 15+
    cv_url TEXT,
    
    -- Availability & Pricing
    disponibilite_actuelle VARCHAR(100), -- Disponible immédiatement, etc.
    date_disponibilite DATE,
    charge_disponible VARCHAR(50), -- 1 j/semaine, Temps plein, etc.
    mode_travail_prefere VARCHAR(50), -- Remote, Hybride, Sur site
    tjm DECIMAL(10, 2),
    tjm_min DECIMAL(10, 2),
    tjm_max DECIMAL(10, 2),
    
    -- Privacy & Permissions
    is_profil_public BOOLEAN DEFAULT TRUE,
    is_matching_ia_authorized BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'Active', -- Active, Suspended
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Multi-select join tables for Consultant Expertise (Matching JSON/Mission structure)
CREATE TABLE consultant_outils (
    consultant_id VARCHAR(36),
    outil VARCHAR(100),
    PRIMARY KEY (consultant_id, outil),
    FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE
);

CREATE TABLE consultant_competences_cles (
    consultant_id VARCHAR(36),
    competence VARCHAR(100),
    PRIMARY KEY (consultant_id, competence),
    FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE
);

CREATE TABLE consultant_experiences (
    id VARCHAR(36) PRIMARY KEY,
    consultant_id VARCHAR(36),
    titre_mission VARCHAR(255) NOT NULL,
    client VARCHAR(255),
    secteur VARCHAR(100),
    description_courte TEXT,
    resultats_livrables TEXT,
    competences_utilisees TEXT,
    date_debut DATE,
    date_fin DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE
);


-- ==========================================
-- 3. MISSIONS (POSTED BY COMPANIES)
-- ==========================================

CREATE TABLE missions (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36),
    
    -- Step A: General Info
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Step B: Profile Required
    selected_domain VARCHAR(100) NOT NULL,
    selected_job VARCHAR(100) NOT NULL,
    seniority_level VARCHAR(50), -- Junior, Confirmé, Senior, Expert
    min_experience_category VARCHAR(50), -- 0–2 ans, 2–5 ans, etc.
    
    -- Step C: Logistics
    location VARCHAR(255) NOT NULL,
    work_mode VARCHAR(50) NOT NULL, -- Remote, Hybride, Sur site
    start_date DATE NOT NULL,
    estimated_duration VARCHAR(100) NOT NULL, -- e.g. "6 mois"
    workload VARCHAR(100) NOT NULL, -- e.g. "3 jours par semaine"
    
    -- Step D: Budget & Contract
    remuneration_type VARCHAR(50), -- TJM, Forfait global, etc.
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    contract_type VARCHAR(100) NOT NULL,
    billing_mode VARCHAR(100) NOT NULL,
    
    -- Step E: Selection
    num_consultants_preselect VARCHAR(50), -- 3, 5, 10, 20+
    deadline DATE NOT NULL,
    
    -- Step F: Visibility
    visibility_mode VARCHAR(50) DEFAULT 'Publique', -- Publique, Privée
    is_company_name_visible BOOLEAN DEFAULT TRUE,
    require_nda BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'Published', -- Draft, Published, Closed
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Multi-select join tables for Mission Requirements
CREATE TABLE mission_consultant_types (
    mission_id VARCHAR(36),
    consultant_type VARCHAR(100),
    PRIMARY KEY (mission_id, consultant_type),
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

CREATE TABLE mission_technical_skills (
    mission_id VARCHAR(36),
    skill VARCHAR(100),
    PRIMARY KEY (mission_id, skill),
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

CREATE TABLE mission_business_skills (
    mission_id VARCHAR(36),
    skill VARCHAR(100),
    PRIMARY KEY (mission_id, skill),
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

CREATE TABLE mission_required_docs (
    mission_id VARCHAR(36),
    doc_type VARCHAR(100),
    PRIMARY KEY (mission_id, doc_type),
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);


-- ==========================================
-- 4. SAVED SEARCHES / MATCHING (OPTIONAL)
-- ==========================================

CREATE TABLE consultant_search_requests (
    id VARCHAR(36) PRIMARY KEY,
    company_id VARCHAR(36),
    need_title VARCHAR(255),
    mission_type VARCHAR(100),
    objective TEXT,
    selected_domain VARCHAR(100),
    selected_job VARCHAR(100),
    location VARCHAR(255),
    daily_rate_budget DECIMAL(10, 2),
    min_seniority_years INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- ==========================================
-- 5. ADMINISTRATORS
-- ==========================================

CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin (Password: admin123)
-- Hash generated for 'admin123'
INSERT INTO admins (id, username, email, password_hash, role) 
VALUES ('admin-uuid-1', 'admin', 'admin@openin.io', '$2b$10$8Tb6k0pbSnkBb1vzN2XmF.cIGMxDetoL/BBehKqbBak.KmDOFehc', 'admin');

-- ==========================================
-- 6. PROFESSIONAL TAXONOMY (DOMAINS, MÉTIERS, SKILLS, TOOLS)
-- ==========================================

-- Domains table
CREATE TABLE domaines (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Métiers (Professions) table
CREATE TABLE metiers (
    id VARCHAR(36) PRIMARY KEY,
    domaine_id VARCHAR(36) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (domaine_id) REFERENCES domaines(id) ON DELETE CASCADE,
    UNIQUE KEY unique_metier_per_domain (domaine_id, nom)
);

-- Compétences clés (Key Skills) table
CREATE TABLE competences (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Outils (Tools) table
CREATE TABLE outils (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    categorie VARCHAR(100), -- e.g., "Analytics", "Project Management", "Development"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Junction table: Métier -> Compétences
CREATE TABLE metier_competences (
    metier_id VARCHAR(36),
    competence_id VARCHAR(36),
    PRIMARY KEY (metier_id, competence_id),
    FOREIGN KEY (metier_id) REFERENCES metiers(id) ON DELETE CASCADE,
    FOREIGN KEY (competence_id) REFERENCES competences(id) ON DELETE CASCADE
);

-- Junction table: Métier -> Outils
CREATE TABLE metier_outils (
    metier_id VARCHAR(36),
    outil_id VARCHAR(36),
    PRIMARY KEY (metier_id, outil_id),
    FOREIGN KEY (metier_id) REFERENCES metiers(id) ON DELETE CASCADE,
    FOREIGN KEY (outil_id) REFERENCES outils(id) ON DELETE CASCADE
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_mission_domain ON missions(selected_domain);
CREATE INDEX idx_consultant_domain ON consultants(domaine);
CREATE INDEX idx_consultant_tjm ON consultants(tjm);
CREATE INDEX idx_mission_deadline ON missions(deadline);
CREATE INDEX idx_metiers_domaine ON metiers(domaine_id);
CREATE INDEX idx_competences_nom ON competences(nom);
CREATE INDEX idx_outils_nom ON outils(nom);

