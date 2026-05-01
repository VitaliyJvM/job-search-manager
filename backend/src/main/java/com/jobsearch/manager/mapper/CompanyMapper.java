package com.jobsearch.manager.mapper;

import com.jobsearch.manager.dto.CompanyRequest;
import com.jobsearch.manager.dto.CompanyResponse;
import com.jobsearch.manager.entity.Company;
import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {

    public CompanyResponse toResponse(Company company) {
        CompanyResponse response = new CompanyResponse();
        response.setId(company.getId());
        response.setName(company.getName());
        response.setIndustry(company.getIndustry());
        response.setLocation(company.getLocation());
        response.setWebsite(company.getWebsite());
        response.setNotes(company.getNotes());
        response.setPriority(company.getPriority());
        response.setCreatedAt(company.getCreatedAt());
        response.setUpdatedAt(company.getUpdatedAt());
        return response;
    }

    public Company toEntity(CompanyRequest request) {
        return Company.builder()
                .name(request.getName())
                .industry(request.getIndustry())
                .location(request.getLocation())
                .website(request.getWebsite())
                .notes(request.getNotes())
                .priority(request.getPriority())
                .build();
    }

    public void updateEntity(Company company, CompanyRequest request) {
        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setLocation(request.getLocation());
        company.setWebsite(request.getWebsite());
        company.setNotes(request.getNotes());
        company.setPriority(request.getPriority());
    }
}
