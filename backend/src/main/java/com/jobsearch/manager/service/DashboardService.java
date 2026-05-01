package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.DashboardStatsResponse;
import com.jobsearch.manager.entity.ApplicationStatus;
import com.jobsearch.manager.repository.ContactRepository;
import com.jobsearch.manager.repository.JobApplicationRepository;
import com.jobsearch.manager.repository.TailoredResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final JobApplicationRepository jobApplicationRepository;
    private final ContactRepository contactRepository;
    private final TailoredResumeRepository tailoredResumeRepository;

    private static final List<ApplicationStatus> ACTIVE_STATUSES = List.of(
            ApplicationStatus.INTERESTED,
            ApplicationStatus.APPLIED,
            ApplicationStatus.HR_SCREEN,
            ApplicationStatus.TECH_INTERVIEW
    );

    public DashboardStatsResponse getStats() {
        long activeApplications = jobApplicationRepository.countByStatusIn(ACTIVE_STATUSES);
        long followUpsDue = jobApplicationRepository
                .countByNextFollowUpAtLessThanEqualAndStatusNot(LocalDate.now(), ApplicationStatus.REJECTED);
        long totalContacts = contactRepository.count();
        long generatedResumes = tailoredResumeRepository.count();

        Map<String, Long> byStatus = new HashMap<>();
        Arrays.stream(ApplicationStatus.values()).forEach(status ->
                byStatus.put(status.name(), jobApplicationRepository.countByStatus(status))
        );

        return new DashboardStatsResponse(activeApplications, followUpsDue, totalContacts, generatedResumes, byStatus);
    }
}
