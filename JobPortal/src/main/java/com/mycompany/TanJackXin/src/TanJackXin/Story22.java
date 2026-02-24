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
public class Story22 {

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
            System.out.println("✅ Application submitted successfully for " + job.title);
        }

        void viewAppliedJobs() {
            System.out.println("\n===== Applied Jobs for " + name + " =====");

            if (appliedJobs.isEmpty()) {
                System.out.println("No applications found.");
                return;
            }

            System.out.printf("%-5s %-20s %-20s %-15s%n", "No", "Job Title", "Company", "Est. Salary (RM)");
            System.out.println("--------------------------------------------------------------");
            for (int i = 0; i < appliedJobs.size(); i++) {
                Job j = appliedJobs.get(i);
                System.out.printf("%-5d %-20s %-20s %-15.2f%n", i + 1, j.title, j.company, j.estimatedSalary);
            }
        }
    }

    // ===================== MAIN METHOD =====================
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Prompt for job seeker name
        System.out.println("===========================================");
        System.out.println("    JOB APPLICATION TRACKING SYSTEM");
        System.out.println("===========================================");
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        JobSeeker seeker = new JobSeeker(name);

        while (true) {
            System.out.println("\n=========== JOB APPLICATION MENU ===========");
            System.out.println("1. Apply for Job");
            System.out.println("2. View Applied Jobs");
            System.out.println("3. Cancel Application");
            System.out.println("4. Exit");
            System.out.print("Choose option: ");

            int option;
            try {
                option = Integer.parseInt(sc.nextLine());
            } catch (Exception e) {
                System.out.println("❌ Invalid input. Enter a number.");
                continue;
            }

            // 1️⃣ Apply for Job
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
                seeker.applyJob(new Job(title, company, salary));

            // 2️⃣ View Applied Jobs
            } else if (option == 2) {
                seeker.viewAppliedJobs();

            // 3️⃣ Cancel Application
            } else if (option == 3) {
                if (seeker.appliedJobs.isEmpty()) {
                    System.out.println("No applications to cancel.");
                } else {
                    System.out.println("\nSelect application to cancel:");
                    for (int i = 0; i < seeker.appliedJobs.size(); i++) {
                        Job j = seeker.appliedJobs.get(i);
                        System.out.println((i + 1) + ". " + j);
                    }
                    System.out.print("Enter number: ");
                    try {
                        int cancel = Integer.parseInt(sc.nextLine());
                        if (cancel >= 1 && cancel <= seeker.appliedJobs.size()) {
                            seeker.appliedJobs.remove(cancel - 1);
                            System.out.println("✅ Application cancelled.");
                        } else {
                            System.out.println("❌ Invalid selection.");
                        }
                    } catch (Exception e) {
                        System.out.println("❌ Invalid input.");
                    }
                }

            // 5️⃣ Exit
            } else if (option == 4) {
                System.out.println("👋 Exiting system. Goodbye!");
                break;

            } else {
                System.out.println("❌ Invalid option. Try again.");
            }
        }

        sc.close();
    }
}

