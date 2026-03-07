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

import java.awt.BorderLayout;
import java.awt.GridLayout;

public class JobPortal extends JFrame{
  private JComboBox<JobPost> jobList;
  private JTextField jobTitleField;
  private JTextField jobCompanyField;
  private JTextField jobLocationField;
  private JTextArea jobDescriptionArea;
  private JTextField jobSalaryField;

  private ArrayList<JobPost> jobs = new ArrayList<>();
  private final String FILE_NAME = "jobs.txt";

  public JobPortal() {
        loadJobs();

        setTitle("Edit Job Post");
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Dropdown list of jobs
        jobList = new JComboBox<>(jobs.toArray(new JobPost[0]));
        add(jobList, BorderLayout.NORTH);

        JPanel form = new JPanel(new GridLayout(5, 2, 10, 10));

        form.add(new JLabel("Job Title:"));
        jobTitleField = new JTextField();
        form.add(jobTitleField);

        form.add(new JLabel("Company:"));
        jobCompanyField = new JTextField();
        form.add(jobCompanyField);

        form.add(new JLabel("Location:"));
        jobLocationField = new JTextField();
        form.add(jobLocationField);

        form.add(new JLabel("Description:"));
        jobDescriptionArea = new JTextArea();
        form.add(new JScrollPane(jobDescriptionArea));

        form.add(new JLabel("Salary:"));
        jobSalaryField = new JTextField();
        form.add(jobSalaryField);

        add(form, BorderLayout.CENTER);

        JButton updateBtn = new JButton("Update Job");
        add(updateBtn, BorderLayout.SOUTH);

        jobList.addActionListener(e -> displaySelectedJob());
        updateBtn.addActionListener(e -> updateJob());

        if (!jobs.isEmpty()) {
            displaySelectedJob();
        }
    }
  
  private void loadJobs() {
        try (BufferedReader br = new BufferedReader(new FileReader(FILE_NAME))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split("\\s*\\|\\s*");
                String title = data[0];
                String company = data[1];
                String location = data[2];
                String description = data[3];
                double salary = Double.parseDouble(data[4]);

                jobs.add(new JobPost(title, company, location, description, salary));
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "jobs.txt not found");
        }
    }

    private void saveJobs() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_NAME))) {
            for (JobPost job : jobs) {
                bw.write(job.toFile());
                bw.newLine();
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "Error saving file");
        }
    }

    private void displaySelectedJob() {
        JobPost job = (JobPost) jobList.getSelectedItem();
        
        if (job != null) {
            jobTitleField.setText(job.getJobTitle());
            jobCompanyField.setText(job.getJobCompany());
            jobLocationField.setText(job.getJobLocation());
            jobDescriptionArea.setText(job.getJobDescription());
            jobSalaryField.setText(String.valueOf(job.getJobSalary()));
        }
    }

    private void updateJob() {
        JobPost job = (JobPost) jobList.getSelectedItem();
        
        if (job != null) {
          // required field validation
            if (jobTitleField.getText().trim().isEmpty()
                    || jobCompanyField.getText().trim().isEmpty()
                    || jobLocationField.getText().trim().isEmpty()
                    || jobDescriptionArea.getText().trim().isEmpty()
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
            job.setJobCompany(jobCompanyField.getText());
            job.setJobLocation(jobLocationField.getText());
            job.setJobDescription(jobDescriptionArea.getText());
            job.setJobSalary(Double.parseDouble(jobSalaryField.getText()));

            saveJobs();
            jobList.repaint();

            JOptionPane.showMessageDialog(this, "Job updated successfully!");
        }
    }

  public void addJob() {
        if (jobTitleField.getText().trim().isEmpty()
                || jobCompanyField.getText().trim().isEmpty()
                || jobLocationField.getText().trim().isEmpty()
                || jobDescriptionArea.getText().trim().isEmpty()
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
                jobCompanyField.getText(),
                jobLocationField.getText(),
                jobDescriptionArea.getText(),
                salary
        );

        jobs.add(newJob);

        jobList.addItem(newJob);

        saveJobs();

        JOptionPane.showMessageDialog(this, "New job posted successfully");

        // clear fields
        jobTitleField.setText("");
        jobCompanyField.setText("");
        jobLocationField.setText("");
        jobDescriptionArea.setText("");
        jobSalaryField.setText("");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new JobPortal().setVisible(true));
    }
}
