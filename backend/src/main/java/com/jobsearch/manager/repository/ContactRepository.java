package com.jobsearch.manager.repository;

import com.jobsearch.manager.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByCompany_Id(Long companyId);
}
