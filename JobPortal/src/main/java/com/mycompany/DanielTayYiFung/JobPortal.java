public class JobPortal extends JFrame{
  private final String FILE_NAME = "jobs.txt";
  
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
}
