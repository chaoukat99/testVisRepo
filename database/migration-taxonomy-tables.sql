-- Migration: Add Professional Taxonomy Tables
-- Date: 2026-01-07
-- Description: Adds tables for managing domains, métiers, competences, and outils

-- ==========================================
-- PROFESSIONAL TAXONOMY (DOMAINS, MÉTIERS, SKILLS, TOOLS)
-- ==========================================

-- Domains table
CREATE TABLE IF NOT EXISTS domaines (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Métiers (Professions) table
CREATE TABLE IF NOT EXISTS metiers (
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
CREATE TABLE IF NOT EXISTS competences (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Outils (Tools) table
CREATE TABLE IF NOT EXISTS outils (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    categorie VARCHAR(100), -- e.g., "Analytics", "Project Management", "Development"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Junction table: Métier -> Compétences
CREATE TABLE IF NOT EXISTS metier_competences (
    metier_id VARCHAR(36),
    competence_id VARCHAR(36),
    PRIMARY KEY (metier_id, competence_id),
    FOREIGN KEY (metier_id) REFERENCES metiers(id) ON DELETE CASCADE,
    FOREIGN KEY (competence_id) REFERENCES competences(id) ON DELETE CASCADE
);

-- Junction table: Métier -> Outils
CREATE TABLE IF NOT EXISTS metier_outils (
    metier_id VARCHAR(36),
    outil_id VARCHAR(36),
    PRIMARY KEY (metier_id, outil_id),
    FOREIGN KEY (metier_id) REFERENCES metiers(id) ON DELETE CASCADE,
    FOREIGN KEY (outil_id) REFERENCES outils(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_metiers_domaine ON metiers(domaine_id);
CREATE INDEX IF NOT EXISTS idx_competences_nom ON competences(nom);
CREATE INDEX IF NOT EXISTS idx_outils_nom ON outils(nom);

-- Success message
SELECT 'Taxonomy tables created successfully!' as message;
