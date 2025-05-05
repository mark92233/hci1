// Section and Modal References
const sections = document.querySelectorAll('.content-section');
const chatList = document.getElementById('chat-list');
const chatBox = document.getElementById('chat-box');
const chatInputArea = document.getElementById('chat-input-area');
const messageInput = document.getElementById('messageInput');
const postModal = document.getElementById('postModal');
const dynamicFields = document.getElementById('dynamicFields');
const postForm = document.getElementById('postForm');
const reportModal = document.getElementById('reportModal');
const reportForm = document.getElementById('reportForm');

let currentChatUser = null;
let chatsData = {};
let newMessages = {};
let chatDoneUsers = [];

const currentUser = {
    name: "You",
    profilePic: "images/pro.png",
    college: "computing studies"
};

const sampleUsers = [
    { name: "Alice Johnson", profilePic: "images/pro.png", college: "computing studies" },
    { name: "Bob Smith", profilePic: "images/pro.png", college: "liberal arts" },
    { name: "Charlie Brown", profilePic: "images/pro.png", college: "engineering" },
    
];

// Navigation
function showSection(id) {
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Add Post Modal
function openAddPostModal(section) {
  postModal.style.display = 'flex';
  dynamicFields.innerHTML = '';

  const titleInput = `<input type="text" id="jobTitle" placeholder="Job Title" required><br>`;
  const descInput = `<textarea id="jobDesc" placeholder="Description" required></textarea>`;
  let imageInput = '';
  let previewHTML = '';

  if (section === 'find-job') {
      imageInput = `<input type="file" id="jobImage" accept="image/*" onchange="previewImage(event)"><br>`;
      previewHTML = `<img id="imagePreview" style="display:none; width:100%; max-height:180px; object-fit:cover; border-radius:10px; margin-bottom:10px;" />`;
  }

  dynamicFields.innerHTML = `
    <h3 style="color: var(--dark-red); text-align:center;">${section === 'find-job' ? 'Add Job Posting' : 'Add Client Request'}</h3>
    ${titleInput}
    ${imageInput}
    ${previewHTML}
    ${descInput}
  `;

  postForm.onsubmit = (e) => {
      e.preventDefault();
      addPost(section, currentUser);
      closeModal();
  };
}


function closeModal() {
    postModal.style.display = 'none';
}

function closeReportModal() {
    reportModal.style.display = 'none';
}

function previewImage(event) {
  const preview = document.getElementById("imagePreview");
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          preview.src = e.target.result;
          preview.style.display = 'block';
      };
      reader.readAsDataURL(file);
  }
}

// Add Posts
function addPost(section, user, sampleData = {}) {
  const postsContainer = document.getElementById(`${section}-posts`);
  const newPost = document.createElement('div');
  newPost.className = 'post-card';
  newPost.setAttribute('data-college', user.college.toLowerCase());

  const fromInput = !sampleData.title && !sampleData.desc;

  const title = sampleData.title || document.getElementById('jobTitle')?.value || "Untitled Job";
  const desc = sampleData.desc || document.getElementById('jobDesc')?.value || "No description provided.";
  let image = sampleData.image || "images/edit.jpg";
  const uploadedImage = document.getElementById("jobImage");
  if (uploadedImage && uploadedImage.files && uploadedImage.files[0]) {
    image = URL.createObjectURL(uploadedImage.files[0]);
  }

  const timestamp = "Posted just now";

  let postContent = `
    <div class="post-header">
      <img src="${user.profilePic}" alt="Profile Picture" class="profile-pic" style="cursor:pointer;" onclick='openProfileModal(${JSON.stringify(user)})'>
      <div>
        <span class="username" style="cursor:pointer;" onclick='openProfileModal(${JSON.stringify(user)})'>${user.name}</span><br>
        <span class="college">College: ${user.college}</span><br>
        <small class="timestamp">${timestamp}</small>
      </div>
    </div>
  `;

  if (section === "find-job") {
    postContent += `<img src="${image}" class="post-preview" alt="Preview Image">`;
  }

  postContent += `
    <h3>${title}</h3>
    <p class="short-desc">${desc.substring(0, 100)}...</p>
    <div class="post-actions">
      <button onclick="openViewModal('${title}', \`${desc}\`, '${image}', '${section}')">View</button>
      ${user.name !== currentUser.name ? `
        <button onclick="openChat('${user.name}')">Contact</button>
        <button onclick="openPostReportModal('${title}')">Report</button>
      ` : ""}
      ${fromInput ? `<button onclick="confirmDelete(this)">Delete</button>` : ""}
    </div>
  `;

  newPost.innerHTML = postContent;
  postsContainer.insertBefore(newPost, postsContainer.firstChild);
}


