# OCC Checkin

A simple check-in system for OCC's LANG 051N. Students will use this checkin system to check in and check out. Admins can view student checkin data and export it to a csv file.

# Features

<ol>
<li>Student Check-in</li>
- On the home screen, students can check-in by inputing their student ID and pressing the "check-in" button.
<li>Student Check-out</li>
- On the home screen, students can check-out by inputing their student ID and pressing the "check-out" button.
<li>Admin Add Student</li>
- Admins have the ability to add new students by providing:
<br>
- StudentID: Must start with a 'C', followed by 8 digits.
<br>
- First Name
<br>
- Last Name
<br>
- Math Level: Selection from a list of courses.
<br>
- Semester
<li>Admin Remove Student</li>
- Admins have the ability to remove a student by inputing their student ID.
<br>
- Then, they have the ability to unenroll a student from a semester or delete the student.
<li>Admin Edit Student</li>
- Admins have the ability to edit a student's info.
<li>Admin View Students</li>
- Admins have a table view of all students and can filter by semester.
<br>
- By clicking on a student ID will bring up an individual student page that shows all check-ins made by a student.
<li>Admin Add Course</li>
- Admins can add or remove courses by inputing the course name.
<li>Export Data </li>
- Admins can export all student checkin data or per semester.
</ol>

# Installation

1. Download and Install Node.js
2. Download and Install MongoDB
3. (Optional) Download and Install MongoDB Compass
4. Clone the repository:
5. Install the required packages
   In the main folder:

```
cd frontend
npm install
cd ..
cd backend
npm install
```

# Configuration

1. In the backend folder, create a ".env" file.
2. In the env file add this line:

```
MONGODB_URI=mongodb://localhost/occcheckin
```

3. "localhost" may need to be replaced with "128.17.1.1" depending on your system.
4. "occcheckin" can be replaced with any name.
5. The PORT can be configured by adding a PORT line:

```
PORT="PORT_NUM"
```

6. By default the port number is 5001

# Running the Application

1. A bat file, occCheckin.bat is provided. Simply run occCheckin.bat
2. Alternatively, with two terminals opened in the main folder:
   Terminal 1:
   ```
   cd frontend
   npm run start
   ```
   Terminal 2:
   ```
   cd backend
   npm start
   ```
