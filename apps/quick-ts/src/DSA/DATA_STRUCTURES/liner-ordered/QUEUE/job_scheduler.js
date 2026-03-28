// @ts-nocheck

class JobScheduler {
  constructor() {
    this.jobs = [];
  }

  // Adds a job, which includes commented-out instructions
  addJob(code) {
    this.jobs.push(code);
  }

  // Processes jobs based on their commented-out instructions
  runJobs() {
    this.jobs.forEach(job => {
      this.executeCommentedCode(job);
    });
  }

  // Extracts and executes the commented-out instructions (function calls)
  executeCommentedCode(code) {
    const commentRegex = /\/\*\s*(.*?)\s*\*\//g;
    let match;
    while ((match = commentRegex.exec(code)) !== null) {
      const instructionName = match[1].trim();  // Get the instruction inside the comment
      if (this[instructionName]) {
        try {
          console.log(`Executing: ${instructionName}`);
          this[instructionName]();  // Call the function with the name from the comment
        } catch (error) {
          console.error(`Error executing ${instructionName}:`, error);
        }
      } else {
        console.error(`No function found for: ${instructionName}`);
      }
    }
  }

  // Predefined functions for different tasks
  logHello() {
    console.log("Hello, World!");
  }

  async fetchData() {
    console.log("Fetching data...");
    // Simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Data fetched successfully!");
  }

  logMessage(message) {
    console.log(message);
  }

  complexTask() {
    console.log("Starting complex task...");
    setTimeout(() => {
      console.log("Complex task completed!");
    }, 3000);
  }
}

// Example jobs with function references in comments
const job1 = `
/*
  logHello
*/
`;

const job2 = `
/*
  fetchData
*/
`;

const job3 = `
/*
  logMessage
  'This is a custom message from job3'
*/
`;

const job4 = `
/*
  complexTask
*/
`;

// Initialize the job scheduler and add jobs
const scheduler = new JobScheduler();
scheduler.addJob(job1);
scheduler.addJob(job2);
scheduler.addJob(job3);
scheduler.addJob(job4);

// Run the jobs
scheduler.runJobs();
