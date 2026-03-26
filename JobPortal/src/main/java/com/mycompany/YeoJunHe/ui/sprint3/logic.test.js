/**
 * @jest-environment jsdom
 */

// We mock the required HTML structure for recommended.js
function setupDOM() {
  document.body.innerHTML = `
    <div id="profileHint"></div>
    <div id="recommendationStatus"></div>
    <div id="recommendationList"></div>
    
    <input id="skillInput" />
    <input id="prevJobInput" />
    <select id="experienceSelect">
      <option value="Junior">Junior</option>
      <option value="Senior">Senior</option>
      <option value="Director">Director</option>
    </select>
    <select id="locationSelect"></select>
    <input id="minSalary" />
    <input id="maxSalary" />
    
    <button id="recommendBtn"></button>
    <button id="resetBtn"></button>
    <button id="refreshRecommendationsBtn"></button>
    
    <select id="primaryFilter">
      <option value="best">Best Match</option>
      <option value="skills">Skills</option>
      <option value="location">Location</option>
      <option value="role">Role</option>
    </select>

    <!-- Sidebar Elements -->
    <button id="profileToggleBtn"></button>
    <button id="sidebarCloseBtn"></button>
    <div id="sidebarOverlay"></div>
    <div id="profileSidebar"></div>
    <button id="saveProfileBtn"></button>
    <input id="skills" />
    <input id="jobRole" />
    <input id="location" />
    <input id="salaryRange" />
    <select id="experience"></select>
  `;
}

