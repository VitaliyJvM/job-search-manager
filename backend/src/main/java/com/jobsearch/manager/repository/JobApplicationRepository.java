package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.ApplicationStatus;
import com.jobsearch.manager.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStatus(ApplicationStatus status);

    List<JobApplication> findByCompany_Id(Long companyId);

    long countByStatusIn(List<ApplicationStatus> statuses);

    long countByStatus(ApplicationStatus status);

    long countByNextFollowUpAtLessThanEqualAndStatusNot(LocalDate date, ApplicationStatus status);
}
