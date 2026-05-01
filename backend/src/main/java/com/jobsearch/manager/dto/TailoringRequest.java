package com.jobsearch.manager.dto;

import com.jobsearch.manager.entity.OpenAiModel;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TailoringRequest {

    @NotNull(message = "Master resume ID is required")
    private Long masterResumeId;

    @NotNull(message = "Prompt template ID is required")
    private Long promptTemplateId;

    private Long jobApplicationId;

    private String jobDescription;

    /**
     * Optional model selection. When {@code null} the service falls back to
     * {@link OpenAiModel#DEFAULT}. Unsupported values are rejected by Jackson
     * via {@link OpenAiModel#fromModelId} before the controller is even reached.
     */
    private OpenAiModel model;
}
