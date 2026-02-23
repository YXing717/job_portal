package com.mycompany.YeoJunHe;

public class jobsearch {
    private String jobTitle;
    private String jobLocation;
    private double jobSalary;

    public jobsearch(String jobTitle, String jobLocation, double jobSalary) {
        this.jobTitle = jobTitle;
        this.jobLocation = jobLocation;
        this.jobSalary = jobSalary;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobSalary(double jobSalary) {
        this.jobSalary = jobSalary;
    }

    public double getJobSalary() {
        return jobSalary;
    }
}