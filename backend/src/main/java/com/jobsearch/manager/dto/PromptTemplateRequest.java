package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.PromptType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PromptTemplateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private PromptType type;

    @NotBlank(message = "Prompt text is required")
    private String promptText;

    private Boolean isDefault = false;
}