let postToDelete = null;

function confirmDelete(button) {
  postToDelete = button.closest('.post-card');
  document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  postToDelete = null;
}

function deletePost() {
  if (postToDelete) {
    postToDelete.remove();
    closeDeleteModal();
  }
}



function openChat(userName) {
    showSection('chat');
    currentChatUser = userName;
    renderChat();
    highlightSelectedUser(userName);

    if (chatDoneUsers.includes(userName)) {
      chatInputArea.style.display = 'none';
      chatBox.innerHTML += `<div style="text-align:center; color: gray; font-size:14px; margin-top:10px;">This chat has been marked as completed. No more messages allowed.</div>`;
    } else {
      chatInputArea.style.display = 'flex';
    }

    if (newMessages[userName]) {
      delete newMessages[userName];
      updateChatList();
    }
}


function openChatReportModal(userName) {
  const modal = document.getElementById("chatReportModal");
  const body = document.getElementById("chatReportBody");

  body.innerHTML = `
    <h3>Report Chat with ${userName}</h3>
    <form id="chatReportForm">
      <label><input type="radio" name="reason" value="Harassment" required> Harassment</label><br>
      <label><input type="radio" name="reason" value="Spam" required> Spam</label><br>
      <label><input type="radio" name="reason" value="Inappropriate Messages" required> Inappropriate Messages</label><br><br>
      <button type="submit">Submit Report</button>
    </form>
  `;

  modal.style.display = "flex";

  document.getElementById("chatReportForm").onsubmit = function (e) {
    e.preventDefault();
    modal.style.display = "none";
    alert(`Chat with ${userName} has been reported.`);

    // ⬇️ This disables the chat input after reporting
    const inputField = document.getElementById(`input-${userName}`);
    const inputContainer = inputField?.parentElement;

    if (inputContainer) {
      inputContainer.innerHTML = `
        <div class="disabled-msg">
          Thank you for reporting. This conversation is now under review by the admin.
        </div>
      `;
    }
  };
}


function closeChatReportModal() {
  document.getElementById("chatReportModal").style.display = "none";
}


