package com.mycompany.job_portal;

public class JobPost {

    private String jobTitle;
    private String jobType;
    private String jobCompany;
    private String jobDescription;
    private String jobLocation;
    private String jobCategory;
    private double jobSalary;

    public JobPost(String jobTitle, String jobType, String jobCompany, String jobDescription, String jobLocation, String jobCategory, double jobSalary) {
        this.jobTitle = jobTitle;
        this.jobType = jobType;
        this.jobCompany = jobCompany;
        this.jobDescription = jobDescription;
        this.jobLocation = jobLocation;
        this.jobCategory = jobCategory;
        this.jobSalary = jobSalary;
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

    @Override
    public String toString() {
        return jobTitle + " - " + jobCompany;
    }

    public String toFile() {
        return jobTitle + " | " + jobType + " | " + jobCompany + " | " + jobLocation + " | " + jobDescription + " | " + jobCategory + " | " + jobSalary;
    }
}
