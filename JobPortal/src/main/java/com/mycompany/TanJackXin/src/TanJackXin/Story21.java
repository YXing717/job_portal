package TanJackXin;

import java.util.ArrayList;
import java.util.Scanner;

public class Story21 {

    // ===================== Job Class =====================
    static class Job {
        String title;
        String company;
        double estimatedSalary;
        String status;

        Job(String title, String company, double estimatedSalary) {
            this.title = title;
            this.company = company;
            this.estimatedSalary = estimatedSalary;
            this.status = "Applied";
        }
    }

    // ===================== VALIDATION =====================
    static boolean isValidTitle(String input) {
        return input.matches("^[A-Za-z].*") || input.matches("^\\d+[A-Za-z].*");
    }

    static boolean isValidCompany(String input) {
        return input.matches(".*[A-Za-z].*");
    }

    static boolean isValidSalary(double salary) {
        return salary >= 1500;
    }

    // ===================== Job Seeker =====================
    static class JobSeeker {
        ArrayList<Job> appliedJobs = new ArrayList<>();

        void applyJob(Job job) {
            appliedJobs.add(job);
            System.out.println("\nApplication submitted successfully!");
        }

        void addDemoJob(Job job) {
            appliedJobs.add(job);
        }

        void viewAppliedJobs() {
            System.out.println("\n================ Applied Jobs ================");

            if (appliedJobs.isEmpty()) {
                System.out.println("No jobs applied yet.");
                return;
            }

            System.out.printf("%-5s %-25s %-25s %-15s %-15s%n",
                    "No", "Job Title", "Company", "Salary (RM)", "Status");
            System.out.println("-------------------------------------------------------------------------------");

            for (int i = 0; i < appliedJobs.size(); i++) {
                Job job = appliedJobs.get(i);
                System.out.printf("%-5d %-25s %-25s %-15.2f %-15s%n",
                        (i + 1),
                        job.title,
                        job.company,
                        job.estimatedSalary,
                        job.status
                );
            }

            System.out.println("=============================================================================");
        }
    }

    // ===================== SAFE INPUT =====================
    static int getValidInt(Scanner input) {
        while (true) {
            try {
                return Integer.parseInt(input.nextLine());
            } catch (Exception e) {
                System.out.print("Invalid input. Enter a number: ");
            }
        }
    }

    static double getValidDouble(Scanner input) {
        while (true) {
            try {
                return Double.parseDouble(input.nextLine());
            } catch (Exception e) {
                System.out.print("Invalid salary format. Enter again: ");
            }
        }
    }

    // ===================== MAIN =====================
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.println("==============================================");
        System.out.println("      JOB APPLICATION TRACKING SYSTEM");
        System.out.println("==============================================");

        JobSeeker seeker = new JobSeeker();

        // ===== DEMO DATA =====
        seeker.addDemoJob(new Job("Software Engineer", "Google", 5000));
        seeker.addDemoJob(new Job("Data Analyst", "Shopee", 4200));
        seeker.addDemoJob(new Job("System Developer", "Intel", 4800));

        while (true) {
            System.out.println("\n----------- MENU -----------");
            System.out.println("1. Apply for Job");
            System.out.println("2. View Applied Jobs");
            System.out.println("3. Exit");
            System.out.print("Choose option: ");

            int choice = getValidInt(input);

            switch (choice) {

                case 1:
                    System.out.println("\n--- Apply for Job ---");

                    // TITLE
                    String title;
                    while (true) {
                        System.out.print("Enter job title: ");
                        title = input.nextLine();

                        if (title.isEmpty()) {
                            System.out.println("Title cannot be empty.");
                        } else if (!isValidTitle(title)) {
                            System.out.println("Invalid title. Must start with a letter or valid format like 3D.");
                        } else {
                            break;
                        }
                    }

                    // COMPANY
                    String company;
                    while (true) {
                        System.out.print("Enter company name: ");
                        company = input.nextLine();

                        if (company.isEmpty()) {
                            System.out.println("Company cannot be empty.");
                        } else if (!isValidCompany(company)) {
                            System.out.println("Invalid company. Must contain at least one letter.");
                        } else {
                            break;
                        }
                    }

                    // SALARY
                    double salary;
                    while (true) {
                        System.out.print("Enter estimated salary (RM): ");
                        salary = getValidDouble(input);

                        if (!isValidSalary(salary)) {
                            System.out.println("Salary must be at least RM1500.");
                        } else {
                            break;
                        }
                    }

                    seeker.applyJob(new Job(title, company, salary));
                    break;

                case 2:
                    seeker.viewAppliedJobs();
                    break;

                case 3:
                    System.out.println("\nExiting system. Goodbye!");
                    input.close();
                    return;

                default:
                    System.out.println("Invalid choice. Please select 1-3.");
            }
        }
    }
}