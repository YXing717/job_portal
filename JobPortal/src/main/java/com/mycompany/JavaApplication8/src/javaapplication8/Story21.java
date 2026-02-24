/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package javaapplication8;
import java.util.ArrayList;
import java.util.Scanner;
/**
 *
 * @author jackxin
 */
public class Story21 {

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

    // ===================== Job Seeker Class =====================
    static class JobSeeker {
        String name;
        ArrayList<Job> appliedJobs = new ArrayList<>();

        JobSeeker(String name) {
            this.name = name;
        }

        void applyJob(Job job) {
            appliedJobs.add(job);
            System.out.println("\nApplication submitted successfully!");
        }

        void viewAppliedJobs() {
            System.out.println("\n================ Applied Jobs ================");

            if (appliedJobs.isEmpty()) {
                System.out.println("No jobs applied yet.");
                return;
            }

            System.out.printf("%-5s %-25s %-25s %-15s%n", "No", "Job Title", "Company", "Est. Salary (RM)");
            System.out.println("------------------------------------------------------------------");

            for (int i = 0; i < appliedJobs.size(); i++) {
                Job job = appliedJobs.get(i);
                System.out.printf("%-5d %-25s %-25s %-15.2f%n",
                        (i + 1),
                        job.title,
                        job.company,
                        job.estimatedSalary
                );
            }

            System.out.println("==============================================");
        }
    }

    // ===================== MAIN METHOD =====================
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.println("==============================================");
        System.out.println("      JOB APPLICATION TRACKING SYSTEM");
        System.out.println("==============================================");

        System.out.print("Enter job seeker name: ");
        String name = input.nextLine();

        JobSeeker seeker = new JobSeeker(name);

        int choice = -1;

        do {
            System.out.println("\n----------- MENU -----------");
            System.out.println("1. Apply for Job");
            System.out.println("2. View Applied Jobs");
            System.out.println("3. Exit");
            System.out.print("Choose option: ");

            // Handle invalid input
            if (!input.hasNextInt()) {
                System.out.println("Invalid input. Please enter a number.");
                input.next(); // clear input
                continue;
            }

            choice = input.nextInt();
            input.nextLine(); // consume newline

            switch (choice) {

                case 1:
                    System.out.println("\n--- Apply for Job ---");

                    System.out.print("Enter job title: ");
                    String title = input.nextLine();

                    System.out.print("Enter company name: ");
                    String company = input.nextLine();

                    System.out.print("Enter estimated salary (RM): ");
                    double salary = 0;
                    try {
                        salary = Double.parseDouble(input.nextLine());
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid salary input. Setting salary to 0.");
                    }

                    seeker.applyJob(new Job(title, company, salary));
                    break;

                case 2:
                    seeker.viewAppliedJobs();
                    break;

                case 3:
                    System.out.println("\nExiting system. Goodbye!");
                    break;

                default:
                    System.out.println("Invalid choice. Try again.");
            }

        } while (choice != 3);

        input.close();
    }
}
