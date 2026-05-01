package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}
