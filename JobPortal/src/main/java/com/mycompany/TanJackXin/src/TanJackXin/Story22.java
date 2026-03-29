package TanJackXin;

import java.util.ArrayList;
import java.util.Scanner;

public class Story22 {

    // ===================== Job Class =====================
    static class Job {
        String title;
        String company;
        double estimatedSalary;
        String resumeFile;
        String status;

        Job(String title, String company, double estimatedSalary, String resumeFile) {
            this.title = title;
            this.company = company;
            this.estimatedSalary = estimatedSalary;
            this.resumeFile = resumeFile;
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

    static boolean isValidResume(String file) {
        return file.toLowerCase().matches(".*\\.(pdf|doc|docx|jpg|png)$");
    }

    // ===================== Job Seeker =====================
    static class JobSeeker {
        ArrayList<Job> appliedJobs = new ArrayList<>();

        void applyJob(Job job) {
            appliedJobs.add(job);
            System.out.println("Application submitted successfully!");
        }

        void addDemoJob(Job job) {
            appliedJobs.add(job);
        }

        void viewJobs() {
            System.out.println("\n===== Applied Jobs =====");

            if (appliedJobs.isEmpty()) {
                System.out.println("No applications found.");
                return;
            }

            System.out.printf("%-5s %-20s %-20s %-10s %-20s %-15s%n",
                    "No", "Title", "Company", "Salary", "Resume", "Status");

            System.out.println("--------------------------------------------------------------------------");

            for (int i = 0; i < appliedJobs.size(); i++) {
                Job j = appliedJobs.get(i);
                System.out.printf("%-5d %-20s %-20s %-10.2f %-20s %-15s%n",
                        i + 1, j.title, j.company, j.estimatedSalary, j.resumeFile, j.status);
            }
        }
    }

    // ===================== SAFE INPUT =====================
    static int getValidInt(Scanner sc) {
        while (true) {
            try {
                return Integer.parseInt(sc.nextLine());
            } catch (Exception e) {
                System.out.print("Invalid input. Enter a number: ");
            }
        }
    }

    static double getValidDouble(Scanner sc) {
        while (true) {
            try {
                return Double.parseDouble(sc.nextLine());
            } catch (Exception e) {
                System.out.print("Invalid number. Enter again: ");
            }
        }
    }

    // ===================== MAIN =====================
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        JobSeeker seeker = new JobSeeker();

        // ===== DEMO DATA =====
        seeker.addDemoJob(new Job("Software Engineer", "Google", 5000, "resume1.pdf"));
        seeker.addDemoJob(new Job("Data Analyst", "Shopee", 4200, "resume2.pdf"));
        seeker.addDemoJob(new Job("System Developer", "Intel", 4800, "resume3.pdf"));

        while (true) {
            System.out.println("\n=========== MENU ===========");
            System.out.println("1. Apply Job");
            System.out.println("2. View Jobs");
            System.out.println("3. Withdraw Application");
            System.out.println("4. Exit");
            System.out.print("Choose option: ");

            int option = getValidInt(sc);

            switch (option) {

                // APPLY
                case 1:

                    String title;
                    while (true) {
                        System.out.print("Enter job title: ");
                        title = sc.nextLine();

                        if (!isValidTitle(title)) {
                            System.out.println("Invalid title format.");
                        } else break;
                    }

                    String company;
                    while (true) {
                        System.out.print("Enter company: ");
                        company = sc.nextLine();

                        if (!isValidCompany(company)) {
                            System.out.println("Invalid company.");
                        } else break;
                    }

                    double salary;
                    while (true) {
                        System.out.print("Enter salary: ");
                        salary = getValidDouble(sc);

                        if (!isValidSalary(salary)) {
                            System.out.println("Minimum salary RM1500.");
                        } else break;
                    }

                    String resume;
                    while (true) {
                        System.out.print("Enter resume file: ");
                        resume = sc.nextLine();

                        if (!isValidResume(resume)) {
                            System.out.println("Invalid file type.");
                        } else break;
                    }

                    seeker.applyJob(new Job(title, company, salary, resume));
                    break;

                // VIEW
                case 2:
                    seeker.viewJobs();
                    break;

                // WITHDRAW
                case 3:
                    seeker.viewJobs();

                    if (seeker.appliedJobs.isEmpty()) break;

                    System.out.print("Enter number to withdraw: ");
                    int idx = getValidInt(sc);

                    if (idx >= 1 && idx <= seeker.appliedJobs.size()) {
                        Job job = seeker.appliedJobs.get(idx - 1);

                        if (job.status.equalsIgnoreCase("Cancelled")) {
                            System.out.println("Already cancelled.");
                        } else {
                            job.status = "Cancelled";
                            System.out.println("Application withdrawn (Cancelled).");
                        }

                    } else {
                        System.out.println("Invalid selection.");
                    }
                    break;

                case 4:
                    System.out.println("Exit system.");
                    return;

                default:
                    System.out.println("Invalid option.");
            }
        }
    }
}