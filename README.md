# StudyBuddy: Peer Tutoring and Study Partner Finder

CSC 3215: Web Technologies, Fall 26-27. Group 09, Section L. Midterm Project Submission (Prototype Part 1).

StudyBuddy helps university students find peer tutors and study partners by department, course, availability and preferred study method (online, in-person or hybrid).

## Technologies
Pure HTML, CSS and JavaScript only. No framework or library is used. (PHP + MySQL come in later submissions.)

## How to run
Open `index.html` in a browser. No build step or server is needed.
All forms use `action="#"` for now, so nothing is saved until the PHP part.

## What is included
- **HTML:** all required pages for the four user types plus common pages.
- **CSS:** `css/common.css` is shared by every page. Each role has its own file with its own colour theme: `student.css`, `tutor.css`, `coordinator.css`, `admin.css`.
- **JavaScript:** `js/common.js` holds the shared features (validation, navigation, password tools, animations, dark mode). Each role has its own file: `student.js`, `tutor.js`, `coordinator.js`, `admin.js`.

## Folder = user type = group member
| Folder | Owner | Pages |
|---|---|---|
| `/` (common) | Group Leader (`common.css`, `common.js`) | index, register, login, forgot/reset/change password, profile |
| `student/` | Member 1 (`student.css`, `student.js`) | dashboard, find-partners, partner-requests, book-session, my-sessions, review |
| `tutor/` | Member 2 (`tutor.css`, `tutor.js`) | dashboard, tutor-profile, availability, session-requests, resources |
| `coordinator/` | Member 3 (`coordinator.css`, `coordinator.js`) | dashboard, tutor-applications, courses, reports, activity |
| `admin/` | Member 4 (`admin.css`, `admin.js`) | dashboard, users, departments, announcements, analytics |

## Documents
The updated project proposal is in [`docs/Group_09_Project_Proposal_Web_Technologies.docx`](docs/Group_09_Project_Proposal_Web_Technologies.docx).

## Group 09 (Section L)
| SL | Student ID | Name | Role |
|---|---|---|---|
| 1 | 22-49062-3 | Md. Abujar Giffari Afrid | Group Leader |
| 2 | 22-49080-3 | Arafat Hossain | Member |
| 3 | 22-49050-3 | Abdun Nur Nafis | Member |
| 4 | 22-49534-3 | Nur Jahan Nishy | Member |
