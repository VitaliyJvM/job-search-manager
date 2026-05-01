package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.PromptType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PromptTemplateResponse {

    private Long id;
    private String name;
    private PromptType type;
    private String promptText;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
