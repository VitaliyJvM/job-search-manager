package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.PromptTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromptTemplateRepository extends JpaRepository<PromptTemplate, Long> {

    Optional<PromptTemplate> findFirstByIsDefaultTrue();
}
