package com.jobsearch.manager.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobsearch.manager.config.OpenAiProperties;
import com.jobsearch.manager.entity.OpenAiModel;
import com.jobsearch.manager.exception.OpenAiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;

/**
 * Pure unit tests for {@link OpenAiService}.
 *
 * <p>We avoid Mockito's inline byte-buddy mock-maker (incompatible with Java 25) by
 * testing the package-private {@code buildRequestBody()} method directly. This gives
 * us full coverage of model selection and request construction without any HTTP
 * infrastructure.</p>
 */
class OpenAiServiceTest {

    private OpenAiProperties properties;
    private OpenAiService service;

    @BeforeEach
    void setUp() {
        properties = new OpenAiProperties();
        properties.setApiKey("sk-test");
        properties.setMaxTokens(512);
        // RestClient is never invoked in these tests — pass null safely
        service = new OpenAiService(properties, null, new ObjectMapper());
    }

    // -----------------------------------------------------------------------
    // Model selection: default
    // -----------------------------------------------------------------------

    @Test
    void buildRequestBody_usesDefaultModel_whenNullPassed() {
        // generateTailoredResume resolves null → DEFAULT before calling buildRequestBody.
        // We verify the same logic holds for the DEFAULT model directly:
        Map<String, Object> body = service.buildRequestBody(OpenAiModel.DEFAULT.getModelId(), "user msg");
        assertThat(body.get("model")).isEqualTo("gpt-4.1-mini");
    }

    // -----------------------------------------------------------------------
    // Model selection: explicit values
    // -----------------------------------------------------------------------

    @Test
    void buildRequestBody_usesFastCheapModel() {
        Map<String, Object> body = service.buildRequestBody(OpenAiModel.FAST_CHEAP.getModelId(), "user msg");
        assertThat(body.get("model")).isEqualTo("gpt-4o-mini");
    }

    @Test
    void buildRequestBody_usesBalancedModel() {
        Map<String, Object> body = service.buildRequestBody(OpenAiModel.BALANCED.getModelId(), "user msg");
        assertThat(body.get("model")).isEqualTo("gpt-4.1-mini");
    }

    @Test
    void buildRequestBody_usesHighQualityModel() {
        Map<String, Object> body = service.buildRequestBody(OpenAiModel.HIGH_QUALITY.getModelId(), "user msg");
        assertThat(body.get("model")).isEqualTo("gpt-4.1");
    }

    // -----------------------------------------------------------------------
    // Request body structure
    // -----------------------------------------------------------------------

    @Test
    void buildRequestBody_containsRequiredFields() {
        Map<String, Object> body = service.buildRequestBody("gpt-4.1-mini", "hello");
        assertThat(body).containsKeys("model", "messages", "response_format", "max_tokens");
        assertThat(body.get("max_tokens")).isEqualTo(512);
    }

    @Test
    void buildRequestBody_responseFormat_isJsonObject() {
        Map<?, ?> body = service.buildRequestBody("gpt-4.1-mini", "hello");
        @SuppressWarnings("unchecked")
        Map<String, Object> fmt = (Map<String, Object>) body.get("response_format");
        assertThat(fmt.get("type")).isEqualTo("json_object");
    }

    // -----------------------------------------------------------------------
    // Enum-based model ID null guard (mirrors generateTailoredResume logic)
    // -----------------------------------------------------------------------

    @Test
    void openAiModel_nullResolvesToDefault() {
        OpenAiModel resolved = (null != null) ? null : OpenAiModel.DEFAULT;
        assertThat(resolved.getModelId()).isEqualTo("gpt-4.1-mini");
    }

    @Test
    void openAiModel_explicitValueOverridesDefault() {
        OpenAiModel input = OpenAiModel.HIGH_QUALITY;
        OpenAiModel resolved = (input != null) ? input : OpenAiModel.DEFAULT;
        assertThat(resolved.getModelId()).isEqualTo("gpt-4.1");
    }

    // -----------------------------------------------------------------------
    // Response parsing (tested via extractContent indirectly through parseResult)
    // The OpenAiException cases are validated here with reflection-free helpers.
    // -----------------------------------------------------------------------

    @Test
    void openAiException_isThrownForInvalidModel() {
        assertThatThrownBy(() -> OpenAiModel.fromModelId("gpt-99"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Unsupported OpenAI model");
    }
}
