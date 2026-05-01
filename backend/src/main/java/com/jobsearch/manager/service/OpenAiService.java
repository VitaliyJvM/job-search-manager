package com.jobsearch.manager.service;

import com.jobsearch.manager.entity.OpenAiModel;
import com.jobsearch.manager.exception.OpenAiException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobsearch.manager.config.OpenAiProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAiService {

    private final OpenAiProperties properties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public record TailoredResumeResult(
            String tailoredResume,
            String changeSummary,
            String gapsOrWarnings
    ) {}

    /**
     * Generates a tailored resume using the specified model.
     *
     * @param masterResumeText   extracted text of the master resume
     * @param jobDescription     the target job description
     * @param promptTemplateText the tailoring prompt
     * @param model              the OpenAI model to use; {@code null} falls back to {@link OpenAiModel#DEFAULT}
     */
    public TailoredResumeResult generateTailoredResume(
            String masterResumeText,
            String jobDescription,
            String promptTemplateText,
            OpenAiModel model
    ) {
        OpenAiModel resolvedModel = (model != null) ? model : OpenAiModel.DEFAULT;
        String modelId = resolvedModel.getModelId();

        String userMessage = buildUserMessage(masterResumeText, jobDescription, promptTemplateText);
        Map<String, Object> requestBody = buildRequestBody(modelId, userMessage);

        try {
            log.info("Calling OpenAI API with model={}", modelId);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri("https://api.openai.com/v1/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            String content = extractContent(response);
            log.info("OpenAI responded successfully");

            TailoredResumeResult result = objectMapper.readValue(content, TailoredResumeResult.class);
            if (result.tailoredResume() == null) {
                throw new OpenAiException("OpenAI response was missing the tailoredResume field");
            }
            return result;

        } catch (RestClientException ex) {
            log.error("OpenAI API call failed", ex);
            throw new OpenAiException("OpenAI API call failed: " + ex.getMessage(), ex);
        } catch (OpenAiException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Failed to parse OpenAI response", ex);
            throw new OpenAiException("Failed to parse OpenAI response: " + ex.getMessage(), ex);
        }
    }

    /** Package-private for unit-test access. */
    Map<String, Object> buildRequestBody(String modelId, String userMessage) {
        return Map.of(
                "model", modelId,
                "messages", List.of(
                        Map.of("role", "system", "content", buildSystemMessage()),
                        Map.of("role", "user", "content", userMessage)
                ),
                "response_format", Map.of("type", "json_object"),
                "max_tokens", properties.getMaxTokens()
        );
    }

    private String buildSystemMessage() {
        return """
                You are an expert resume writer. You strictly follow the rules in the user message.
                You NEVER fabricate any information. You ONLY use facts explicitly present in the master resume.
                You MUST return valid JSON with exactly three fields: tailoredResume, changeSummary, gapsOrWarnings.
                """;
    }

    private String buildUserMessage(String masterResume, String jobDescription, String promptTemplate) {
        return promptTemplate + "\n\n"
                + "=== MASTER RESUME ===\n" + masterResume + "\n\n"
                + "=== JOB DESCRIPTION ===\n" + jobDescription;
    }

    @SuppressWarnings("unchecked")
    private String extractContent(Map<String, Object> response) {
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) {
            throw new OpenAiException("OpenAI returned no choices in response");
        }
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = (String) message.get("content");
        if (content == null || content.isBlank()) {
            throw new OpenAiException("OpenAI returned empty content");
        }
        return content;
    }
}
