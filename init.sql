-- 智能客服数据库初始化脚本

CREATE DATABASE IF NOT EXISTS chatbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE chatbot;

-- 对话会话表
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_ip VARCHAR(45),
    platform VARCHAR(20) DEFAULT 'web',
    status TINYINT DEFAULT 1,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    message_count INT DEFAULT 0,
    satisfaction INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 对话消息表
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    intent VARCHAR(50),
    confidence DECIMAL(5,4),
    response_time INT,
    tokens_used INT,
    source_used JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_role (role),
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户反馈表
CREATE TABLE IF NOT EXISTS user_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    is_helpful TINYINT NOT NULL,
    feedback_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 每日统计数据表
CREATE TABLE IF NOT EXISTS analytics_daily (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stat_date DATE NOT NULL,
    total_sessions INT DEFAULT 0,
    total_messages INT DEFAULT 0,
    avg_response_time INT,
    token_usage INT DEFAULT 0,
    satisfaction_avg DECIMAL(3,2),
    UNIQUE KEY uk_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 知识库备份表
CREATE TABLE IF NOT EXISTS knowledge_base (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(100),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    keywords JSON,
    status TINYINT DEFAULT 1,
    view_count INT DEFAULT 0,
    helpful_count INT DEFAULT 0,
    useless_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 同步历史记录表
CREATE TABLE IF NOT EXISTS sync_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sync_type ENUM('mysql_to_qdrant', 'qdrant_to_mysql') NOT NULL,
    sync_mode ENUM('full', 'incremental') NOT NULL,
    status ENUM('running', 'completed', 'failed') NOT NULL,
    started_at DATETIME NOT NULL,
    completed_at DATETIME,
    total_items INT DEFAULT 0,
    synced_items INT DEFAULT 0,
    failed_items INT DEFAULT 0,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sync_type (sync_type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;