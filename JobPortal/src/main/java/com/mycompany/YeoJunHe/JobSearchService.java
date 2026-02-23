package com.mycompany.YeoJunHe;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
 

public class JobSearchService {

    public enum SearchMode { EXACT, PARTIAL, MULTI_AND }

    public static String normalize(String s) {
        if (s == null) return "";
        String n = Normalizer.normalize(s, Normalizer.Form.NFD);
        // remove diacritics
        n = n.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    // keep alphanumeric and spaces
    n = n.replaceAll("[^\\p{Alnum} ]+", " ");
        n = n.toLowerCase(Locale.ROOT).trim().replaceAll("\\s+", " ");
        return n;
    }

    public static class PaginatedResult {
        public final List<jobsearch> results;
        public final int totalResults;
        public final int totalPages;
        public final int page;

        public PaginatedResult(List<jobsearch> results, int totalResults, int totalPages, int page) {
            this.results = results;
            this.totalResults = totalResults;
            this.totalPages = totalPages;
            this.page = page;
        }
    }

    public PaginatedResult search(List<jobsearch> jobs, String query, SearchMode mode, int page, int pageSize) {
        if (jobs == null) jobs = Collections.emptyList();
        String qNorm = normalize(query);

        List<jobsearch> matched = new ArrayList<>();

        switch (mode) {
            case EXACT:
                for (jobsearch j : jobs) {
                    if (normalize(j.getJobTitle()).equals(qNorm)) matched.add(j);
                }
                break;
            case PARTIAL:
                for (jobsearch j : jobs) {
                    if (normalize(j.getJobTitle()).contains(qNorm)) matched.add(j);
                }
                break;
            case MULTI_AND:
                // split by spaces and require all keywords appear
                String[] parts = qNorm.isEmpty() ? new String[0] : qNorm.split(" ");
                for (jobsearch j : jobs) {
                    String title = normalize(j.getJobTitle());
                    boolean all = true;
                    for (String p : parts) {
                        if (!title.contains(p)) { all = false; break; }
                    }
                    if (all && parts.length>0) matched.add(j);
                }
                break;
            default:
                break;
        }

        // sort results by title for deterministic output
        matched.sort(Comparator.comparing(a -> normalize(a.getJobTitle())));

        int total = matched.size();
        int totalPages = pageSize <= 0 ? 1 : (int) Math.ceil((double) total / pageSize);
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        int from = pageSize <= 0 ? 0 : (page - 1) * pageSize;
        int to = pageSize <= 0 ? total : Math.min(from + pageSize, total);

        List<jobsearch> pageList = (from >= to || total == 0) ? new ArrayList<>() : matched.subList(from, to);

        return new PaginatedResult(pageList, total, totalPages, page);
    }

    public List<String> autoSuggest(List<jobsearch> jobs, String prefix, int limit) {
        if (jobs == null) return Collections.emptyList();
        String p = normalize(prefix);
        if (p.isEmpty()) return Collections.emptyList();

        Set<String> set = new HashSet<>();
        for (jobsearch j : jobs) {
            String norm = normalize(j.getJobTitle());
            if (norm.startsWith(p) || norm.contains(p)) {
                set.add(j.getJobTitle());
            }
        }

        List<String> suggestions = new ArrayList<>(set);
        // sort by normalized value, then shorter titles first
        suggestions.sort(Comparator.comparing((String s) -> normalize(s)).thenComparing(String::length));

        if (limit > 0 && suggestions.size() > limit) {
            return suggestions.subList(0, limit);
        }
        return suggestions;
    }
}
