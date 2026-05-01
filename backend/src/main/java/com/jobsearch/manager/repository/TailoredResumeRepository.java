package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.TailoredResume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TailoredResumeRepository extends JpaRepository<TailoredResume, Long> {

    List<TailoredResume> findByJobApplication_IdOrderByCreatedAtDesc(Long jobApplicationId);

    List<TailoredResume> findAllByOrderByCreatedAtDesc();
}
