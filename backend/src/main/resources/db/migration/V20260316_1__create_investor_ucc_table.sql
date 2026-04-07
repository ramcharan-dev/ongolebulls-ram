-- Create investor_ucc table for storing BSE UCC registration results
CREATE TABLE IF NOT EXISTS investor_ucc (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    investor_id BIGINT NOT NULL,
    ucc_code VARCHAR(20),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempt_count INT NOT NULL DEFAULT 0,
    last_error TEXT,
    remarks TEXT,
    regn_type VARCHAR(20) NOT NULL DEFAULT 'NEW',
    last_request_time TIMESTAMP NULL,
    last_response_time TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_investor_ucc_investor UNIQUE (investor_id),
    CONSTRAINT fk_investor_ucc_investor FOREIGN KEY (investor_id) REFERENCES investor_accounts(id)
);
