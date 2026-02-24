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
}
