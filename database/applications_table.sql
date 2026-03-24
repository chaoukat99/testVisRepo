
-- Mission Applications Table
CREATE TABLE IF NOT EXISTS mission_applications (
    id VARCHAR(36) PRIMARY KEY,
    mission_id VARCHAR(36) NOT NULL,
    consultant_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) DEFAULT 'En attente', -- En attente, Sélectionné, Refusé
    match_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
    FOREIGN KEY (consultant_id) REFERENCES consultants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (mission_id, consultant_id)
);
