package com.jobsearch.manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class JobSearchManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobSearchManagerApplication.class, args);
    }
}
