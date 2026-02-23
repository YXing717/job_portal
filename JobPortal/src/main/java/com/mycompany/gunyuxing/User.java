package com.mycompany.gunyuxing;

import java.util.List;

public class User {
    private String email;
    private String role;
    private Profile profile;

    public User(String email, String role) {
        this.email = email;
        this.role = role;
        this.profile = new Profile();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
}