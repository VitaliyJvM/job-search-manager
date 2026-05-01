package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.ResumeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeDocumentRepository extends JpaRepository<ResumeDocument, Long> {

    List<ResumeDocument> findByIsMasterTrue();
}