describe('Job Recommendation Tests (Sprint 3)', () => {

  beforeEach(() => {
    setupDOM();
    jest.resetModules();
    
    // Default mock JOBS array
    global.JOBS = [
      { id: 1, title: 'Frontend Developer', company: 'Tech Corp', location: 'KL', salary: 4000, requiredSkills: ['HTML', 'JS', 'CSS'] },
      { id: 2, title: 'Senior Backend Engineer', company: 'Data Inc', location: 'Penang', salary: 8000, requiredSkills: ['Java', 'SQL'] },
      { id: 3, title: 'Director of Engineering', company: 'Global Solutions', location: 'KL', salary: 15000, requiredSkills: ['Leadership', 'Management'] },
      { id: 4, title: 'Junior Data Analyst', company: 'Analytix', location: 'Johor', salary: 3500, requiredSkills: ['Python', 'SQL'] },
      { id: 5, title: 'UI/UX Designer', company: 'Design Hub', location: 'KL', salary: 4500, requiredSkills: ['Figma', 'Sketch'] },
      { id: 6, title: 'Product Manager', company: 'Tech Corp', location: 'KL', salary: 7000, requiredSkills: ['Agile', 'Jira'] }
    ];

    // Clear local storage
    localStorage.clear();
  });

  test('1. System allows the user to view a list of recommended jobs when their profile contains at least one skill or previous job title', () => {
    // Setting user profile with at least one skill
    localStorage.setItem('userProfile', JSON.stringify({ skills: 'JS', experience: 'Junior' }));
    
    // Load the recommended.js script which executes logic on DOMContentLoaded
    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const cards = document.querySelectorAll('.job-card');
    
    // Assertion: Expect job cards to be rendered to the user
    expect(cards.length).toBeGreaterThan(0);
    // Assertion: We should not see the "no-results" fallback if valid skills exist
    expect(document.querySelector('.no-results')).toBeNull();
  });

  test('2. System should display notification that there are no recommended jobs if the user profile doesn’t contain any skill', () => {
    // Setting an empty user profile without skills
    localStorage.setItem('userProfile', JSON.stringify({ skills: '', jobRole: '', location: '', experience: 'Junior' }));
    
    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const statusText = document.getElementById('recommendationStatus').textContent;
    
    // Assertion: Status text mentions no matching jobs
    expect(statusText).toMatch(/No matching jobs|No profile/i);
    // Assertion: A fallback element indicating no results should be present
    expect(document.querySelector('.no-results')).not.toBeNull();
  });

  test('3. System should filter recommendations based on the user\\'s preferred location, salary range and skills', () => {
    localStorage.setItem('userProfile', JSON.stringify({ 
      skills: 'Java', 
      location: 'Penang',
      salaryRange: '7000 - 9000',
      experience: 'Senior'
    }));

    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const cards = document.querySelectorAll('.job-card');
    // Based on the mock global.JOBS, this profile should perfectly match the 'Senior Backend Engineer'
    expect(cards.length).toBe(1);
    
    const title = cards[0].querySelector('.job-title').textContent;
    expect(title).toBe('Senior Backend Engineer');
  });

  test('4. Recommended jobs should align with the user’s years of experience. (Junior rejects Senior/Director)', () => {
    localStorage.setItem('userProfile', JSON.stringify({ 
      skills: 'Java, HTML, Leadership', // Skills match senior/director roles as well
      experience: 'Junior' // But experience is strictly Junior
    }));

    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const cards = Array.from(document.querySelectorAll('.job-card'));
    const titles = cards.map(c => c.querySelector('.job-title').textContent.toLowerCase());
    
    // Intentional fail if logic isn't strictly enforcing experience filtering
    // The test must fail if any senior or director roles appear
    expect(titles.some(t => t.includes('senior'))).toBe(false);
    expect(titles.some(t => t.includes('director'))).toBe(false);
  });

  test('5. System allows the user to see the details of the recommended jobs for further consideration', () => {
    localStorage.setItem('userProfile', JSON.stringify({ skills: 'JS', experience: 'Junior' }));
    
    // Mock the global openModal function that interacts with details
    global.openModal = jest.fn();

    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const card = document.querySelector('.job-card');
    expect(card).not.toBeNull();

    // Simulate clicking the job card
    card.dispatchEvent(new Event('click'));
    
    // Assertion: Clicking the job opens the details modal
    expect(global.openModal).toHaveBeenCalled();
  });

  test('6. System should be able to display the recommendation elements for each job posting, showing why the job is recommended', () => {
    localStorage.setItem('userProfile', JSON.stringify({ skills: 'JS', experience: 'Junior' }));
    
    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const cards = document.querySelectorAll('.job-card');
    expect(cards.length).toBeGreaterThan(0);

    // Grab the first job card and check its matching badges
    const matchBadges = cards[0].querySelectorAll('.match-badge');
    
    // Assertion: Should display elements specifying why it was recommended
    expect(matchBadges.length).toBeGreaterThan(0);
    expect(matchBadges[0].textContent).toBeTruthy();
  });

  test('7. User can see a list of at least 5 job cards that include the Job Title, Company Name, and Location without needing to click', () => {
    // Provide a broad profile to match many
    localStorage.setItem('userProfile', JSON.stringify({ 
      skills: 'JS, Java, Python, Figma, Agile', 
      experience: 'Director' // To allow all levels of roles
    }));

    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const cards = document.querySelectorAll('.job-card');
    
    // Assertion: Need at least 5 job cards
    expect(cards.length).toBeGreaterThanOrEqual(5);
    
    // Verify each card contains Title, Company Name, and Location visually
    cards.forEach(card => {
      const title = card.querySelector('.job-title');
      const meta = card.querySelector('.job-meta');
      
      // Expected to fail if '.job-company' is not implemented yet
      const company = card.querySelector('.job-company'); 
      
      expect(title).not.toBeNull();
      expect(meta).not.toBeNull(); // Meta contains location typically
      expect(company).not.toBeNull(); 
      expect(company.textContent.trim()).not.toBe('');
    });
  });

  test('8. User can see a "Dismiss" (X) icon on each job card that, when clicked, removes the card from their current view', () => {
    localStorage.setItem('userProfile', JSON.stringify({ skills: 'JS', experience: 'Junior' }));
    
    require('./recommended.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    let cards = document.querySelectorAll('.job-card');
    expect(cards.length).toBeGreaterThan(0);

    const firstCard = cards[0];
    
    // Expected to fail if dismiss icon is not implemented yet
    const dismissBtn = firstCard.querySelector('.dismiss-icon');
    expect(dismissBtn).not.toBeNull();
    
    // Assuming dismiss button contains 'X'
    expect(dismissBtn.textContent).toBe('X'); 

    // Simulate clicking dismiss button
    dismissBtn.dispatchEvent(new Event('click'));

    // Re-query cards and assert the count decreased by 1
    const newCards = document.querySelectorAll('.job-card');
    expect(newCards.length).toBe(cards.length - 1);
  });

});
