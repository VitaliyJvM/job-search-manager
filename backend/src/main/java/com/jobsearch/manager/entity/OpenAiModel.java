package com.jobsearch.manager.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Supported OpenAI model identifiers.
 * Add new values here to extend the allowed model list without touching service logic.
 */
public enum OpenAiModel {

    FAST_CHEAP("gpt-4o-mini"),
    BALANCED("gpt-4.1-mini"),
    HIGH_QUALITY("gpt-4.1");

    public static final OpenAiModel DEFAULT = BALANCED;

    private final String modelId;

    OpenAiModel(String modelId) {
        this.modelId = modelId;
    }

    @JsonValue
    public String getModelId() {
        return modelId;
    }

    /**
     * Resolves an {@link OpenAiModel} from a raw model-ID string.
     * Returns {@code null} if the value is {@code null} or blank — callers treat that as "use default".
     *
     * @throws IllegalArgumentException for non-blank values that are not recognised.
     */
    @JsonCreator
    public static OpenAiModel fromModelId(String modelId) {
        if (modelId == null || modelId.isBlank()) {
            return null;
        }
        for (OpenAiModel m : values()) {
            if (m.modelId.equalsIgnoreCase(modelId)) {
                return m;
            }
        }
        throw new IllegalArgumentException(
                "Unsupported OpenAI model: \"" + modelId + "\". "
                + "Allowed values: gpt-4o-mini, gpt-4.1-mini, gpt-4.1");
    }
}
