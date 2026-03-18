package com.mycompany.job_portal;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.BoxLayout;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.CardLayout;
import java.awt.Dimension;
import java.awt.Component;

public class JobPortal extends JFrame{
  private CardLayout cardLayout;
  private JPanel mainPanel;
  private JComboBox<JobPost> jobList;
  private JComboBox<String> jobTypeBox;
  private JComboBox<String> jobCategoryBox;
  private JTextField jobTitleField;
  private JTextField jobCompanyField;
  private JTextField jobLocationField;
  private JTextArea jobDescriptionArea;
  private JTextField jobSalaryField;
  private ArrayList<JobPost> jobs = new ArrayList<>();
  private final String FILE_NAME = "jobs.csv";
  private boolean updateMode = false;
  private JPanel jobListPanel;

  public JobPortal() {
        loadJobs();

        setTitle("Edit Job Post");
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        cardLayout = new CardLayout();
        mainPanel = new JPanel(cardLayout);

        mainPanel.add(createMenuPanel(), "MENU");
        mainPanel.add(createFormPanel(), "FORM");

        add(mainPanel);

        cardLayout.show(mainPanel, "MENU");
    }

  // UI methods
  private JPanel createMenuPanel() {

        JPanel panel = new JPanel(new BorderLayout(20, 20));
        // title
        JLabel title = new JLabel("Job Portal System", JLabel.CENTER);
        title.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 24));
        panel.add(title, BorderLayout.NORTH);
        // button container
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new BoxLayout(buttonPanel, BoxLayout.Y_AXIS));
        JButton createBtn = new JButton("Create New Job Post");
        JButton updateBtn = new JButton("Update Existing Job Post");
        createBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        updateBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        createBtn.setMaximumSize(new Dimension(250, 40));
        updateBtn.setMaximumSize(new Dimension(250, 40));
        buttonPanel.add(createBtn);
        buttonPanel.add(javax.swing.Box.createVerticalStrut(20));
        buttonPanel.add(updateBtn);
        panel.add(buttonPanel, BorderLayout.CENTER);
        // button actions
        createBtn.addActionListener(e -> {
            updateMode = false;
            clearFields();
            
            jobListPanel.setVisible(false);
            cardLayout.show(mainPanel, "FORM");
        });
        updateBtn.addActionListener(e -> {
            updateMode = true;

            jobListPanel.setVisible(true);
            
            if (!jobs.isEmpty()) {
                displaySelectedJob();
            }

            cardLayout.show(mainPanel, "FORM");
        });
        return panel;
    }

  private JPanel createFormPanel() {

        JPanel panel = new JPanel(new BorderLayout());

        jobListPanel = new JPanel(new BorderLayout());
        jobList = new JComboBox<>(jobs.toArray(new JobPost[0]));
        jobListPanel.add(jobList, BorderLayout.CENTER);

        panel.add(jobListPanel, BorderLayout.NORTH);

        JPanel form = new JPanel(new GridLayout(7, 2, 10, 10));

        form.add(new JLabel("Job Title:"));
        jobTitleField = new JTextField();
        form.add(jobTitleField);

        form.add(new JLabel("Job Type:"));
        jobTypeBox = new JComboBox<>(new String[]{
            "Select Job Type",
            "Internship",
            "Permanent"
        });
        form.add(jobTypeBox);
    
        form.add(new JLabel("Company:"));
        jobCompanyField = new JTextField();
        form.add(jobCompanyField);

        form.add(new JLabel("Location:"));
        jobLocationField = new JTextField();
        form.add(jobLocationField);

        form.add(new JLabel("Description:"));
        jobDescriptionArea = new JTextArea();
        form.add(new JScrollPane(jobDescriptionArea));

        form.add(new JLabel("Category:"));
        jobCategoryBox = new JComboBox<>(new String[]{
            "Select Category",
            "IT",
            "Finance",
            "Marketing",
            "Engineering",
            "Healthcare",
            "Education"
        });
        form.add(jobCategoryBox);
    
        form.add(new JLabel("Salary:"));
        jobSalaryField = new JTextField();
        form.add(jobSalaryField);

        panel.add(form, BorderLayout.CENTER);

        JPanel buttons = new JPanel();

        JButton saveBtn = new JButton("Save");
        JButton backBtn = new JButton("Back");

        saveBtn.addActionListener(e -> {
            if (updateMode) {
                updateJob();
            } else {
                addJob();
            }
        });

        backBtn.addActionListener(e -> cardLayout.show(mainPanel, "MENU"));

        buttons.add(saveBtn);
        buttons.add(backBtn);

        panel.add(buttons, BorderLayout.SOUTH);

        jobList.addActionListener(e -> {
            if (updateMode) {
                displaySelectedJob();
            }
        });

        return panel;
    }

  // file methods
  private void loadJobs() {
        try (BufferedReader br = new BufferedReader(new FileReader(FILE_NAME))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
              
              if (data.length < 6) {
                    continue; // skip invalid line
                }
              
                String title = data[0];
                String type = data[1];
                String company = data[2];
                String location = data[3];
                String description = data[4];
                String category = data[5];
                double salary;

              try {
                    salary = Double.parseDouble(data[6]);
                } catch (NumberFormatException e) {
                    continue; // skip invalid salary
                }

                jobs.add(new JobPost(title, type, company, location, description, category, salary));
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "jobs.csv not found");
        }
    }

    private boolean saveJobs() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_NAME))) {
          bw.write("Title,Type,Company,Location,Description,Category,Salary");
          bw.newLine();  
          
          for (JobPost job : jobs) {
                bw.write(
                        job.getJobTitle() + ","
                        + job.getJobType() + ","
                        + job.getJobCompany() + ","
                        + job.getJobLocation() + ","
                        + job.getJobDescription() + ","
                        + job.getJobCategory() + ","
                        + job.getJobSalary()
                );
                bw.newLine();
            }

          return true;
            
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "Error saving file");
          return false;
        }
    }

    // utility methods
    private void clearFields() {
        jobTitleField.setText("");
        jobTypeBox.setSelectedIndex(0);
        jobCompanyField.setText("");
        jobLocationField.setText("");
        jobDescriptionArea.setText("");
        jobCategoryBox.setSelectedIndex(0);
        jobSalaryField.setText("");
    }
  
    private void displaySelectedJob() {
        JobPost job = (JobPost) jobList.getSelectedItem();
        
        if (job != null) {
            jobTitleField.setText(job.getJobTitle());
            jobTypeBox.setSelectedItem(job.getJobType());
            jobCompanyField.setText(job.getJobCompany());
            jobLocationField.setText(job.getJobLocation());
            jobDescriptionArea.setText(job.getJobDescription());
            jobCategoryBox.setSelectedItem(job.getJobCategory());
            jobSalaryField.setText(String.valueOf(job.getJobSalary()));
        }
    }

    private void updateJob() {
        JobPost job = (JobPost) jobList.getSelectedItem();
        
        if (job != null) {
          // required field validation
            if (jobTitleField.getText().trim().isEmpty()
                    || jobTypeBox.getSelectedIndex() == 0
                    || jobCompanyField.getText().trim().isEmpty()
                    || jobLocationField.getText().trim().isEmpty()
                    || jobDescriptionArea.getText().trim().isEmpty()
                    || jobCategoryBox.getSelectedIndex() == 0
                    || jobSalaryField.getText().trim().isEmpty()) {

                JOptionPane.showMessageDialog(this, "All fields are required.");
                return;
            }

            // salary validation
            double salary;
            try {
                salary = Double.parseDouble(jobSalaryField.getText());
            } catch (NumberFormatException e) {
                JOptionPane.showMessageDialog(this, "Salary must be a valid number.");
                return;
            }  
          
            job.setJobTitle(jobTitleField.getText());
            job.setJobType((String) jobTypeBox.getSelectedItem());
            job.setJobCompany(jobCompanyField.getText());
            job.setJobLocation(jobLocationField.getText());
            job.setJobDescription(jobDescriptionArea.getText());
            job.setJobCategory((String) jobCategoryBox.getSelectedItem());
            job.setJobSalary(Double.parseDouble(jobSalaryField.getText()));

            if (saveJobs()) {
                JOptionPane.showMessageDialog(this, "Job updated successfully!");
            }
        }
    }

  // CRUD methods
  public void addJob() {
        if (jobTitleField.getText().trim().isEmpty()
                || jobTypeBox.getSelectedIndex() == 0
                || jobCompanyField.getText().trim().isEmpty()
                || jobLocationField.getText().trim().isEmpty()
                || jobDescriptionArea.getText().trim().isEmpty()
                || jobCategoryBox.getSelectedIndex() == 0
                || jobSalaryField.getText().trim().isEmpty()) {

            JOptionPane.showMessageDialog(this, "All fields are required.");
            return;
        }

        double salary;
        try {
            salary = Double.parseDouble(jobSalaryField.getText());
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Salary must be a valid number.");
            return;
        }

        JobPost newJob = new JobPost(
                jobTitleField.getText(),
                (String) jobTypeBox.getSelectedItem(),
                jobCompanyField.getText(),
                jobLocationField.getText(),
                jobDescriptionArea.getText(),
                (String) jobCategoryBox.getSelectedItem(),
                salary
        );

        jobs.add(newJob);

        jobList.addItem(newJob);

        if (saveJobs()) {
            JOptionPane.showMessageDialog(this, "New job posted successfully");
        }

        // clear fields
        jobTitleField.setText("");
        jobTypeBox.setSelectedIndex(0);
        jobCompanyField.setText("");
        jobLocationField.setText("");
        jobDescriptionArea.setText("");
        jobCategoryBox.setSelectedIndex(0);
        jobSalaryField.setText("");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new JobPortal().setVisible(true));
    }
}
