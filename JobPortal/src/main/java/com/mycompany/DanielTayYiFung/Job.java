public class Job {
  private int jobId;
  private String jobTitle;
  private String jobDescription;
  private String jobLocation;
  private double jobSalary;

  public Job(int jobId, String jobTitle, String jobDescription, String jobLocation, double jobSalary) {
    jobId++;
    this.jobTitle = jobTitle;
    this.jobDescription = jobDescription;
    this.jobLocation = jobLocation;
    this.jobSalary = jobSalary;
  }

  // setter & getter

  public void setJobTitle(String jobTitle) {
    this.jobTitle = jobTitle;
  }

  public String getJobTitle() {
    return jobTitle;
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

  public void setJobSalary(double jobSalary) {
    this.jobSalary = jobSalary;
  }

  public double getJobSalary() {
    return jobSalary;
  }
}