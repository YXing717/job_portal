package com.mycompany.job_portal;

import java.time.LocalDate;

public class JobPost {

    private String jobTitle;
    private String jobType;
    private String jobCompany;
    private String jobDescription;
    private String jobLocation;
    private String jobCategory;
    private double jobSalary;
    private String closingDate;

    public JobPost(String jobTitle, String jobType, String jobCompany, String jobDescription, String jobLocation, String jobCategory, double jobSalary, String closingDate) {
        this.jobTitle = jobTitle;
        this.jobType = jobType;
        this.jobCompany = jobCompany;
        this.jobDescription = jobDescription;
        this.jobLocation = jobLocation;
        this.jobCategory = jobCategory;
        this.jobSalary = jobSalary;
        this.closingDate = closingDate;
    }

    // setter & getter
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }
    
    public String getJobType() {
        return jobType;
    }

    public void setJobCompany(String jobCompany) {
        this.jobCompany = jobCompany;
    }

    public String getJobCompany() {
        return jobCompany;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobCategory(String jobCategory) {
        this.jobCategory = jobCategory;
    }

    public String getJobCategory() {
        return jobCategory;
    }

    public void setJobSalary(double jobSalary) {
        this.jobSalary = jobSalary;
    }

    public double getJobSalary() {
        return jobSalary;
    }
    
    public void setClosingDate(String closingDate) {
        this.closingDate = closingDate;
    }

    public String getClosingDate() {
        return closingDate;
    }

    @Override
    public String toString() {
        String status = isExpired() ? "CLOSED" : "OPEN";
        return jobTitle + " - " + jobCompany + " (" + jobType + ") [" + status + "]";
    }

    public boolean isExpired() {
        LocalDate today = LocalDate.now();
        LocalDate closing = LocalDate.parse(closingDate);
        return today.isAfter(closing);
    }
}
