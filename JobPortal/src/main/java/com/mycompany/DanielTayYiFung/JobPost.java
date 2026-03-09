package com.mycompany.job_portal;

public class JobPost {

    private String jobTitle;
    private String jobCompany;
    private String jobDescription;
    private String jobLocation;
    private String jobCategory;
    private double jobSalary;

    public JobPost(String jobTitle, String jobCompany, String jobDescription, String jobLocation, String jobCategory, double jobSalary) {
        this.jobTitle = jobTitle;
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
        return jobTitle + " | " + jobCompany + " | " + jobLocation + " | " + jobDescription + " | " + jobCategory + " | " + jobSalary;
    }
}
