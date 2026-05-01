package com.jobsearch.manager.service;

import com.jobsearch.manager.dto.CompanyRequest;
import com.jobsearch.manager.dto.CompanyResponse;
import com.jobsearch.manager.entity.Company;
import com.jobsearch.manager.exception.ResourceNotFoundException;
import com.jobsearch.manager.mapper.CompanyMapper;
import com.jobsearch.manager.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    public List<CompanyResponse> findAll() {
        return companyRepository.findAll().stream()
                .map(companyMapper::toResponse)
                .toList();
    }

    public CompanyResponse findById(Long id) {
        return companyMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        Company company = companyMapper.toEntity(request);
        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Company company = getOrThrow(id);
        companyMapper.updateEntity(company, request);
        return companyMapper.toResponse(companyRepository.save(company));
    }

    @Transactional
    public void delete(Long id) {
        getOrThrow(id);
        companyRepository.deleteById(id);
    }

    private Company getOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
    }
}
