/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package TanJackXin;
import java.util.ArrayList;
import java.util.Scanner;
/**
 *
 * @author jackxin
 */
public class Story23 {

    // ===================== Job Class =====================
    static class Job {
        String title;
        String company;
        double estimatedSalary;

        Job(String title, String company, double estimatedSalary) {
            this.title = title;
            this.company = company;
            this.estimatedSalary = estimatedSalary;
        }

        @Override
        public String toString() {
            return title + " at " + company + " (Est. Salary: RM " + estimatedSalary + ")";
        }
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        ArrayList<Job> appliedJobs = new ArrayList<>();

        // Prompt for job seeker name
        System.out.println("===========================================");
        System.out.println("    JOB APPLICATION TRACKING SYSTEM");
        System.out.println("===========================================");
        System.out.print("Enter your name: ");
        String seekerName = sc.nextLine();

        while (true) {
            System.out.println("\n=========== JOB APPLICATION MENU ===========");
            System.out.println("1. Apply for Job");
            System.out.println("2. View Applied Jobs");
            System.out.println("3. Cancel Application");
            System.out.println("4. Edit Application");
            System.out.println("5. Exit");
            System.out.print("Choose option: ");

            int option;
            try {
                option = Integer.parseInt(sc.nextLine());
            } catch (Exception e) {
                System.out.println("❌ Invalid input. Enter a number.");
                continue;
            }

            // 1️⃣ Apply
            if (option == 1) {
                System.out.print("Enter job title: ");
                String title = sc.nextLine();

                System.out.print("Enter company: ");
                String company = sc.nextLine();

                System.out.print("Enter estimated salary (RM): ");
                double salary;
                try {
                    salary = Double.parseDouble(sc.nextLine());
                } catch (Exception e) {
                    salary = 0;
                    System.out.println("Invalid salary input. Setting salary to 0.");
                }

                appliedJobs.add(new Job(title, company, salary));
                System.out.println("✅ Application submitted successfully for " + title);

            // 2️⃣ View
            } else if (option == 2) {
                displayJobs(appliedJobs, seekerName);

            // 3️⃣ Cancel
            } else if (option == 3) {
                displayJobs(appliedJobs, seekerName);
                if (!appliedJobs.isEmpty()) {
                    System.out.print("Enter number to cancel: ");
                    try {
                        int cancel = Integer.parseInt(sc.nextLine());
                        if (cancel >= 1 && cancel <= appliedJobs.size()) {
                            appliedJobs.remove(cancel - 1);
                            System.out.println("✅ Application cancelled.");
                        } else {
                            System.out.println("❌ Invalid selection.");
                        }
                    } catch (Exception e) {
                        System.out.println("❌ Invalid input.");
                    }
                }

            // 4️⃣ Edit Application
            } else if (option == 4) {
                displayJobs(appliedJobs, seekerName);
                if (!appliedJobs.isEmpty()) {
                    System.out.print("Enter number to edit: ");
                    try {
                        int edit = Integer.parseInt(sc.nextLine());
                        if (edit >= 1 && edit <= appliedJobs.size()) {
                            Job job = appliedJobs.get(edit - 1);

                            System.out.print("Enter new job title (current: " + job.title + "): ");
                            String newTitle = sc.nextLine();
                            if (!newTitle.isEmpty()) job.title = newTitle;

                            System.out.print("Still applying to the same company? (Y/N): ");
                            String sameCompany = sc.nextLine();
                            if (sameCompany.equalsIgnoreCase("N")) {
                                System.out.print("Enter new company name: ");
                                String newCompany = sc.nextLine();
                                if (!newCompany.isEmpty()) job.company = newCompany;
                            }

                            System.out.print("Enter new estimated salary (current: RM " + job.estimatedSalary + "): ");
                            String salaryInput = sc.nextLine();
                            if (!salaryInput.isEmpty()) {
                                try {
                                    job.estimatedSalary = Double.parseDouble(salaryInput);
                                } catch (Exception e) {
                                    System.out.println("Invalid salary input. Keeping previous salary.");
                                }
                            }

                            System.out.println("✅ Application updated successfully.");
                        } else {
                            System.out.println("❌ Invalid selection.");
                        }
                    } catch (Exception e) {
                        System.out.println("❌ Invalid input.");
                    }
                }

            // 5️⃣ Exit
            } else if (option == 5) {
                System.out.println("👋 Exiting system. Goodbye!");
                break;

            } else {
                System.out.println("❌ Invalid option.");
            }
        }

        sc.close();
    }

    // ===================== Helper: Display Jobs =====================
    static void displayJobs(ArrayList<Job> jobs, String seekerName) {
        System.out.println("\n===== Applied Jobs for " + seekerName + " =====");
        if (jobs.isEmpty()) {
            System.out.println("No applications found.");
            return;
        }

        System.out.printf("%-5s %-25s %-25s %-15s%n", "No", "Job Title", "Company", "Est. Salary (RM)");
        System.out.println("--------------------------------------------------------------");
        for (int i = 0; i < jobs.size(); i++) {
            Job j = jobs.get(i);
            System.out.printf("%-5d %-25s %-25s %-15.2f%n", i + 1, j.title, j.company, j.estimatedSalary);
        }
    }
}
