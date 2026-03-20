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

        Job(String title, String company, double estimatedSalary, String resumeFile) {
            this.title = title;
            this.company = company;
            this.estimatedSalary = estimatedSalary;
            this.resumeFile = resumeFile;
        }
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // ===================== DEMO DATA =====================
        ArrayList<Job> appliedJobs = new ArrayList<>();
        appliedJobs.add(new Job("Software Engineer", "Google", 5000, "resume_google.pdf"));
        appliedJobs.add(new Job("Data Analyst", "Shopee", 4200, "resume_shopee.pdf"));
        appliedJobs.add(new Job("System Developer", "Intel", 4800, "resume_intel.pdf"));
        appliedJobs.add(new Job("Web Developer", "Grab", 4500, "resume_grab.pdf"));
        appliedJobs.add(new Job("AI Engineer", "Microsoft", 6000, "resume_ai.pdf"));

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

                // ===================== VIEW =====================
                case 1:
                    displayJobs(appliedJobs, seekerName);
                    break;

                // ===================== EDIT =====================
                case 2:
                    displayJobs(appliedJobs, seekerName);

                    if (appliedJobs.isEmpty()) {
                        System.out.println("No applications available to edit.");
                        break;
                    }

                    System.out.print("Enter number to edit: ");

                    int editIndex;
                    try {
                        editIndex = Integer.parseInt(sc.nextLine());
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid input. Please enter a valid number.");
                        break;
                    }

                    if (editIndex < 1 || editIndex > appliedJobs.size()) {
                        System.out.println("Invalid selection. Please choose a valid job number.");
                        break;
                    }

                    Job job = appliedJobs.get(editIndex - 1);

                    // BEFORE
                    System.out.println("\n----- CURRENT APPLICATION -----");
                    System.out.println("Title   : " + job.title);
                    System.out.println("Company : " + job.company);
                    System.out.println("Salary  : RM " + job.estimatedSalary);
                    System.out.println("Resume  : " + job.resumeFile);

                    System.out.println("\n(Press ENTER to keep old value)");

                    // EDIT TITLE
                    System.out.print("New Job Title: ");
                    String newTitle = sc.nextLine();
                    if (!newTitle.isEmpty()) {
                        job.title = newTitle;
                    }

                    // EDIT COMPANY
                    System.out.print("New Company: ");
                    String newCompany = sc.nextLine();
                    if (!newCompany.isEmpty()) {
                        job.company = newCompany;
                    }

                    // EDIT SALARY
                    System.out.print("New Salary: ");
                    String salaryInput = sc.nextLine();

                    if (!salaryInput.isEmpty()) {
                        try {
                            double newSalary = Double.parseDouble(salaryInput);
                            if (newSalary < 0) {
                                System.out.println("Salary cannot be negative. Keeping old value.");
                            } else {
                                job.estimatedSalary = newSalary;
                            }
                        } catch (NumberFormatException e) {
                            System.out.println("Invalid salary format. Keeping old value.");
                        }
                    }

                    // EDIT RESUME
                    System.out.print("New Resume File: ");
                    String newResume = sc.nextLine();
                    if (!newResume.isEmpty()) {
                        job.resumeFile = newResume;
                    }

                    // AFTER
                    System.out.println("\n----- UPDATED APPLICATION -----");
                    System.out.println("Title   : " + job.title);
                    System.out.println("Company : " + job.company);
                    System.out.println("Salary  : RM " + job.estimatedSalary);
                    System.out.println("Resume  : " + job.resumeFile);

                    // UAT RESULT
                    System.out.println("\n===== USER ACCEPTANCE RESULT =====");
                    System.out.println("Application edited successfully.");
                    System.out.println("Resume updated.");

                    break;

                // ===================== EXIT =====================
                case 3:
                    System.out.println("Demo ended.");
                    sc.close();
                    return;

                default:
                    System.out.println("Invalid option. Please choose 1-3.");
            }
        }
    }

    // ===================== DISPLAY =====================
    static void displayJobs(ArrayList<Job> jobs, String seekerName) {
        System.out.println("\n===== Applied Jobs for " + seekerName + " =====");

        if (jobs.isEmpty()) {
            System.out.println("No applications found.");
            return;
        }

        System.out.printf("%-5s %-20s %-20s %-10s %-20s%n",
                "No", "Job Title", "Company", "Salary", "Resume");

        System.out.println("---------------------------------------------------------------------");

        for (int i = 0; i < jobs.size(); i++) {
            Job j = jobs.get(i);
            System.out.printf("%-5d %-20s %-20s %-10.2f %-20s%n",
                    i + 1, j.title, j.company, j.estimatedSalary, j.resumeFile);
        }
    }
}