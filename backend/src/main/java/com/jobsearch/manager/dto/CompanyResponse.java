package com.jobsearch.manager.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyResponse {

    private Long id;
    private String name;
    private String industry;
    private String location;
    private String website;
    private String notes;
    private Integer priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
