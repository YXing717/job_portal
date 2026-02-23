package com.mycompany.gunyuxing;

import java.util.ArrayList;
import java.util.List;

public class Profile {
    private List<String> skills = new ArrayList<>();
    private List<WorkExperience> workExperiences = new ArrayList<>();

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<WorkExperience> getWorkExperiences() {
        return workExperiences;
    }

    public void setWorkExperiences(List<WorkExperience> workExperiences) {
        this.workExperiences = workExperiences;
    }
}