package com.mycompany.gunyuxing;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ProfileManager {
    private static final String FILE_PATH = "data/users.json";
    private List<User> users = new ArrayList<>();
    private User currentUser;

    public ProfileManager() {
        loadFromFile();
        if (users.isEmpty()) {
            currentUser = new User("demo@job.com", "jobseeker");
            users.add(currentUser);
        } else {
            currentUser = users.get(0);
        }
    }

    public User getCurrentUser() {
        return currentUser;
    }

    public boolean addSkill(String skill) {
        if (skill == null || skill.trim().isEmpty()) return false;
        currentUser.getProfile().getSkills().add(skill.trim());
        saveToFile();
        return true;
    }

    public void removeSkill(int index) {
        if (index >= 0 && index < currentUser.getProfile().getSkills().size()) {
            currentUser.getProfile().getSkills().remove(index);
            saveToFile();
        }
    }

    public boolean addWorkExperience(WorkExperience exp) {
        if (exp.getJobTitle().trim().isEmpty() || exp.getCompany().trim().isEmpty() ||
            exp.getStartDate().trim().isEmpty() || 
            (!exp.getEndDate().equals("Present") && exp.getEndDate().trim().isEmpty())) {
            return false;
        }
        // Date validation
        if (!exp.getStartDate().matches("\\d{4}-\\d{2}") ||
            (!exp.getEndDate().equals("Present") && !exp.getEndDate().matches("\\d{4}-\\d{2}"))) {
            return false;
        }
        currentUser.getProfile().getWorkExperiences().add(exp);
        saveToFile();
        return true;
    }

    public boolean editWorkExperience(int index, WorkExperience updated) {
        if (index < 0 || index >= currentUser.getProfile().getWorkExperiences().size()) return false;
        
        if (addWorkExperience(updated)) { 
            WorkExperience existing = currentUser.getProfile().getWorkExperiences().get(index);
            existing.setJobTitle(updated.getJobTitle());
            existing.setCompany(updated.getCompany());
            existing.setStartDate(updated.getStartDate());
            existing.setEndDate(updated.getEndDate());
            existing.setDescription(updated.getDescription());
            saveToFile();
            return true;
        }
        return false;
    }

    public void removeWorkExperience(int index) {
        if (index >= 0 && index < currentUser.getProfile().getWorkExperiences().size()) {
            currentUser.getProfile().getWorkExperiences().remove(index);
            saveToFile();
        }
    }

    private void saveToFile() {
        try (FileWriter writer = new FileWriter(FILE_PATH)) {
            writer.write(toJson());
        } catch (IOException e) {
            System.err.println("Save failed: " + e.getMessage());
        }
    }

    private void loadFromFile() {
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            StringBuilder json = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                json.append(line);
            }
            fromJson(json.toString());
        } catch (IOException e) {
            // File not found
        }
    }

    public String getProfileJson() {
        return toJson();
    }

    public void updateFromJson(String json) {
        fromJson(json);
    }

    // Manual JSON string generation
    private String toJson() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            sb.append("{");
            sb.append("\"email\":\"").append(u.getEmail()).append("\",");
            sb.append("\"role\":\"").append(u.getRole()).append("\",");
            sb.append("\"profile\":{");
            sb.append("\"skills\":[");
            List<String> skills = u.getProfile().getSkills();
            for (int j = 0; j < skills.size(); j++) {
                sb.append("\"").append(skills.get(j).replace("\"", "\\\"")).append("\"");
                if (j < skills.size() - 1) sb.append(",");
            }
            sb.append("],");
            sb.append("\"workExperiences\":[");
            List<WorkExperience> exps = u.getProfile().getWorkExperiences();
            for (int j = 0; j < exps.size(); j++) {
                WorkExperience exp = exps.get(j);
                sb.append("{");
                sb.append("\"jobTitle\":\"").append(exp.getJobTitle().replace("\"", "\\\"")).append("\",");
                sb.append("\"company\":\"").append(exp.getCompany().replace("\"", "\\\"")).append("\",");
                sb.append("\"startDate\":\"").append(exp.getStartDate()).append("\",");
                sb.append("\"endDate\":\"").append(exp.getEndDate()).append("\",");
                sb.append("\"description\":\"").append(exp.getDescription().replace("\"", "\\\"")).append("\"");
                sb.append("}");
                if (j < exps.size() - 1) sb.append(",");
            }
            sb.append("]");
            sb.append("}");
            sb.append("}");
            if (i < users.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }

    // Manual JSON parsing
    private void fromJson(String json) {
        if (json.startsWith("[") && json.endsWith("]")) {
            String profileStr = json.substring(json.indexOf("\"profile\""), json.lastIndexOf("}"));
            // Parse skills
            String skillsStr = profileStr.substring(profileStr.indexOf("\"skills\":["), profileStr.indexOf("],\"workExperiences\""));
            String[] skillsArr = skillsStr.replace("\"skills\":[", "").split(",");
            for (String s : skillsArr) {
                currentUser.getProfile().getSkills().add(s.replace("\"", "").trim());
            }
            // Parse exps (similarly simplistic)
            // ... add parsing logic for exps if needed for initial load
        }
    }
}