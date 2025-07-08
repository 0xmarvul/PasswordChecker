
const passwordInput = document.getElementById('passwordInput');
        const feedbackContainer = document.getElementById('feedbackContainer');
        const visibilityToggle = document.getElementById('visibilityToggle');
        const eyeOpen = document.getElementById('eye-open');
        const eyeClosed = document.getElementById('eye-closed');
        const meterBars = [
            document.getElementById('meter-1'),
            document.getElementById('meter-2'),
            document.getElementById('meter-3'),
            document.getElementById('meter-4')
        ];


        const COMMON_WORDS = [
            "password", "123456", "123456789", "guest", "qwerty", "admin",
            "user", "administrator", "12345", "12345678", "test", "1234",
            "root", "love", "111111", "secret", "iloveyou", "football",
            "soccer", "baseball", "welcome"
        ];


        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const { feedback, score } = checkPasswordStrength(password);
            updateUI(feedback, score, password.length);
        });


        visibilityToggle.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeOpen.classList.toggle('hidden', isPassword);
            eyeClosed.classList.toggle('hidden', !isPassword);
        });

        /**
         * Checks the strength of the password based on several criteria.
         * @param {string} password - The password to check.
         * @returns {object} - An object containing feedback messages and a strength score.
         */
        function checkPasswordStrength(password) {
            let feedback = [];
            let score = 0;

            if (!password) {
                return { feedback: [], score: 0 };
            }


            const checks = [
                { message: "At least 8 characters long", passed: password.length >= 8 },
                { message: "Contains an uppercase letter", passed: /[A-Z]/.test(password) },
                { message: "Contains a lowercase letter", passed: /[a-z]/.test(password) },
                { message: "Contains a number", passed: /[0-9]/.test(password) },
                { message: "Contains a symbol", passed: /[^a-zA-Z0-9]/.test(password) }
            ];
            
            checks.forEach(check => {
                if (check.passed) {
                    score++;
                }
                feedback.push({ message: check.message, passed: check.passed });
            });


            if (COMMON_WORDS.includes(password.toLowerCase())) {
                feedback.push({ message: "Should not be a common password", passed: false });
            } else {
                 feedback.push({ message: "Not a common password", passed: true });
            }

            if (/(.)\1\1/.test(password)) {
                feedback.push({ message: "Should not contain repeating characters", passed: false });
            }

            let hasSequence = false;
            for (let i = 0; i < password.length - 2; i++) {
                const char1 = password.charCodeAt(i);
                const char2 = password.charCodeAt(i + 1);
                const char3 = password.charCodeAt(i + 2);
                if (char2 === char1 + 1 && char3 === char2 + 1) {
                    hasSequence = true;
                    break;
                }
            }
            if (hasSequence) {
                feedback.push({ message: "Should not contain sequential characters", passed: false });
            }
            
            return { feedback, score };
        }

        /**
         * Updates the UI with feedback messages and the strength meter.
         * @param {Array<object>} feedback - Array of feedback objects {message, passed}.
         * @param {number} score - The calculated strength score.
         * @param {number} length - The length of the current password.
         */
        function updateUI(feedback, score, length) {

            feedbackContainer.innerHTML = '';
            
            if (length === 0) {
                feedbackContainer.innerHTML = '<p class="text-gray-500 text-center">Feedback will appear here.</p>';
                updateMeter(0);
                return;
            }

            const feedbackList = document.createElement('ul');
            feedbackList.className = 'space-y-2';

            feedback.forEach(item => {
                const li = document.createElement('li');
                li.className = `flex items-center text-sm ${item.passed ? 'text-green-400' : 'text-red-400'}`;
                const icon = item.passed 
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
                li.innerHTML = `${icon} ${item.message}`;
                feedbackList.appendChild(li);
            });

            feedbackContainer.appendChild(feedbackList);
            updateMeter(score);
        }
        
        /**
         * Updates the color and state of the strength meter bars.
         * @param {number} score - The calculated strength score.
         */
        function updateMeter(score) {
            const colors = {
                0: 'bg-gray-700',
                1: 'bg-red-500',
                2: 'bg-red-500',
                3: 'bg-orange-500',
                4: 'bg-yellow-500',
                5: 'bg-green-500'
            };

            meterBars.forEach((bar, index) => {
                if (score > 2 && index < 2) bar.className = 'w-1/4 rounded-full transition-colors bg-orange-500';
                if (score > 3 && index < 3) bar.className = 'w-1/4 rounded-full transition-colors bg-yellow-500';
                if (score > 4 && index < 4) bar.className = 'w-1/4 rounded-full transition-colors bg-green-500';
                
                if (index < score / 1.5) {
                     bar.className = `w-1/4 rounded-full transition-colors ${colors[score] || 'bg-gray-700'}`;
                } else {
                     bar.className = 'w-1/4 rounded-full transition-colors bg-gray-700';
                }
            });
        }
