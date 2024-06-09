# PREP-QUIZ WEB SYSTEM

## OVERVIEW

The Web Quiz System is a client-based application designed to help students (WAEC) prepare for various exams by taking quizzes from multiple categories (past questions or personal practice quiz) and levels (BECE, WASSCE, TVET, NOVDEC). The application is built to function entirely on the client side, eliminating the need for a backend server. This project aims to provide a seamless and interactive quiz-taking experience for students.

## FEATURES

### 1. Categories and Departments

#### Multiple Categories and Levels:

The application offers quizzes in different categories such as Past Questions (WAEC) and Personal Practice Questions. Levels include WASSCE, TVET, BECE, and NOVDEC.

#### Multiple Subjects/Departments:

Users can select subject of their choice to practice.

### 2. Question Banks

### Multiple-Choice Questions:

Each subject contains a question bank of multiple-choice questions that are stored within the application.

### 3. Quiz Interaction

#### No Page Refresh:

Users can submit answers and immediately see the next question without refreshing the page.

#### Question Selection:

Users can choose the number of questions they want to answer in the personal practice quiz.

#### Timer:

Each question in the personal practice quiz has a 55-second time limit. Past Questions uses a specialized timer for each level, with 45 minutes for BECE and 60 minutes for WASSCE, TVET, and NOVDEC, adding an element of time management.

#### Feedback:

Users receive feedback of their score right after submitting the last question.

### 4. User Functionality

#### Score Tracking and History:

Users can track their scores and view their quiz history.

#### Sorting and Filtering:

The application allows pagination, sorting, and filtering of past quiz results.

### 5. User Authentication and Security

#### Secure Password Storage:

User passwords are securely stored using hashing.

#### Password Recovery:

Users can recover forgotten passwords by answering security questions.

## USER GUIDE

### 1. Registration and Login

Users can register and log in to access the quizzes. The registration process requires creating a username, and password, and setting up security questions for password recovery.

### 2. Selecting Quizzes

Once logged in, users can select a quiz by choosing the category (WAEC Past Questions or Personal Practice), level (WASSCE, TVET, NOVDEC, BECE for WAEC past questions and SHS, TVET, and JHS for personal practice questions), subject (e.g. English, Core Mathematics, Computer Programming or Database, etc.), and Year or Form (year for past question and form for practice quiz questions). They can also select the number of questions for the quiz.

### 3. Taking Quizzes

During the quiz, users will: Answer multiple-choice questions. Manage their time with the question timer. BECE quizzes have a total duration of 45 minutes. TVET, NOVDEC, and WASSCE quizzes have a total duration of 60 minutes each. For personal practice quizzes, each question has a maximum of 55 seconds for an answer of a question to be submitted.

### 4. Viewing Scores and History

After completing quizzes, users can:

1. View their scores.
2. Access past quiz results.
3. Use sorting and filtering options to organize their results.

## TECHNOLOGIES USED

### 1. Frontend Technologies

  HTML: For structuring the application.
  CSS: For styling the application.
  JavaScript: For interactive functionality.

### 2. Libraries and Frameworks

  jQuery: For simplifying JavaScript operations and enhancing interactivity.

## Repository Structure

/project-root
├── index.html
├── logic.js
├── library
│   ├── jquery-3.6.0.min.js

│   ├── crypto-js.min.js
├── styles.css
├── questions
│   ├── past-questions
│   │   ├── WASSCE
│   │   │   ├── english-language
│   │   │   │   ├── 2018_p1.json
│   │   │   │   ├── 2019_p1.json
│   │   │   │   ├── 2020_p1.json
│   │   │   │   ├── 2021_p1.json
│   │   │   │   ├── 2022_p1.json
│   │   │   │   ├── 2023_p1.json
│   │   │   ├── core-mathematics
│   │   │       ├── 2018_p1.json
│   │   │       ├── 2019_p1.json
│   │   │       ├── 2020_p1.json
│   │   │       ├── 2021_p1.json
│   │   │       ├── 2022_p1.json
│   │   │       ├── 2023_p1.json
│   │   ├── TVET
│   │   │   ├── core-mathematics
│   │   │   ├── social-studies
│   │   ├── NOVDEC
│   │   │   ├── geography
│   │   │   ├── biology
│   │   ├── BECE
│   │       ├── RME
│   │       ├── ghanaian-language
│   ├── personal-practice-questions
│       ├── SHS
│       │   ├── core-mathematics
│       │   ├── economics
│       ├── TVET
│       │   ├── programming
│       │   ├── database
│       ├── BECE
│           ├── BDT
│           ├── ICT

**NOTE:** The questions in this project are for testing perpupose only.

## CONCLUSION

The Web Quiz System provides a robust and user-friendly platform for students to prepare for their exams through interactive quizzes. With features like multiple categories, realtime feedback, score tracking, and secure user authentication, this application aims to enhance the study experience and improve exam readiness.
