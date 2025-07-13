// Sign In Logic
function signinAdmin() {
    document.getElementById('signin-box').innerHTML = `
      <p class="signin-close" onclick="signinCloseModal()">×</p>
      <h2>Sign In</h2>
      <form id="signin-form">
        <input type="email" id="signin-email" placeholder="Email (@wmsu.edu.ph)" required>
        <p class="error-msg" id="signin-email-error"></p>
        <input type="password" id="signin-password" placeholder="Password" required>
        <p class="error-msg" id="signin-password-error"></p>
        <p style="margin-top: 5px; font-size: 14px;">
          <a href="#" onclick="signinShowForgotPassword()" style="color: black;">Forgot password?</a>
        </p>
        <button type="submit">Sign In</button>
      </form>
    `;
  }
  
  // Open Sign In Modal
  document.getElementById('sign').addEventListener('click', () => {
    document.getElementById('signin-overlay').style.display = 'flex';
    signinAdmin();
  });
  
  // Validate Sign In
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'signin-form') {
      e.preventDefault();
  
      const email = document.getElementById('signin-email').value.trim();
      const password = document.getElementById('signin-password').value.trim();
  
      document.getElementById('signin-email-error').textContent = '';
      document.getElementById('signin-password-error').textContent = '';
      let isValid = true;
  
      if (!email.endsWith('@wmsu.edu.ph')) {
        document.getElementById('signin-email-error').textContent = 'Email must be @wmsu.edu.ph';
        isValid = false;
      }
  
      if (password.length < 8) {
        document.getElementById('signin-password-error').textContent = 'Password must be at least 8 characters';
        isValid = false;
      }
  
      if (isValid) {
        if (email === 'admin@wmsu.edu.ph' && password === 'admin12345') {
          window.location.href = 'admin.html';
        } else if (email === 'user@wmsu.edu.ph' && password === 'user12345') {
          window.location.href = 'Home.html';
        } else {
          document.getElementById('signin-password-error').textContent = 'Invalid email or password';
        }
      }
    }
  });
  
  function signinShowForgotPassword() {
    document.getElementById('signin-box').innerHTML = `
      <p class="signin-close" onclick="signinCloseModal()">×</p>
      <h2>Reset Password</h2>
      <form id="forgot-form">
        <input type="email" id="forgot-email" placeholder="Email (@wmsu.edu.ph)" required>
        <p class="error-msg" id="forgot-email-error"></p>
        <button type="button" id="send-code-btn">Send Code</button>
      </form>
    `;
  }
  
  // Send code button
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'send-code-btn') {
      const email = document.getElementById('forgot-email').value;
      document.getElementById('forgot-email-error').textContent = '';
  
      if (!email.endsWith('@wmsu.edu.ph')) {
        document.getElementById('forgot-email-error').textContent = 'Email must be @wmsu.edu.ph';
        return;
      }
  
      const form = document.getElementById('forgot-form');
  
      if (!document.getElementById('forgot-code')) {
        form.insertAdjacentHTML('beforeend', `
          <input type="text" id="forgot-code" placeholder="Enter 6-digit code" required>
          <p class="error-msg" id="forgot-code-error"></p>
        `);
      }
  
      e.target.textContent = 'Confirm Code';
      e.target.id = 'confirm-code-btn';
    }
  });
  
  // Confirm code button
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'confirm-code-btn') {
      const code = document.getElementById('forgot-code').value;
      document.getElementById('forgot-code-error').textContent = '';
  
      if (!/^\d{6}$/.test(code)) {
        document.getElementById('forgot-code-error').textContent = 'Code must be exactly 6 digits.';
        return;
      }
  
      const form = document.getElementById('forgot-form');
      e.target.remove();
  
      form.insertAdjacentHTML('beforeend', `
        <input type="password" id="new-password" placeholder="New Password (8 characters)" required>
        <p class="error-msg" id="new-password-error"></p>
        <input type="password" id="confirm-password" placeholder="Confirm Password" required>
        <p class="error-msg" id="confirm-password-error"></p>
        <button type="button" id="reset-password-btn">Reset Password</button>
      `);
    }
  });
  
  // Reset password button
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'reset-password-btn') {
      const newPass = document.getElementById('new-password').value;
      const confirmPass = document.getElementById('confirm-password').value;
      let valid = true;
  
      document.getElementById('new-password-error').textContent = '';
      document.getElementById('confirm-password-error').textContent = '';
  
      if (newPass.length !== 8) {
        document.getElementById('new-password-error').textContent = 'Password must be exactly 8 characters.';
        valid = false;
      }
  
      if (newPass !== confirmPass) {
        document.getElementById('confirm-password-error').textContent = 'Passwords do not match.';
        valid = false;
      }
  
      if (valid) {
        document.getElementById('forgot-form').innerHTML = `
          <p style="color: green; font-weight: bold; text-align: center; margin-bottom: 20px;">
            Password changed successfully!
          </p>
          <button onclick="signinAdmin()">Back to Sign In</button>
        `;
      }
    }
  });
  
  function signinCloseModal() {
    document.getElementById('signin-overlay').style.display = 'none';
  }
  
  // Sign Up Logic
  document.getElementById('signup').addEventListener('click', () => {
    signupShowForm();
    document.getElementById('signup-overlay').style.display = 'flex';
  });
  
  function signupShowForm() {
    document.getElementById('signup-box').innerHTML = `
      <button class="signup-close" onclick="signupCloseModal()">×</button>
      <h2>Sign Up</h2>
      <form id="signup-form">
      <p style="margin-left:-75%;">Enter name: </p>
       <div class="student-id-container">
          <input type="text" id="signup-student-id-prefix" placeholder="First Name" required>
          <input type="text" id="signup-student-id-suffix" placeholder="Last Name" required>
        </div>
        <p style="margin-left:-75%;">Enter email: </p>
        <input type="email" id="signup-email" placeholder="Email (@wmsu.edu.ph)" required>
        <p class="error-msg" id="signup-email-error"></p>
        <p style="margin-left:-65%;">Enter password: </p>
        <input type="password" id="signup-password" placeholder="Password (8 characters)" required>
        <p class="error-msg" id="signup-password-error"></p>
        <p style="margin-left:-65%;">Confirm password: </p>
        <input type="password" id="signup-confirm-password" placeholder="Confirm Password" required>
        <p class="error-msg" id="signup-confirm-password-error"></p>
        <p style="margin-left: -50%">Student ID number: </p>
        <div class="student-id-container">
          <input type="text" id="signup-student-id-prefix" placeholder="XXXX" >
          <span>-</span>
          <input type="text" id="signup-student-id-suffix" placeholder="XXXXX">
        </div>
        <p class="error-msg" id="signup-student-id-error"></p>
        <p style="margin-left:-75%;">Select College: </p>
         <div class="filter"> 
        <select onchange="filterByCollege(this)">
          <option value="">Select College</option>
          <option value="computing studies">College of Computing Studies</option>
          <option value="liberal arts">College of Liberal Arts</option>
          <option value="engineering">College of Engineering</option>
          <option value="architecture">College of Architecture</option>
          <option value="public administration">College of Public Administration</option>
          <option value="teacher education">College of Teacher Education</option>
          <option value="home economics">College of Home Economics</option>
          <option value="nursing">College of Nursing</option>
          <option value="law">College of Law</option>
          <option value="criminal justice">College of Criminal Justice Education</option>
          <option value="medicine">College of Medicine</option>
          <option value="asian islamic studies">College of Asian Islamic Studies</option>
          <option value="social work">College of Social Work and Development</option>
          <option value="sports science">College of Sports Science and Phisical Education</option>
          <option value="science and mathematics">College of Science and Mathematics</option>
        </select>
      </div>
        <p>Insert Picture of your ID: </p>
        <p style="margin-left: -80%; color: gray;">Front:</p>
        <input type="file" id="signup-image" accept="image/*" required placeholder="front">
        <p style="margin-left: -80%; color: gray;">Back:</p>
        <input type="file" id="signup-image" accept="image/*" required>
        <p class="error-msg" id="signup-image-error"></p>
        <button type="submit">Sign Up</button>
      </form>
    `;
  }
  
  // Validate Sign Up Form
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'signup-form') {
      e.preventDefault();
      let isValid = true;
  
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      const prefix = document.getElementById('signup-student-id-prefix').value;
      const suffix = document.getElementById('signup-student-id-suffix').value;
      const image = document.getElementById('signup-image').files[0];
  
      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  
      if (!email.endsWith('@wmsu.edu.ph')) {
        document.getElementById('signup-email-error').textContent = 'Email must be @wmsu.edu.ph';
        isValid = false;
      }
  
      if (password.length < 8 ) {
        document.getElementById('signup-password-error').textContent = 'Password must be exactly 8 characters';
        isValid = false;
      }
  
      if (password !== confirmPassword) {
        document.getElementById('signup-confirm-password-error').textContent = 'Passwords do not match';
        isValid = false;
      }
  
      if (!/^\d{4}$/.test(prefix) || !/^\d{5}$/.test(suffix)) {
        document.getElementById('signup-student-id-error').textContent = 'Student ID must be in the format 2024-03655';
        isValid = false;
      }
  
      if (!image || !image.type.startsWith('image/')) {
        document.getElementById('signup-image-error').textContent = 'Please upload a valid image';
        isValid = false;
      }
  
      if (isValid) {
        document.getElementById('signup-box').innerHTML = `
        <button class="signup-close" onclick="signupCloseModal()">×</button>
        <h2>Registration Successful</h2>
        <p style="text-align: center;">An email will be sent shortly to verify your account.</p>
        <button onclick="signupCloseModal()" class="closebtn">Close</button>
      `;
      }
    }
  });
  
  function signupCloseModal() {
    document.getElementById('signup-overlay').style.display = 'none';
  }