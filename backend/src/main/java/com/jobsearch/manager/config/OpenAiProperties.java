package com.jobsearch.manager.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.openai")
@Getter
@Setter
public class OpenAiProperties {

    private String apiKey;
    private String model = "gpt-4o";
    private int maxTokens = 4096;
}
