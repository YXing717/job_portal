package com.mycompany.YeoJunHe;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class JobPortalPage {

    private static List<jobsearch> sampleJobs() {
        List<jobsearch> jobs = new ArrayList<>();
        jobs.add(new jobsearch("Software Engineer", "New York", 120000));
        jobs.add(new jobsearch("Senior Software Engineer", "San Francisco", 160000));
        jobs.add(new jobsearch("Engineering Manager", "Austin", 150000));
        jobs.add(new jobsearch("Mechanical Engineer", "Detroit", 90000));
        jobs.add(new jobsearch("Civil Engineer", "Denver", 95000));
        jobs.add(new jobsearch("QA Engineer", "Remote", 85000));
        jobs.add(new jobsearch("Software Developer", "Remote", 110000));
        jobs.add(new jobsearch("Data Scientist", "Boston", 130000));
        jobs.add(new jobsearch("Research Engineer", "Palo Alto", 140000));
        jobs.add(new jobsearch("Electrical Engineer", "Chicago", 100000));
        jobs.add(new jobsearch("English Teacher", "Seoul", 40000));
        jobs.add(new jobsearch("Engineering Technician", "Columbus", 70000));
        return jobs;
    }

    public static void main(String[] args) {
        List<jobsearch> jobs = sampleJobs();
        JobSearchService service = new JobSearchService();

        Scanner in = new Scanner(System.in);
        System.out.println("Welcome to JobPortalPage (console tester)");
        System.out.println("Type 'exit' to quit. Type 'help' for commands.");

        int pageSize = 5;

        while (true) {
            System.out.print("\nEnter query (or 'help'): ");
            String line = in.nextLine();
            if (line == null) break;
            line = line.trim();
            if (line.equalsIgnoreCase("exit")) break;
            if (line.equalsIgnoreCase("help")) {
                System.out.println("Commands:");
                System.out.println("  help            Show this message");
                System.out.println("  exit            Quit");
                System.out.println("  suggest <text>  Show auto-suggestions for <text>");
                System.out.println("  page <n>        Set page size to n");
                System.out.println("Otherwise type a query to search (you will be asked mode and page).");
                continue;
            }

            if (line.toLowerCase().startsWith("suggest ")) {
                String pref = line.substring(8).trim();
                List<String> sug = service.autoSuggest(jobs, pref, 10);
                System.out.println("Suggestions for '" + pref + "':");
                if (sug.isEmpty()) System.out.println("  (no suggestions)");
                for (String s : sug) System.out.println("  " + s);
                continue;
            }

            if (line.toLowerCase().startsWith("page ")) {
                try {
                    int n = Integer.parseInt(line.substring(5).trim());
                    if (n > 0) { pageSize = n; System.out.println("Page size set to " + pageSize); }
                } catch (Exception e) { System.out.println("Invalid page size"); }
                continue;
            }

            // treat as search query
            System.out.print("Choose mode [exact, partial, multi] (default partial): ");
            String mode = in.nextLine().trim();
            JobSearchService.SearchMode sm = JobSearchService.SearchMode.PARTIAL;
            if (mode.equalsIgnoreCase("exact")) sm = JobSearchService.SearchMode.EXACT;
            else if (mode.equalsIgnoreCase("multi")) sm = JobSearchService.SearchMode.MULTI_AND;

            System.out.print("Page number (starting at 1, blank for 1): ");
            String pageStr = in.nextLine().trim();
            int page = 1;
            try { if (!pageStr.isEmpty()) page = Integer.parseInt(pageStr); } catch (Exception e) { page = 1; }

            JobSearchService.PaginatedResult res = service.search(jobs, line, sm, page, pageSize);
            System.out.println("\nFound " + res.totalResults + " result(s). Showing page " + res.page + " of " + res.totalPages + ".");
            if (res.results.isEmpty()) System.out.println("  (no matches)");
            for (jobsearch j : res.results) {
                System.out.println("  Title: " + j.getJobTitle() + " | Location: " + j.getJobLocation() + " | Salary: " + j.getJobSalary());
            }

            // quick next/prev loop
            while (res.totalPages > 1) {
                System.out.print("Enter 'n' for next, 'p' for prev, 'q' to quit paging, or page number: ");
                String nav = in.nextLine().trim();
                if (nav.equalsIgnoreCase("q") || nav.isEmpty()) break;
                if (nav.equalsIgnoreCase("n")) { page = Math.min(res.page + 1, res.totalPages); }
                else if (nav.equalsIgnoreCase("p")) { page = Math.max(res.page - 1, 1); }
                else {
                    try { page = Integer.parseInt(nav); } catch (Exception e) { System.out.println("Invalid input"); continue; }
                }
                res = service.search(jobs, line, sm, page, pageSize);
                System.out.println("\nFound " + res.totalResults + " result(s). Showing page " + res.page + " of " + res.totalPages + ".");
                for (jobsearch j : res.results) {
                    System.out.println("  Title: " + j.getJobTitle() + " | Location: " + j.getJobLocation() + " | Salary: " + j.getJobSalary());
                }
            }
        }

        System.out.println("Goodbye.");
        in.close();
    }
}
