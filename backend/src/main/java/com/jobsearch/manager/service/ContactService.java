package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.ContactRequest;
import com.jobsearch.manager.dto.ContactResponse;
import com.jobsearch.manager.entity.Company;
import com.jobsearch.manager.entity.Contact;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.ContactMapper;
import com.jobsearch.manager.repository.CompanyRepository;
import com.jobsearch.manager.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactService {

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final ContactMapper mapper;

    public List<ContactResponse> findAll(Long companyId) {
        List<Contact> contacts = (companyId != null)
                ? contactRepository.findByCompany_Id(companyId)
                : contactRepository.findAll();
        return contacts.stream().map(mapper::toResponse).toList();
    }

    public ContactResponse findById(Long id) {
        return mapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public ContactResponse create(ContactRequest request) {
        Company company = resolveCompany(request.getCompanyId());
        Contact contact = mapper.toEntity(request, company);
        return mapper.toResponse(contactRepository.save(contact));
    }

    @Transactional
    public ContactResponse update(Long id, ContactRequest request) {
        Contact contact = getOrThrow(id);
        Company company = resolveCompany(request.getCompanyId());
        mapper.updateEntity(contact, request, company);
        return mapper.toResponse(contactRepository.save(contact));
    }

    @Transactional
    public void delete(Long id) {
        getOrThrow(id);
        contactRepository.deleteById(id);
    }

    private Contact getOrThrow(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact", id));
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", companyId));
    }
}
