package com.mycompany.job_portal;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.swing.*;
import java.awt.*;

import com.toedter.calendar.JDateChooser;

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
  private JSpinner jobSalarySpinner;
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
        mainPanel.add(createJobListPanel(), "JOB_LIST");

        add(mainPanel);

        cardLayout.show(mainPanel, "MENU");
    }

  // -------------------------UI METHODS----------------------------
  private JPanel createMenuPanel() {
        // menu
        JPanel panel = new JPanel(new BorderLayout(20, 20));
        JLabel title = new JLabel("Job Portal System", JLabel.CENTER);
        title.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 24));
        panel.add(title, BorderLayout.NORTH);
        // buttons
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new BoxLayout(buttonPanel, BoxLayout.Y_AXIS));
    
        JButton createBtn = new JButton("Create New Job Post");
        createBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        createBtn.setMaximumSize(new Dimension(250, 40));
    
        JButton updateBtn = new JButton("Update Existing Job Post");
        updateBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        updateBtn.setMaximumSize(new Dimension(250, 40));

        JButton listJobsBtn = new JButton("List of Jobs");
        listJobsBtn.setAlignmentX(Component.CENTER_ALIGNMENT);
        listJobsBtn.setMaximumSize(new Dimension(250, 40));
    
        buttonPanel.add(createBtn);
        buttonPanel.add(javax.swing.Box.createVerticalStrut(20));
        buttonPanel.add(updateBtn);
        buttonPanel.add(javax.swing.Box.createVerticalStrut(20));
        buttonPanel.add(listJobsBtn);
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
    
        listJobsBtn.addActionListener(e -> {
            refreshJobListPanel();
            cardLayout.show(mainPanel, "JOB_LIST");
        });
        return panel;
    }

  private JPanel createFormPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        jobListPanel = new JPanel(new BorderLayout());
        jobList = new JComboBox<>(jobs.toArray(new JobPost[0]));
        jobList.setRenderer(new DefaultListCellRenderer() {
            @Override
            public Component getListCellRendererComponent(JList<?> list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
                super.getListCellRendererComponent(list, value, index, isSelected, cellHasFocus);
                if (value instanceof JobPost job) {
                    if (job.isExpired()) {
                        setForeground(Color.RED);
                    } else {
                        setForeground(Color.BLACK);
                    }
                }
                return this;
            }
        });

        jobList.addActionListener(e -> {
            JobPost selected = (JobPost) jobList.getSelectedItem();
            if (selected != null && selected.isExpired()) {
                JOptionPane.showMessageDialog(this, "This job is closed and cannot be selected.");
                jobList.setSelectedIndex(-1); // reset selection
            }
        });
    
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
        jobSalarySpinner = new JSpinner(
                new SpinnerNumberModel(1000, 0, 50000, 500)
        );
        form.add(jobSalarySpinner);
    
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

    private JPanel jobListContainer;

    private JPanel createJobListPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));

        JLabel title = new JLabel("Job Listings", JLabel.CENTER);
        title.setFont(new java.awt.Font("Arial", java.awt.Font.BOLD, 20));
        panel.add(title, BorderLayout.NORTH);

        // class variable
        jobListContainer = new JPanel();
        jobListContainer.setLayout(new BoxLayout(jobListContainer, BoxLayout.Y_AXIS));

        JScrollPane scrollPane = new JScrollPane(jobListContainer);
        panel.add(scrollPane, BorderLayout.CENTER);

        JButton backBtn = new JButton("Back");
        backBtn.addActionListener(e -> cardLayout.show(mainPanel, "MENU"));
        panel.add(backBtn, BorderLayout.SOUTH);

        return panel;
    }

  // ---------------FILE METHODS-------------------
  private void loadJobs() {
        try (BufferedReader br = new BufferedReader(new FileReader(FILE_NAME))) {
            String line;
            br.readLine();
          
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",(?=(?:[^"]*"[^"]*")*[^"]*$)");
              
                if (data.length < 8) {
                    continue; // skip invalid line
                }
              
                String title = data[0];
                String type = data[1];
                String company = data[2];
                String location = data[3];
                String description = data[4];
                String category = data[5];
                double salary = Double.parseDouble(data[6]);
                String closingDate = data[7].replace("\"", "");

                jobs.add(new JobPost(title, type, company, location, description, category, salary, closingDate));
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "jobs.csv not found");
        }
    }

    private boolean saveJobs() {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(FILE_NAME))) {
          bw.write("Title,Type,Company,Location,Description,Category,Salary,Closing Date");
          bw.newLine();  
          
          for (JobPost job : jobs) {
                bw.write(
                        "\"" + job.getJobTitle() + "\","
                        + "\"" + job.getJobType() + "\","
                        + "\"" + job.getJobCompany() + "\","
                        + "\"" + job.getJobLocation() + "\","
                        + "\"" + job.getJobDescription() + "\","
                        + "\"" + job.getJobCategory() + "\","
                        + String.format("%.2f", job.getJobSalary()) + ","
                        + "\"" + job.getClosingDate() + "\""
                );
                bw.newLine();
            }

          return true;
            
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "Error saving file");
          return false;
        }
    }
    // ----------------------------------------------

    // --------------UTILITY METHODS-----------------
    private void clearFields() {
        jobTitleField.setText("");
        jobTypeBox.setSelectedIndex(0);
        jobCompanyField.setText("");
        jobLocationField.setText("");
        jobDescriptionArea.setText("");
        jobCategoryBox.setSelectedIndex(0);
        jobSalarySpinner.setValue(1000);
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
            jobSalarySpinner.setValue((int) job.getJobSalary());
        }
    }

    private void fieldValidation() {
        if (jobTitleField.getText().trim().isEmpty()
                || jobTypeBox.getSelectedIndex() == 0
                || jobCompanyField.getText().trim().isEmpty()
                || jobLocationField.getText().trim().isEmpty()
                || jobDescriptionArea.getText().trim().isEmpty()
                || jobCategoryBox.getSelectedIndex() == 0) {

            JOptionPane.showMessageDialog(this, "All fields are required.");
            return;
        }
    }

    private void refreshJobListPanel() {
        jobListContainer.removeAll();

        for (JobPost job : jobs) {
            JPanel row = new JPanel(new BorderLayout());

            JLabel jobLabel = new JLabel(job.toString());
            JButton setDateBtn = new JButton("Set Closing Date");

            row.add(jobLabel, BorderLayout.CENTER);
            row.add(setDateBtn, BorderLayout.EAST);

            // Button action
            setDateBtn.addActionListener(e -> {
                showDateDialog(job);
            });

            jobListContainer.add(row);
        }

        jobListContainer.revalidate();
        jobListContainer.repaint();
    }

    private void showDateDialog(JobPost job) {
        JDateChooser dateChooser = new JDateChooser();
        dateChooser.setDateFormatString("d/M/yyyy");

        int option = JOptionPane.showConfirmDialog(
                this,
                dateChooser,
                "Set Closing Date",
                JOptionPane.OK_CANCEL_OPTION
        );

        if (option == JOptionPane.OK_OPTION) {
            Date selectedDate = dateChooser.getDate();

            if (selectedDate == null) {
                JOptionPane.showMessageDialog(this, "Please select a date.");
                return;
            }

            LocalDate today = LocalDate.now();
            LocalDate closing = selectedDate.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();

            if (closing.isBefore(today)) {
                JOptionPane.showMessageDialog(this, "Cannot set past date.");
                return;
            }

            SimpleDateFormat sdf = new SimpleDateFormat("d/M/yyyy");
            job.setClosingDate(sdf.format(selectedDate));

            saveJobs();
            refreshJobListPanel();
        }
    }
    // ------------------------------------------------

    // ----------------CRUD METHODS--------------------
    private void updateJob() {
        JobPost job = (JobPost) jobList.getSelectedItem();
        if (job.isExpired()) {
            JOptionPane.showMessageDialog(this, "This job is already closed and cannot be updated.");
            return;
        }
      
        if (job != null) {
            fieldValidation();

            double salary = (int) jobSalarySpinner.getValue();
          
            job.setJobTitle(jobTitleField.getText());
            job.setJobType((String) jobTypeBox.getSelectedItem());
            job.setJobCompany(jobCompanyField.getText());
            job.setJobLocation(jobLocationField.getText());
            job.setJobDescription(jobDescriptionArea.getText());
            job.setJobCategory((String) jobCategoryBox.getSelectedItem());
            job.setJobSalary(salary);

            if (saveJobs()) {
                JOptionPane.showMessageDialog(this, "Job updated successfully!");
            }
        }
    }

  public void addJob() {
        fieldValidation();

        double salary = (int) jobSalarySpinner.getValue();
    
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
        clearFields();
    }
    // ----------------------------------------------
  
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new JobPortal().setVisible(true));
    }
}
