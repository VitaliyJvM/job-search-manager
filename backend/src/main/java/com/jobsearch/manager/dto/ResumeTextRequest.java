package com.jobsearch.manager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResumeTextRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Content is required")
    private String contentText;

    private Boolean isMaster = false;
}
