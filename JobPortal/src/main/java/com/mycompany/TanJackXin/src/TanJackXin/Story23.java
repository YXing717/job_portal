package TanJackXin;
import java.util.ArrayList;
import java.util.Scanner;

public class Story23 {

    // ===================== Job Class =====================
    static class Job {
        String title;
        String company;
        double estimatedSalary;
        String resumeFile;
        String status;

        Job(String title, String company, double estimatedSalary, String resumeFile, String status) {
            this.title = title;
            this.company = company;
            this.estimatedSalary = estimatedSalary;
            this.resumeFile = resumeFile;
            this.status = status;
        }
    }

    // ===================== VALIDATION =====================

    // Allow normal titles OR formats like 3D Designer
    static boolean isValidTitle(String input) {
        return input.matches("^[A-Za-z].*") || input.matches("^\\d+[A-Za-z].*");
    }

    // Must contain at least one letter (allows 7-Eleven, 3M)
    static boolean isValidCompany(String input) {
        return input.matches(".*[A-Za-z].*");
    }

    static boolean isValidSalary(double salary) {
        return salary >= 1500;
    }

    static boolean isValidResume(String file) {
        return file.toLowerCase().matches(".*\\.(pdf|doc|docx|jpg|png)$");
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // ===================== DEMO DATA =====================
        ArrayList<Job> appliedJobs = new ArrayList<>();
        appliedJobs.add(new Job("Software Engineer", "Google", 5000, "resume_google.pdf", "Pending"));
        appliedJobs.add(new Job("Data Analyst", "Shopee", 4200, "resume_shopee.pdf", "Pending"));
        appliedJobs.add(new Job("System Developer", "Intel", 4800, "resume_intel.pdf", "Pending"));
        appliedJobs.add(new Job("Web Developer", "Grab", 4500, "resume_grab.pdf", "Pending"));
        appliedJobs.add(new Job("AI Engineer", "Microsoft", 6000, "resume_ai.pdf", "On Review"));
        appliedJobs.add(new Job("3D Designer", "3M", 4700, "resume_3d.pdf", "Pending"));
        appliedJobs.add(new Job("Retail Assistant", "7-Eleven", 3000, "resume_retail.pdf", "On Review"));

        String seekerName = "Demo User";

        while (true) {
            System.out.println("\n=========== EDIT APPLICATION DEMO ===========");
            System.out.println("1. View Applications");
            System.out.println("2. Edit Application");
            System.out.println("3. Exit");
            System.out.print("Choose option: ");

            int option;

            try {
                option = Integer.parseInt(sc.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number (1-3).");
                continue;
            }

            switch (option) {

                case 1:
                    displayJobs(appliedJobs, seekerName);
                    break;

                case 2:
                    displayJobs(appliedJobs, seekerName);

                    System.out.print("Enter number to edit: ");

                    int editIndex;
                    try {
                        editIndex = Integer.parseInt(sc.nextLine());
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid input. Please enter a valid number.");
                        break;
                    }

                    if (editIndex < 1 || editIndex > appliedJobs.size()) {
                        System.out.println("Invalid selection. Please choose a valid application number.");
                        break;
                    }

                    Job job = appliedJobs.get(editIndex - 1);

                    if (job.status.equalsIgnoreCase("On Review")) {
                        System.out.println("This application is currently under review and cannot be modified.");
                        break;
                    }

                    boolean titleChanged = false;
                    boolean companyChanged = false;
                    boolean salaryChanged = false;
                    boolean resumeChanged = false;

                    System.out.println("\n----- CURRENT APPLICATION -----");
                    System.out.println("Title   : " + job.title);
                    System.out.println("Company : " + job.company);
                    System.out.println("Salary  : RM " + job.estimatedSalary);
                    System.out.println("Resume  : " + job.resumeFile);
                    System.out.println("Status  : " + job.status);

                    System.out.println("\n(Press ENTER to keep old value)");

                    // TITLE
                    while (true) {
                        System.out.print("New Job Title: ");
                        String newTitle = sc.nextLine();

                        if (newTitle.isEmpty()) break;

                        if (!isValidTitle(newTitle)) {
                            System.out.println("Invalid title. Must start with a letter or valid format like 3D.");
                        } else {
                            job.title = newTitle;
                            titleChanged = true;
                            break;
                        }
                    }

                    // COMPANY
                    while (true) {
                        System.out.print("New Company: ");
                        String newCompany = sc.nextLine();

                        if (newCompany.isEmpty()) break;

                        if (!isValidCompany(newCompany)) {
                            System.out.println("Invalid company. Must contain at least one letter.");
                        } else {
                            job.company = newCompany;
                            companyChanged = true;
                            break;
                        }
                    }

                    // SALARY
                    while (true) {
                        System.out.print("New Salary: ");
                        String salaryInput = sc.nextLine();

                        if (salaryInput.isEmpty()) break;

                        try {
                            double newSalary = Double.parseDouble(salaryInput);

                            if (!isValidSalary(newSalary)) {
                                System.out.println("Salary must be at least RM1500.");
                            } else {
                                job.estimatedSalary = newSalary;
                                salaryChanged = true;
                                break;
                            }

                        } catch (Exception e) {
                            System.out.println("Invalid salary format. Please enter a number.");
                        }
                    }

                    // RESUME
                    while (true) {
                        System.out.print("New Resume File: ");
                        String newResume = sc.nextLine();

                        if (newResume.isEmpty()) break;

                        if (!isValidResume(newResume)) {
                            System.out.println("Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed.");
                        } else {
                            job.resumeFile = newResume;
                            resumeChanged = true;
                            break;
                        }
                    }

                    System.out.println("\n----- UPDATED APPLICATION -----");
                    System.out.println("Title   : " + job.title);
                    System.out.println("Company : " + job.company);
                    System.out.println("Salary  : RM " + job.estimatedSalary);
                    System.out.println("Resume  : " + job.resumeFile);
                    System.out.println("Status  : " + job.status);

                    System.out.println("\n----------------------------------------");
                    System.out.println("===== UPDATE RESULT =====");

                    if (!titleChanged && !companyChanged && !salaryChanged && !resumeChanged) {
                        System.out.println("No changes were made.");
                    } else {
                        System.out.println("Updated fields:");
                        if (titleChanged) System.out.println("- Job Title updated");
                        if (companyChanged) System.out.println("- Company updated");
                        if (salaryChanged) System.out.println("- Salary updated");
                        if (resumeChanged) System.out.println("- Resume updated");
                    }

                    break;

                case 3:
                    System.out.println("Demo ended.");
                    sc.close();
                    return;

                default:
                    System.out.println("Invalid option.");
            }
        }
    }

    // ===================== DISPLAY =====================
    static void displayJobs(ArrayList<Job> jobs, String seekerName) {
        System.out.println("\n===== Applied Jobs for " + seekerName + " =====");

        System.out.printf("%-5s %-20s %-20s %-10s %-20s %-15s%n",
                "No", "Job Title", "Company", "Salary", "Resume", "Status");

        System.out.println("--------------------------------------------------------------------------------");

        for (int i = 0; i < jobs.size(); i++) {
            Job j = jobs.get(i);
            System.out.printf("%-5d %-20s %-20s %-10.2f %-20s %-15s%n",
                    i + 1, j.title, j.company, j.estimatedSalary, j.resumeFile, j.status);
        }
    }
}
