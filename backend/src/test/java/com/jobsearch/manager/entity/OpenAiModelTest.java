package com.jobsearch.manager.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class OpenAiModelTest {

    @Test
    void defaultModelIsBalanced() {
        assertThat(OpenAiModel.DEFAULT).isEqualTo(OpenAiModel.BALANCED);
        assertThat(OpenAiModel.DEFAULT.getModelId()).isEqualTo("gpt-4.1-mini");
    }

    @Test
    void fromModelId_resolvesFastCheap() {
        assertThat(OpenAiModel.fromModelId("gpt-4o-mini")).isEqualTo(OpenAiModel.FAST_CHEAP);
    }

    @Test
    void fromModelId_resolvesBalanced() {
        assertThat(OpenAiModel.fromModelId("gpt-4.1-mini")).isEqualTo(OpenAiModel.BALANCED);
    }

    @Test
    void fromModelId_resolvesHighQuality() {
        assertThat(OpenAiModel.fromModelId("gpt-4.1")).isEqualTo(OpenAiModel.HIGH_QUALITY);
    }

    @Test
    void fromModelId_isCaseInsensitive() {
        assertThat(OpenAiModel.fromModelId("GPT-4.1-MINI")).isEqualTo(OpenAiModel.BALANCED);
    }

    @Test
    void fromModelId_returnsNullForNullInput() {
        assertThat(OpenAiModel.fromModelId(null)).isNull();
    }

    @Test
    void fromModelId_returnsNullForBlankInput() {
        assertThat(OpenAiModel.fromModelId("   ")).isNull();
    }

    @Test
    void fromModelId_throwsForUnknownModel() {
        assertThatThrownBy(() -> OpenAiModel.fromModelId("gpt-99-turbo"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unsupported OpenAI model")
                .hasMessageContaining("gpt-99-turbo");
    }

    @Test
    void getModelId_returnsApiString() {
        assertThat(OpenAiModel.FAST_CHEAP.getModelId()).isEqualTo("gpt-4o-mini");
        assertThat(OpenAiModel.BALANCED.getModelId()).isEqualTo("gpt-4.1-mini");
        assertThat(OpenAiModel.HIGH_QUALITY.getModelId()).isEqualTo("gpt-4.1");
    }
}
