$(document).ready(function() {
    const securityQuestions = [
        'What was your childhood nickname?',
        'What is the name of your favorite childhood friend?',
        'What street did you live on in third grade?',
        'What is your oldest sibling’s birthday month and year?',
        'What is the middle name of your youngest child?',
        'What is your favorite movie?',
        'What is your mother’s maiden name?'
    ];

    let currentUser = null;
    let currentCategory = '';
    let currentLevel = '';
    let currentSubject = '';
    let currentYearOrForm = '';
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let numQuestions = 0;
    let timer;
    let timeLimit; // Adjusted for different quiz types
    const itemsPerPage = 5; // Number of items per page for pagination
    let currentPage = 1;
    let sortedFilteredScores = [];

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to start the timer
    function startTimer() {
        let timeRemaining = timeLimit;
        $('#timer').text(`Time remaining: ${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`);
        timer = setInterval(function() {
            timeRemaining--;
            $('#timer').text(`Time remaining: ${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`);
            if (timeRemaining <= 0) {
                clearInterval(timer);
                handleAnswerSubmission();
            }
        }, 1000);
    }

    // Function to stop the timer
    function stopTimer() {
        clearInterval(timer);
    }

    // Populate dropdowns
    function populateDropdowns() {
        // Populate main category dropdown
        const mainCategories = ["past-questions", "personal-practice-questions"];
        for (const category of mainCategories) {
            $('#main-category').append(`<option value="${category}">${category}</option>`);
        }

        // Populate security question dropdown
        for (const question of securityQuestions) {
            $('#register-security-question').append(`<option value="${question}">${question}</option>`);
        }
    }

    populateDropdowns();

    // Handle main category selection
    $('#main-category').change(function() {
        currentCategory = $(this).val();
        $('#level').empty().append('<option value="">Select Level</option>');
        $('#subject').empty().append('<option value="">Select Subject</option>');
        $('#year-or-form').empty().append('<option value="">Select Year/Form</option>');
        $('#question-selection').hide(); // Hide question selection by default
        if (currentCategory) {
            // Populate levels based on the main category
            const levels = currentCategory === "past-questions" ? ["WASSCE", "TVET", "NOVDEC", "BECE"] : ["SHS", "TVET", "BECE"];
            for (const level of levels) {
                $('#level').append(`<option value="${level}">${level}</option>`);
            }
            $('#level').prop('disabled', false);

            // Show or hide the number of questions input based on the main category
            if (currentCategory === "personal-practice-questions") {
                $('#question-selection').hide(); // Hide initially for personal practice questions
            } else {
                $('#question-selection').hide(); // Always hide for past questions until year/form is selected
            }
        } else {
            $('#level').prop('disabled', true);
            $('#subject').prop('disabled', true);
            $('#year-or-form').prop('disabled', true);
        }
    });

    // Handle level selection
    $('#level').change(function() {
        currentLevel = $(this).val();
        $('#subject').empty().append('<option value="">Select Subject</option>');
        $('#year-or-form').empty().append('<option value="">Select Year/Form</option>');
        if (currentCategory && currentLevel) {
            // Populate subjects based on the main category and level
            let subjects = [];
            if (currentCategory === "past-questions") {
                if (currentLevel === "WASSCE") {
                    subjects = ["english-language", "core-mathematics"];
                } else if (currentLevel === "TVET") {
                    subjects = ["core-mathematics", "social-studies"];
                } else if (currentLevel === "NOVDEC") {
                    subjects = ["geography", "biology"];
                } else if (currentLevel === "BECE") {
                    subjects = ["RME", "ghanaian-language"];
                }
            } else if (currentCategory === "personal-practice-questions") {
                if (currentLevel === "SHS") {
                    subjects = ["core-mathematics", "economics"];
                } else if (currentLevel === "TVET") {
                    subjects = ["programming", "database"];
                } else if (currentLevel === "BECE") {
                    subjects = ["BDT", "ICT"];
                }
            }
            for (const subject of subjects) {
                $('#subject').append(`<option value="${subject}">${subject}</option>`);
            }
            $('#subject').prop('disabled', false);
        } else {
            $('#subject').prop('disabled', true);
            $('#year-or-form').prop('disabled', true);
        }
    });

    // Handle subject selection
    $('#subject').change(function() {
        currentSubject = $(this).val();
        $('#year-or-form').empty().append('<option value="">Select Year/Form</option>');
        if (currentCategory && currentLevel && currentSubject) {
            // Populate years/forms based on the main category, level, and subject
            const yearsOrForms = currentCategory === "past-questions" ? ["2018_p1", "2019_p1", "2020_p1", "2021_p1", "2022_p1", "2023_p1"] : ["form-1", "form-2", "form-3"];
            for (const yearOrForm of yearsOrForms) {
                $('#year-or-form').append(`<option value="${yearOrForm}">${yearOrForm}</option>`);
            }
            $('#year-or-form').prop('disabled', false);
        } else {
            $('#year-or-form').prop('disabled', true);
        }
    });

    // Handle year/form selection
    $('#year-or-form').change(function() {
        currentYearOrForm = $(this).val();
        if (currentCategory && currentLevel && currentSubject && currentYearOrForm) {
            // Load questions from the corresponding JSON file
            const filePath = `questions/${currentCategory}/${currentLevel}/${currentSubject}/${currentYearOrForm}.json`;
            $.getJSON(filePath, function(data) {
                currentQuestions = data.slice();
                shuffle(currentQuestions);
                console.log(`Loaded questions from ${filePath}:`, currentQuestions);

                // Automatically set number of questions for past questions
                if (currentCategory === "past-questions") {
                    numQuestions = currentQuestions.length;
                    startQuiz(); // Start quiz automatically for past questions
                } else {
                    $('#question-selection').show(); // Show question selection for personal practice questions
                }
            }).fail(function() {
                console.error(`Failed to load questions from ${filePath}`);
            });
        }
    });

    // Handle quiz start for personal practice questions
    $('#start-quiz').click(function() {
        if (currentCategory === "personal-practice-questions") {
            numQuestions = parseInt($('#num-questions').val());
            if (numQuestions > currentQuestions.length) {
                console.warn(`Requested number of questions (${numQuestions}) exceeds available questions (${currentQuestions.length}).`);
                numQuestions = currentQuestions.length; // Adjust to available questions
            }
            startQuiz(); // Start quiz for personal practice questions
        }
    });

    // Function to start the quiz
    function startQuiz() {
        currentQuestions = currentQuestions.slice(0, numQuestions); // Select only the requested number of questions
        currentQuestionIndex = 0;
        score = 0;
        
        // Set time limit based on quiz type
        if (currentCategory === "past-questions") {
            if (currentLevel === "BECE") {
                timeLimit = 2700; // 45 minutes
            } else {
                timeLimit = 3600; // 60 minutes for WASSCE, TVET, and NOVDEC
            }
        } else {
            timeLimit = 55; // 55 seconds per question for personal-practice-questions
        }

        console.log(`Starting quiz with ${numQuestions} questions.`, currentQuestions);
        $('#department-selection').hide();  // hide the department selection fields
        $('#question-selection').hide();    // hide the question selection fields
        $('#quiz-container').show();
        displayQuestion();
    }

    // Display current question
    function displayQuestion() {
        stopTimer(); // Stop any existing timer

        // Check if currentQuestionIndex is within bounds
        if (currentQuestionIndex < 0 || currentQuestionIndex >= currentQuestions.length) {
            console.error(`Invalid currentQuestionIndex: ${currentQuestionIndex}`);
            return;
        }

        // Check if currentQuestions is populated
        if (!currentQuestions || currentQuestions.length === 0) {
            console.error('currentQuestions is empty or not populated.');
            return;
        }

        const questionData = currentQuestions[currentQuestionIndex];

        // Check if questionData is valid
        if (!questionData) {
            console.error(`Invalid questionData at index ${currentQuestionIndex}`);
            return;
        }

        console.log(`Displaying question ${currentQuestionIndex + 1} of ${currentQuestions.length}`);
        $('.question').text(questionData.question);
        $('.options').empty();
        const shuffledOptions = questionData.options.slice();
        shuffle(shuffledOptions);
        shuffledOptions.forEach(option => {
            $('.options').append(`<li><input type="radio" name="option" value="${option}"> ${option}</li>`);
        });
        $('#feedback').text(''); // Clear previous feedback
        startTimer(); // Start timer for the new question
    }

    // Handle answer submission
    function handleAnswerSubmission() {
        const selectedOption = $('input[name="option"]:checked').val();
        const correctAnswer = currentQuestions[currentQuestionIndex].answer;

        // Feedback display after answering each question ... will be disabled later
        if (selectedOption === correctAnswer) {
            score++;
            $('#feedback').text('Correct!').css('color', 'green');
        } else {
            $('#feedback').text(`Incorrect! The correct answer was: ${correctAnswer}`).css('color', 'red');
        }

        // Save question result
        const questionResult = {
            question: currentQuestions[currentQuestionIndex].question,
            selectedOption: selectedOption,
            correctAnswer: correctAnswer
        };
        currentQuestions[currentQuestionIndex].result = questionResult;

        stopTimer(); // Stop the timer
        currentQuestionIndex++;
        if (currentQuestionIndex < numQuestions) {
            setTimeout(displayQuestion, 1300); // Move to the next question after 2 seconds
        } else {
            setTimeout(displayScore, 1500); // Show score after the last question
        }
    }

    // Handle answer submission on button click
    $('#submit-answer').click(function() {
        handleAnswerSubmission();
    });

    // Display final score
    function displayScore() {
        saveScore(currentQuestions, score, numQuestions); // Save score to localStorage
        $('#quiz-container').hide();
        $('#score-container').show();
        $('#score').text(`You scored ${score} out of ${numQuestions}`);
        displayScoreHistory(); // Display score history
    }

    // Save score to localStorage
    function saveScore(questions, score, total) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (currentUser) {
            if (!users[currentUser].scores) {
                users[currentUser].scores = [];
            }
            users[currentUser].scores.push({ questions: questions, score: score, total: total, date: new Date().toLocaleString(), category: currentCategory, level: currentLevel, subject: currentSubject, yearOrForm: currentYearOrForm });
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    // Display score history with pagination, sorting, and filtering
    function displayScoreHistory() {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (currentUser && users[currentUser].scores) {
            const scores = users[currentUser].scores;

            // Apply filtering
            const filterDepartment = $('#filter-department').val();
            let filteredScores = scores;
            if (filterDepartment !== 'All') {
                filteredScores = scores.filter(score => score.department === filterDepartment);
            }

            // Apply sorting
            const sortCriteria = $('#sort-criteria').val();
            if (sortCriteria === 'Date') {
                filteredScores.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (sortCriteria === 'Score') {
                filteredScores.sort((a, b) => b.score - a.score);
            }

            sortedFilteredScores = filteredScores;
            const totalPages = Math.ceil(sortedFilteredScores.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            $('#score-history').empty();
            sortedFilteredScores.slice(startIndex, endIndex).forEach((entry, index) => {
                $('#score-history').append(`<li><a href="#" class="view-past-quiz" data-index="${startIndex + index}">${entry.date} - Scored ${entry.score} out of ${entry.total}</a></li>`);
            });
            $('#pagination').empty();
            if (currentPage > 1) {
                $('#pagination').append('<button id="prev-page">Previous</button>');
            }
            if (currentPage < totalPages) {
                $('#pagination').append('<button id="next-page">Next</button>');
            }
        }
    }

    // Handle pagination
    $(document).on('click', '#prev-page', function() {
        if (currentPage > 1) {
            currentPage--;
            displayScoreHistory();
        }
    });

    $(document).on('click', '#next-page', function() {
        const totalPages = Math.ceil(sortedFilteredScores.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayScoreHistory();
        }
    });

    // Handle retake quiz
    $('#retake-quiz').click(function() {
        // Reset variables
        currentCategory = '';
        currentLevel = '';
        currentSubject = '';
        currentYearOrForm = '';
        currentQuestions = [];
        currentQuestionIndex = 0;
        score = 0;
        numQuestions = 0;

        // Reset dropdown selections
        $('#main-category').val('');
        $('#level').val('').prop('disabled', true);
        $('#subject').val('').prop('disabled', true);
        $('#year-or-form').val('').prop('disabled', true);

        // Hide sections
        $('#score-container').hide();
        $('#question-selection').hide();
        $('#quiz-container').hide();
        $('#score-history').empty();
        $('#pagination').empty();
        $('#past-quiz-container').hide();

        // Show department selection section
        $('#department-selection').show();
    });

    // Display past quiz details
    $(document).on('click', '.view-past-quiz', function() {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const index = $(this).data('index');
        const pastQuiz = users[currentUser].scores[index];
        $('#past-quiz-container').empty();
        $('#past-quiz-container').append(`<h3>Quiz on ${pastQuiz.date}</h3>`);
        pastQuiz.questions.forEach((question, idx) => {
            $('#past-quiz-container').append(`<p><b>Q${idx + 1}: ${question.question}</b><br> Your answer: ${question.result.selectedOption}<br> Correct answer: ${question.result.correctAnswer}</p>`);
        });
        $('#past-quiz-container').show();
    });

    // Hashing function using SHA-256
    async function hashPassword(password) {
        if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
            const msgUint8 = new TextEncoder().encode(password);                           // encode as (utf-8) Uint8Array
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);             // hash the message
            const hashArray = Array.from(new Uint8Array(hashBuffer));                       // convert buffer to byte array
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');   // convert bytes to hex string
            return hashHex;
        } else {
            // Fallback to crypto-js for environments that do not support crypto.subtle
            const hash = CryptoJS.SHA256(password);
            return hash.toString(CryptoJS.enc.Hex);
        }
    }

    // User registration
    $('#register-btn').click(async function() {
        const username = $('#register-username').val();
        const password = $('#register-password').val();
        const securityQuestion = $('#register-security-question').val();
        const securityAnswer = $('#register-security-answer').val();
        if (!username || !password || !securityQuestion || !securityAnswer) {
            alert('Please fill in all required fields.');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (!users[username]) {
            const hashedPassword = await hashPassword(password);
            const hashedSecurityAnswer = await hashPassword(securityAnswer);
            users[username] = { password: hashedPassword, securityQuestion: securityQuestion, securityAnswer: hashedSecurityAnswer, scores: [] };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful!');
            $('#register-form').hide();
            $('#login-form').show();
        } else {
            alert('Username already exists.');
        }
    });

    // User login
    $('#login-btn').click(async function() {
        const username = $('#login-username').val();
        const password = $('#login-password').val();
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            const hashedPassword = await hashPassword(password);
            if (users[username].password === hashedPassword) {
                currentUser = username;
                $('#login-form').hide();
                $('#main-content').show();
                $('#welcome-msg').text(`Welcome, ${username}!`);
                displayScoreHistory();
            } else {
                alert('Invalid username or password.');
            }
        } else {
            alert('Invalid username or password.');
        }
    });

    // Password recovery
    $('#recover-username').blur(function() {
        const username = $('#recover-username').val();
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            $('#recover-security-question').text(users[username].securityQuestion);
            $('#recover-security-question-container').show();
        } else {
            $('#recover-security-question-container').hide();
            alert('Username not found.');
        }
    });

    $('#recover-password-btn').click(async function() {
        const username = $('#recover-username').val();
        const securityAnswer = $('#recover-security-answer').val();
        const newPassword = $('#recover-new-password').val();
        if (!username || !securityAnswer || !newPassword) {
            alert('Please fill in all required fields.');
            return;
        }
        const users = JSON.parse(localStorage.getItem('users')) || {};
        if (users[username]) {
            const hashedSecurityAnswer = await hashPassword(securityAnswer);
            if (users[username].securityAnswer === hashedSecurityAnswer) {
                const hashedNewPassword = await hashPassword(newPassword);
                users[username].password = hashedNewPassword;
                localStorage.setItem('users', JSON.stringify(users));
                alert('Password recovery successful! You can now log in with your new password.');
                $('#recover-form').hide();
                $('#login-form').show();
            } else {
                alert('Incorrect security answer.');
            }
        } else {
            alert('Username not found.');
        }
    });

    // Show registration page
    $('#show-register').click(function() {
        $('#login-form').hide();
        $('#register-form').show();
    });

    // Show login page
    $('#show-login').click(function() {
        $('#register-form').hide();
        $('#login-form').show();
    });

    // Show password recovery page
    $('#show-recover').click(function() {
        $('#login-form').hide();
        $('#recover-form').show();
    });

    // Show login on recovery page
    $('#show-login-on-recover').click(function() {
        $('#recover-form').hide();
        $('#login-form').show();
    });

    // Handle sorting and filtering changes
    $('#sort-criteria, #filter-department').change(function() {
        displayScoreHistory();
    });

    // Display score history on page load if a user is logged in
    if (currentUser) {
        displayScoreHistory();
    }

    // Handle logout
    $('#logout-btn').click(function() {
        // Clear the current user session
        currentUser = null;

        // Hide main content and show login form
        $('#main-content').hide();
        $('#login-form').show();

        // Clear the login form inputs
        $('#login-username').val('');
        $('#login-password').val('');

        // Reset variables and states
        currentCategory = '';
        currentLevel = '';
        currentSubject = '';
        currentYearOrForm = '';
        currentQuestions = [];
        currentQuestionIndex = 0;
        score = 0;
        numQuestions = 0;

        // Reset dropdown selections
        $('#main-category').val('');
        $('#level').val('').prop('disabled', true);
        $('#subject').val('').prop('disabled', true);
        $('#year-or-form').val('').prop('disabled', true);

        // Hide sections
        $('#department-selection').hide();
        $('#question-selection').hide();
        $('#quiz-container').hide();
        $('#score-container').hide();
        $('#score-history').empty();
        $('#pagination').empty();
        $('#past-quiz-container').hide();

        // Optionally clear any other session data if needed
        console.log('User logged out');
    });
});
// TIP::    Work on the directory for PERSONAL PRACTICE QUESTIONS/LEVEL/NO SUBJECT/form-1/2/3
// TIP::    Implement an efficient validation for login/registration/password recovery fields