function renderChat() {
  chatBox.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h2>Chat with ${currentChatUser}</h2>
       <button id="dealButton" onclick="openDealConfirmationModal('${currentChatUser}')" style="margin-left: 30%;">Set a Deal</button>
    <button onclick="openChatReportModal('${currentChatUser}')">Report</button>
  </div>
`;

    if (chatsData[currentChatUser]) {
        chatsData[currentChatUser].forEach(msg => {
            chatBox.innerHTML += `<div class="message ${msg.from === currentUser.name ? 'sent' : 'received'}">${msg.text}</div>`;
        });
    }
}

function sendMessage() {
    const text = messageInput.value.trim();
    if (text && currentChatUser && !chatDoneUsers.includes(currentChatUser)) {
        if (!chatsData[currentChatUser]) chatsData[currentChatUser] = [];
        chatsData[currentChatUser].push({ from: currentUser.name, text });
        messageInput.value = "";
        renderChat();
    }
}

function loadChatDirectory() {
    chatList.innerHTML = '';
    sampleUsers.forEach(user => {
        createChatUser(user.name);
    });
}

function createChatUser(name) {
    const user = sampleUsers.find(u => u.name === name);
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-user';
    userDiv.onclick = () => openChat(name);

    userDiv.innerHTML = `
      <img src="${user?.profilePic || 'default-avatar.jpg'}" alt="${name}">
      <span>${name} ${newMessages[name] ? '<span class="new-message" style="color: #7D0A0A;"><strong>(new)</strong></span>' : ''}</span>
    `;

    chatList.appendChild(userDiv);
}

function searchPosts(input) {
    const keyword = input.value.toLowerCase();
    const container = input.closest('.content-section').querySelector('.posts') || input.closest('.content-section').querySelector('.chat-list');
    const cards = container.querySelectorAll('.post-card, .chat-user');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(keyword) ? "block" : "none";
    });
}

function filterByCollege(select) {
    const college = select.value;
    const posts = select.closest('.content-section').querySelector('.posts')?.querySelectorAll('.post-card');
    if (posts) {
        posts.forEach(post => {
            if (college === "" || post.getAttribute('data-college') === college) {
                post.style.display = "block";
            } else {
                post.style.display = "none";
            }
        });
    }
}

function openDealConfirmationModal(username) {
  document.getElementById('dealUser').innerText = username;
  document.getElementById('dealModal').style.display = 'flex';
}

function closeDealModal() {
  document.getElementById('dealModal').style.display = 'none';
}

function confirmDeal() {
  const dealButton = document.getElementById('dealButton');
  const username = document.getElementById('dealUser').innerText;

  // Handle the deal confirmation logic here
  alert("Deal confirmed with " + username);

  // Disable the button and change its text
  dealButton.innerText = "Deal Set";
  dealButton.disabled = true;
  dealButton.style.opacity = 0.6;
  dealButton.style.cursor = "not-allowed";

  closeDealModal();
}

function logout() {
  openCustomModal('logoutModal');
}

function confirmLogout() {
  alert("Logged out successfully!");
  window.location.href = "landing.html";
}

function loadDefaultPosts() {
  //For job offer
  const samplePosts = [
    {
      user: { name: "Brian Tan", profilePic: "images/pro.png", college: "Computing Studies" },
      sampleData: {
        title: "Hiring: Mobile App Developer",
        desc: "We are offering a project-based position for someone to build a mobile-friendly e-learning platform tailored for CS students.",
        image: "images/works/work1.jpg"
      }
    },
    {
      user: { name: "Lara Reyes", profilePic: "images/pro.png", college: "Liberal Arts" },
      sampleData: {
        title: "Looking for Content Writers",
        desc: "We're offering writing positions for a blog focused on arts, culture, and liberal studies. Writers will contribute weekly articles.",
        image: "images/works/work2.jpg"
      }
    },
    {
      user: { name: "James Velasco", profilePic: "images/pro.png", college: "Engineering" },
      sampleData: {
        title: "Job Offer: CAD Designer",
        desc: "We are hiring a CAD designer for a sustainable engineering capstone involving 3D bridge design models.",
        image: "images/works/work3.jpg"
      }
    },
    {
      user: { name: "Maricel Dela Cruz", profilePic: "images/pro.png", college: "Architecture" },
      sampleData: {
        title: "Now Hiring: Architecture Intern",
        desc: "We’re offering a role for students to assist in drafting layouts and conceptual designs for a modern eco-building.",
        image: "images/works/work4.jpg"
      }
    },
    {
      user: { name: "Carlo Medina", profilePic: "images/pro.png", college: "Public Administration" },
      sampleData: {
        title: "Policy Analyst Internship Offered",
        desc: "We're offering an internship to analyze governance models and help draft policy proposals for LGUs.",
        image: "images/works/work5.jpg"
      }
    },
    {
      user: { name: "Angeline Bautista", profilePic: "images/pro.png", college: "Teacher Education" },
      sampleData: {
        title: "Teaching Assistant Position",
        desc: "We are offering a teaching assistant opportunity to develop engaging lesson plans and activities for young learners.",
        image: "images/works/work6.jpg"
      }
    },
    {
      user: { name: "Jason Lee", profilePic: "images/pro.png", college: "Home Economics" },
      sampleData: {
        title: "Job Opening: Meal Planner",
        desc: "We’re offering a part-time role for someone with knowledge in nutrition to create healthy meal plans for families.",
        image: "images/works/work7.jpg"
      }
    },
    {
      user: { name: "Karen Mendoza", profilePic: "images/pro.png", college: "Nursing" },
      sampleData: {
        title: "First Aid Instructor Wanted",
        desc: "We are hiring a nursing student to conduct first aid workshops for high school students.",
        image: "images/works/work8.jpg"
      }
    },
    {
      user: { name: "Samuel Torres", profilePic: "images/pro.png", college: "Law" },
      sampleData: {
        title: "Offering Legal Research Position",
        desc: "This is an opportunity for law students to gain experience drafting legal briefs and summarizing case files.",
        image: "images/works/work9.jpg"
      }
    },
    {
      user: { name: "Michelle Uy", profilePic: "images/pro.png", college: "College of Criminal Justice Education" },
      sampleData: {
        title: "Crime Data Assistant Needed",
        desc: "We're offering a part-time research assistant role for crime data analysis and report generation.",
        image: "images/works/work10.jpg"
      }
    },
    {
      user: { name: "Rafael Gomez", profilePic: "images/pro.png", college: "Medicine" },
      sampleData: {
        title: "Clinical Reviewer Role Offered",
        desc: "A paid opportunity to help review patient records and summarize clinical cases for medical study groups.",
        image: "images/works/work11.jpg"
      }
    },
    {
      user: { name: "Amira Sahid", profilePic: "images/pro.png", college: "Asian Islamic Studies" },
      sampleData: {
        title: "Researcher for Islamic Studies",
        desc: "We’re hiring a researcher to contribute cultural insights and historical data for our digital archive.",
        image: "images/works/work12.jpg"
      }
    },
    {
      user: { name: "Liam Santos", profilePic: "images/pro.png", college: "Social Work and Development" },
      sampleData: {
        title: "Community Program Facilitator Wanted",
        desc: "We’re looking for someone to lead and implement outreach programs for underprivileged communities.",
        image: "images/works/work13.jpg"
      }
    },
    {
      user: { name: "Monica Torres", profilePic: "images/pro.png", college: "Sports Science and Phisical Education" },
      sampleData: {
        title: "Offering Assistant Trainer Role",
        desc: "This opportunity is for those interested in helping design and implement athletic training routines.",
        image: "images/works/work14.jpg"
      }
    },
    {
      user: { name: "Nathaniel Cruz", profilePic: "images/pro.png", college: "Science and Mathematics" },
      sampleData: {
        title: "Lab Assistant Job Offered",
        desc: "We’re offering a position to assist in laboratory setups and experiment documentation for physics and chemistry classes.",
        image: "images/works/work15.jpg"
      }
    },
    {
      user: { name: "Eunice Lim", profilePic: "images/pro.png", college: "Teacher Education" },
      sampleData: {
        title: "Opening for Demo Teaching Coach",
        desc: "We’re hiring a student mentor to assist education majors in preparing demo lessons and teaching strategies.",
        image: "images/works/work16.jpg"
      }
    },
    {
      user: { name: "Zahid Al-Farouq", profilePic: "images/pro.png", college: "Asian Islamic Studies" },
      sampleData: {
        title: "Podcast Content Assistant Needed",
        desc: "Join our Islamic heritage podcast team as a researcher and script editor. Stipend included.",
        image: "images/works/work17.jpeg"
      }
    },
    {
      user: { name: "Frances Ramos", profilePic: "images/pro.png", college: "Social Work and Development" },
      sampleData: {
        title: "Offering Documentation Role",
        desc: "We are offering a data entry and documentation role for fieldwork reports and case summaries.",
        image: "images/works/work18.jpg"
      }
    },
    {
      user: { name: "Cyrus Bautista", profilePic: "images/pro.png", college: "Engineering" },
      sampleData: {
        title: "System Tester Position Open",
        desc: "We’re looking for a systems engineering student to test and report on IoT-based automation modules.",
        image: "images/works/work19.jpg"
      }
    },
    {
      user: { name: "Sophia Dizon", profilePic: "images/pro.png", college: "Home Economics" },
      sampleData: {
        title: "Interior Design Project Available",
        desc: "We’re offering a creative opportunity to help design dorm room layouts with a functional and aesthetic approach.",
        image: "images/works/work20.jpg"
      }
    }
  ];

  samplePosts.forEach(entry => {
    addPost('find-job', entry.user, entry.sampleData);
  });

  //For hiring
  const clientPosts = [
    {
      user: { name: "Alice Johnson", profilePic: "images/pro.png", college: "Computing Studies" },
      sampleData: {
        title: "Web Developer Needed", 
        desc: "Looking for a skilled web developer to build a responsive student portal for course registration and announcements.",
        image: "images/webdev.jpg"
      }
    },
    {
      user: { name: "Bob Smith", profilePic: "images/pro.png", college: "Liberal Arts" },
      sampleData: {
        title: "Content Writer Wanted",
        desc: "We need a writer to create engaging blog articles about campus life, events, and student tips.",
        image: "images/edit.jpg"
      }
    },
    {
      user: { name: "Charlie Brown", profilePic: "images/pro.png", college: "Engineering" },
      sampleData: {
        title: "CAD Design Assistance",
        desc: "Hiring someone proficient in AutoCAD to help design a model for an academic infrastructure project.",
        image: "images/math.jpg"
      }
    },
    {
      user: { name: "Dana Cruz", profilePic: "images/pro.png", college: "Business" },
      sampleData: {
        title: "Need Logo Design",
        desc: "Looking for a graphic designer to create a modern logo for a startup café brand.",
        image: "images/client1.jpg"
      }
    },
    {
      user: { name: "Edward Lim", profilePic: "images/pro.png", college: "Computing Studies" },
      sampleData: {
        title: "App Developer for Capstone",
        desc: "Need assistance with building a mobile app prototype for a capstone project. Must know Flutter or React Native.",
        image: "images/client2.jpg"
      }
    },
    {
      user: { name: "Fiona Reyes", profilePic: "images/pro.png", college: "Education" },
      sampleData: {
        title: "Online Tutor Needed",
        desc: "Hiring a tutor to help with weekly review sessions in math for senior high school students.",
        image: "images/client3.jpg"
      }
    },
    {
      user: { name: "George Villanueva", profilePic: "images/pro.png", college: "Law" },
      sampleData: {
        title: "Legal Document Proofreader",
        desc: "Need a detail-oriented law student to review and edit legal documents and case summaries.",
        image: "images/client4.jpg"
      }
    },
    {
      user: { name: "Hannah Mae", profilePic: "images/pro.png", college: "Nursing" },
      sampleData: {
        title: "Health Brochure Designer",
        desc: "Looking for someone to help design educational brochures about hygiene and wellness.",
        image: "images/client5.jpg"
      }
    },
    {
      user: { name: "Ivan Santos", profilePic: "images/pro.png", college: "Engineering" },
      sampleData: {
        title: "Arduino Project Helper",
        desc: "Need help wiring and coding an Arduino-based motion sensor for a school demo.",
        image: "images/client6.jpg"
      }
    },
    {
      user: { name: "Jasmine Cruz", profilePic: "images/pro.png", college: "Social Work" },
      sampleData: {
        title: "Survey Analyst Needed",
        desc: "Seeking assistance in analyzing survey results for a community outreach study.",
        image: "images/client7.jpg"
      }
    },
    {
      user: { name: "Karl Medina", profilePic: "images/pro.png", college: "Architecture" },
      sampleData: {
        title: "SketchUp Design Consultant",
        desc: "Looking for a student to help develop a 3D residential model using SketchUp or AutoCAD.",
        image: "images/client8.jpg"
      }
    },
    {
      user: { name: "Liza Mercado", profilePic: "images/pro.png", college: "Home Economics" },
      sampleData: {
        title: "Event Planner Assistant",
        desc: "Need a creative student to assist in planning layouts, invites, and decor for a birthday event.",
        image: "images/client9.jpg"
      }
    },
    {
      user: { name: "Marco Rivera", profilePic: "images/pro.png", college: "Sports Science" },
      sampleData: {
        title: "Fitness Plan Maker",
        desc: "Looking for someone to make a beginner-friendly gym workout plan with illustrations.",
        image: "images/client10.jpg"
      }
    },
    {
      user: { name: "Nicole Tan", profilePic: "images/pro.png", college: "Business" },
      sampleData: {
        title: "Marketing Poster Designer",
        desc: "Seeking someone to design an eye-catching poster for a student-run clothing brand.",
        image: "images/client11.jpg"
      }
    },
    {
      user: { name: "Oscar Jimenez", profilePic: "images/pro.png", college: "Science and Math" },
      sampleData: {
        title: "Chem Tutor Needed",
        desc: "Need a chemistry tutor for a high school sibling struggling with basic formulas and reactions.",
        image: "images/client12.jpg"
      }
    },
    {
      user: { name: "Patricia Yap", profilePic: "images/pro.png", college: "Education" },
      sampleData: {
        title: "Demo Class Reviewer",
        desc: "Looking for feedback and guidance on a recorded practice demo teaching session.",
        image: "images/client13.jpg"
      }
    },
    {
      user: { name: "Quincy Dela Torre", profilePic: "images/pro.png", college: "Medicine" },
      sampleData: {
        title: "Anatomy Quiz Maker",
        desc: "Need someone to create digital flashcards for anatomy review. Paid per set.",
        image: "images/client14.jpg"
      }
    },
    {
      user: { name: "Rhea Morales", profilePic: "images/pro.png", college: "Asian Islamic Studies" },
      sampleData: {
        title: "Arabic Translator Needed",
        desc: "Looking for help translating Islamic texts from Arabic to English for a thesis project.",
        image: "images/client15.jpg"
      }
    },
    {
      user: { name: "Samuel Ong", profilePic: "images/pro.png", college: "Public Administration" },
      sampleData: {
        title: "Policy Draft Reviewer",
        desc: "Need assistance reviewing and editing a draft policy proposal for barangay planning.",
        image: "images/client16.jpg"
      }
    },
    {
      user: { name: "Trixie Sy", profilePic: "images/pro.png", college: "Teacher Education" },
      sampleData: {
        title: "Lesson Plan Formatter",
        desc: "Looking for someone to format and beautify MS Word lesson plans with diagrams and highlights.",
        image: "images/client17.jpg"
      }
    }
    
  ];

  clientPosts.forEach(entry => {
    addPost('look-client', entry.user, entry.sampleData);
  });
}


function simulateIncomingMessage() {
    setTimeout(() => {
        const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)].name;
        if (!chatsData[randomUser]) chatsData[randomUser] = [];
        chatsData[randomUser].push({ from: randomUser, text: "Hi! Are you available?" });
        newMessages[randomUser] = true;
        updateChatList();
    }, 5000);
}

function updateChatList() {
    loadChatDirectory();
}

window.onload = function() {
    loadChatDirectory();
    loadDefaultPosts();
    simulateIncomingMessage();
    loadAdminMockData();
};

const tabs = document.querySelectorAll(".tab");
const postGrid = document.querySelector(".post-grid");

const savedPosts = [ "photo6.jpg", "photo7.jpg" ];
const taggedPosts = [ "photo8.jpg", "photo9.jpg" ];

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    postGrid.innerHTML = "";

    if (tab.textContent === "Posts") {
      loadImages(["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]);
    } else if (tab.textContent === "Saved") {
      loadImages(savedPosts);
    } else if (tab.textContent === "Tagged") {
      loadImages(taggedPosts);
}
  });
});

function loadImages(images) {
  images.forEach(img => {
    const el = document.createElement("img");
    el.src = img;
    el.alt = "Post";
    postGrid.appendChild(el);
  });
}

document.querySelector('.gear-btn')?.addEventListener('click', () => {
    alert("Settings modal not implemented yet.");
});

function switchModernTab(tab) {
    document.querySelectorAll(".tabModern").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tabContent").forEach(div => div.style.display = "none");

    document.querySelector(`[onclick*="${tab}"]`).classList.add("active");
    document.getElementById(`profile-${tab}`).style.display = "block";
}



function highlightSelectedUser(userName) {
    document.querySelectorAll(".chat-user").forEach(user => {
      user.classList.remove("active");
      if (user.textContent.includes(userName)) {
        user.classList.add("active");
      }
    });
}
function openViewModal(title, desc, image, section) {
  const modal = document.getElementById("viewModal");
  const body = document.getElementById("viewModalBody");

  if (section === 'find-job') {
    body.innerHTML = `
      <img src="${image}" alt="Preview" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">
      <h3>${title}</h3>
      <p>${desc}</p>
    `;
  } else {
    body.innerHTML = `
      <h3>${title}</h3>
      <p>${desc}</p>
    `;
  }

  modal.style.display = "flex";
}

function closeViewModal() {
  document.getElementById("viewModal").style.display = "none";
}
function openPostReportModal(postTitle) {
  const modal = document.getElementById("postReportModal");
  const body = document.getElementById("postReportBody");
  body.innerHTML = `
    <h3>Report Post: ${postTitle}</h3>
    <form id="postReportForm">
      <label><input type="radio" name="reason" value="Inappropriate Content" required> Inappropriate Content</label><br>
      <label><input type="radio" name="reason" value="Spam or Misleading" required> Spam or Misleading</label><br>
      <label><input type="radio" name="reason" value="Harassment or Hate Speech" required> Harassment or Hate Speech</label><br>
      <label><input type="radio" name="reason" value="False Information" required> False Information</label><br><br>
      <button type="submit">Submit Report</button>
    </form>
  `;
  modal.style.display = "flex";

  document.getElementById("postReportForm").onsubmit = function(e) {
    e.preventDefault();
    alert("Report submitted successfully.");
    modal.style.display = "none";
  };
}

function closePostReportModal() {
  document.getElementById("postReportModal").style.display = "none";
}

function openProfileModal(user) {
  const modal = document.getElementById("viewProfileModal");
  const content = document.getElementById("profileModalContent");

  content.innerHTML = `
    <div class="profileCard">
      <img src="${user.profilePic}" alt="${user.name}" class="profileAvatar">
      <div class="profileDetails">
        <p class="profileHandle">@202406843</p>
        <div class="profileStats">
          <span><strong>3.5</strong>Average Rating</span>
          <span><strong>10</strong>Work Done</span>
        </div>
        <p class="profileName">${user.name}</p>
        <p class="profileCollege">College of ${user.college}</p>
      </div>
    </div>
  `;

  modal.style.display = "flex";
}

const profilePics = newPost.querySelectorAll('.profile-pic, .username');
profilePics.forEach(el => {
  el.style.cursor = "pointer";
  el.addEventListener('click', () => openProfileModal(user));
});

function closeProfileModal() {
  document.getElementById("viewProfileModal").style.display = "none";
}


function openReportModal(title, desc, image, section) {
  const modal = document.getElementById("viewModal");
  const body = document.getElementById("viewModalBody");

  const showInitialOptions = () => {
    body.innerHTML = `
      <img src="images/image.png" alt="Preview" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">
      <h3>Fitness Plan Maker</h3>
      <p>we need fit body for a plan maker.</p>
      <p style="margin-top:2%; color:#7D0A0A;">Select action to take:</p>
      <div style="display: flex; gap: 10px; justify-self:center; margin-top:2%;" >
        <button id="deleteBtn">Delete Post</button>
        <button id="suspendBtn">Suspend User</button>
      </div>
    `;

    document.getElementById("deleteBtn").onclick = showDeleteConfirmation;
    document.getElementById("suspendBtn").onclick = showSuspendForm;
  };

  const showDeleteConfirmation = () => {
    body.innerHTML = `
      <p style="display:flex; justify-self:center;">Are you sure you want to delete this post?</p>
      <div style="display: flex; gap: 10px;justify-self:center; margin-top:5%;">
        <button id="confirmDelete">Yes, Delete</button>
        <button id="cancelDelete">Cancel</button>
      </div>
    `;

    document.getElementById("confirmDelete").onclick = () => {
      body.innerHTML = `<p>Post deleted successfully.</p>`;
    };

    document.getElementById("cancelDelete").onclick = () => {
      body.innerHTML = `<p>Deletion canceled.</p>`;
    };
  };

  const showSuspendForm = () => {
    body.innerHTML = `
      <p style="display:flex; justify-self:center;">Select suspension duration:</p>
      <select id="suspendDays" style="display:flex; justify-self:center;">
        <option value="1">1 day</option>
        <option value="3">3 days</option>
        <option value="7">7 days</option>
        <option value="30">30 days</option>
        <option value="permanent">permanent</option>
      </select>
      <div style="margin-top: 10px; display:flex; justify-self:center; gap:2%;">
        <button id="submitSuspend">Submit</button>
        <button id="cancelSuspend">Cancel</button>
      </div>
    `;

    document.getElementById("submitSuspend").onclick = () => {
      const days = document.getElementById("suspendDays").value;
      body.innerHTML = `<p>User suspended for ${days} day(s).</p>`;
    };

    document.getElementById("cancelSuspend").onclick = () => {
      body.innerHTML = `<p>Suspension canceled.</p>`;
    };
  };

  modal.style.display = "flex";
  showInitialOptions();
}

function loadAdminMockData() {
  const accountRequests = document.getElementById("account-requests");
  accountRequests.innerHTML = `
    <div class="post-card" style="cursor: pointer;">
      <h3>Account Request</h3>
      <p>Email: ae202403655@wmsu.edu.ph</p>
      <p>College: Computing Studies</p>
      <p>ID picture:</p>
      <div style="display: flex; gap: 10px; margin-bottom: 10px;" onclick="openAccountOverlayModal()">
        <img src="images/ID front.jpg" alt="ID Front" style="width: 100px; height: auto; border: 1px solid #ccc;">
        <img src="images/ID back.jpg" alt="ID Back" style="width: 100px; height: auto; border: 1px solid #ccc;">
      </div>
      <div class="accountButtons">
          <button onclick="openAccountAcceptModal()">Accept</button>
          <button onclick="openAccountRejectModal()">Reject</button>
        </div>
    </div>  
    <div class="post-card" style="cursor: pointer;">
      <h3>Account Request</h3>
      <p>Email: ae202403655@wmsu.edu.ph</p>
      <p>College: Computing Studies</p>
      <p>ID picture:</p>
      <div style="display: flex; gap: 10px; margin-bottom: 10px;" onclick="openAccountOverlayModal1()">
        <img src="images/front1.jpg" alt="ID Front" style="width: 100px; height: auto; border: 1px solid #ccc;">
        <img src="images/back2.jpg" alt="ID Back" style="width: 100px; height: auto; border: 1px solid #ccc;">
      </div>
      <div class="accountButtons">
          <button onclick="openAccountAcceptModal()">Accept</button>
          <button onclick="openAccountRejectModal()">Reject</button>
        </div>
    </div>
    
  `;  

    const reportList = document.getElementById("report-listContainer");
    reportList.innerHTML = `
    <ul class="report-list">
   <ul class="report-list">
  <li>
    <div class="report-info">
      <h3>Report #1</h3>
      <p><strong>Offense:</strong> Harassment</p>
      <p><strong>Reported User:</strong> Bob Smith</p>
    </div>
    <button onclick="openReportModal()">Inspect</button>
  </li>
  <li>
    <div class="report-info">
      <h3>Report #2</h3>
      <p><strong>Offense:</strong> Spam</p>
      <p><strong>Reported User:</strong> Charlie Brown</p>
    </div>
    <button onclick="openReportModal()">Inspect</button>
  </li>
  <li>
    <div class="report-info">
      <h3>Report #3</h3>
      <p><strong>Offense:</strong> Inappropriate Language</p>
      <p><strong>Reported User:</strong> Alice Johnson</p>
    </div>
    <button onclick="openReportModal()">Inspect</button>
  </li>
  <li>
    <div class="report-info">
      <h3>Report #4</h3>
      <p><strong>Offense:</strong> Cheating</p>
      <p><strong>Reported User:</strong> David Lee</p>
    </div>
    <button onclick="openReportModal()">Inspect</button>
  </li>
  <li>
    <div class="report-info">
      <h3>Report #5</h3>
      <p><strong>Offense:</strong> Threats</p>
      <p><strong>Reported User:</strong> Emily Davis</p>
    </div>
    <button onclick="openReportModal()">Inspect</button>
  </li>
</ul>
  </ul> 
    `;
    
}
function openAccountOverlayModal() {
  document.getElementById('accountOverlayModal').style.display = 'flex';
}
function openAccountOverlayModal1() {
  document.getElementById('accountOverlayModal1').style.display = 'flex';
}

function closeAccountOverlayModal() {
  document.getElementById('accountOverlayModal').style.display = 'none';
  document.getElementById('accountOverlayModal1').style.display = 'none';
}

function openAccountAcceptModal() {
  document.getElementById('accountAcceptModal').style.display = 'flex';
}

function closeAccountAcceptModal() {
  document.getElementById('accountAcceptModal').style.display = 'none';
}

function sendEmailVerification() {
  alert('Email verification has been sent.');
}

function openAccountRejectModal() {
  document.getElementById('accountRejectModal').style.display = 'flex';
}

function closeAccountRejectModal() {
  sendEmailVerification();
  document.getElementById('accountRejectModal').style.display = 'none';
}

// Open modal by ID
function openCustomModal(id) {
  document.getElementById(id).style.display = 'block';
  document.body.classList.add('custom-modal-open');
}

// Close modal by ID
function closeCustomModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.classList.remove('custom-modal-open');
}

// Submit "Set as Done" Modal
function submitDoneModal() {
  const rating = document.getElementById('custom-rating').value;
  const feedback = document.getElementById('custom-feedback').value;

  if (!rating || rating < 1 || rating > 5) {
    alert('Please provide a valid rating from 1 to 5.');
    return;
  }

  // Optional: Send to server (simulate here)
  console.log('Rating:', rating);
  console.log('Feedback:', feedback);

  alert('Thank you for rating the freelancer!');
  closeCustomModal('doneModal');
}

// Submit "Suspend" Modal
function submitSuspendModal() {
  const reason = document.getElementById('custom-reason').value;
  const explanation = document.getElementById('custom-explanation').value;

  if (!reason) {
    alert('Please select a reason to suspend.');
    return;
  }

  // Optional: Send to server (simulate here)
  console.log('Suspend Reason:', reason);
  console.log('Explanation:', explanation);

  alert('Transaction has been marked as suspended.');
  closeCustomModal('suspendModal');
}

// Redirect to chat (pass freelancer ID as parameter)
function redirectToChat(freelancerId) {
  if (!freelancerId) {
    alert("Invalid user ID");
    return;
  }
  window.location.href = `/chat?user=${freelancerId}`;
}
