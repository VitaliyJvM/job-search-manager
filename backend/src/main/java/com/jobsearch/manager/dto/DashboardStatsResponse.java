package com.jobsearch.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long activeApplications;
    private long followUpsDue;
    private long totalContacts;
    private long generatedResumes;
    private Map<String, Long> applicationsByStatus;
}
