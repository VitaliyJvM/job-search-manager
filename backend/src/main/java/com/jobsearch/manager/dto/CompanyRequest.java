package com.jobsearch.manager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String industry;
    private String location;
    private String website;
    private String notes;
    private Integer priority;
}
