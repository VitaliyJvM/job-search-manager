package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.ContactRequest;
import com.jobsearch.manager.dto.ContactResponse;
import com.jobsearch.manager.entity.Company;
import com.jobsearch.manager.entity.Contact;
import org.springframework.stereotype.Component;

@Component
public class ContactMapper {

    public ContactResponse toResponse(Contact contact) {
        ContactResponse response = new ContactResponse();
        response.setId(contact.getId());
        if (contact.getCompany() != null) {
            response.setCompanyId(contact.getCompany().getId());
            response.setCompanyName(contact.getCompany().getName());
        }
        response.setFullName(contact.getFullName());
        response.setRoleTitle(contact.getRoleTitle());
        response.setLinkedinUrl(contact.getLinkedinUrl());
        response.setEmail(contact.getEmail());
        response.setRelationshipType(contact.getRelationshipType());
        response.setNotes(contact.getNotes());
        response.setCreatedAt(contact.getCreatedAt());
        response.setUpdatedAt(contact.getUpdatedAt());
        return response;
    }

    public Contact toEntity(ContactRequest request, Company company) {
        return Contact.builder()
                .company(company)
                .fullName(request.getFullName())
                .roleTitle(request.getRoleTitle())
                .linkedinUrl(request.getLinkedinUrl())
                .email(request.getEmail())
                .relationshipType(request.getRelationshipType())
                .notes(request.getNotes())
                .build();
    }

    public void updateEntity(Contact contact, ContactRequest request, Company company) {
        contact.setCompany(company);
        contact.setFullName(request.getFullName());
        contact.setRoleTitle(request.getRoleTitle());
        contact.setLinkedinUrl(request.getLinkedinUrl());
        contact.setEmail(request.getEmail());
        contact.setRelationshipType(request.getRelationshipType());
        contact.setNotes(request.getNotes());
    }
}
