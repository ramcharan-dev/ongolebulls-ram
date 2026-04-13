-- Create bse_api_logs table for logging all BSE API interactions
CREATE TABLE IF NOT EXISTS bse_api_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    api_name VARCHAR(100) NOT NULL,
    investor_id BIGINT,
    client_code VARCHAR(20),
    http_status INT,
    bse_status VARCHAR(20),
    bse_remarks TEXT,
    masked_request_payload TEXT,
    response_payload TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bse_log_investor (investor_id),
    INDEX idx_bse_log_api (api_name)
);
