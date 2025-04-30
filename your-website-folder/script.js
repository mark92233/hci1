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
    { name: "Charlie Brown", profilePic: "images/pro.png", college: "engineering" }
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

    if (section === 'find-job') {
        dynamicFields.innerHTML = `
            <input type="text" id="jobTitle" placeholder="Job Title" required><br>
            <textarea id="jobDesc" placeholder="Description" required></textarea>
        `;
    } else if (section === 'look-client') {
        dynamicFields.innerHTML = `
            <input type="text" id="jobTitle" placeholder="Job Title" required><br>
            <input type="file" id="jobImage"><br>
            <textarea id="jobDesc" placeholder="Description" required></textarea>
        `;
    }

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

// Add Posts
function addPost(section, user, sampleData = {}) {
  const postsContainer = document.getElementById(`${section}-posts`);
  const newPost = document.createElement('div');
  newPost.className = 'post-card';
  newPost.setAttribute('data-college', user.college.toLowerCase());

  // Use sampleData only, fallback to form values or placeholders
  const title = sampleData.title || document.getElementById('jobTitle')?.value || "Untitled Job";
  const desc = sampleData.desc || document.getElementById('jobDesc')?.value || "No description provided.";
  const image = sampleData.image || "images/default.jpg";
  const timestamp = "Posted just now";

  newPost.innerHTML = `
    <div class="post-header">
      <img src="${user.profilePic}" alt="Profile Picture" class="profile-pic">
      <div>
        <span class="username">${user.name}</span><br>
        <span class="college">College: ${user.college}</span><br>
        <small class="timestamp">${timestamp}</small>
      </div>
    </div>
    <img src="${image}" class="post-preview" alt="Preview Image">
    <h3>${title}</h3>
    <p class="short-desc">${desc.substring(0, 100)}...</p>
    <div class="post-actions">
      <button onclick="openViewModal('${title}', \`${desc}\`, '${image}')">View More</button>
      ${user.name !== currentUser.name ? `<button onclick="openChat('${user.name}')">Contact</button>` : ""}
    </div>
  `;

  postsContainer.appendChild(newPost);
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
  

function renderChat() {
    chatBox.innerHTML = `<h2>Chat with ${currentChatUser}</h2>`;
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

// Load Chat Directory
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
    <span>${name} ${newMessages[name] ? '<span class="new-message">(new)</span>' : ''}</span>
    <div class="chat-options" onclick="event.stopPropagation(); showChatOptions('${name}', this)">
      &#x22EE;
    </div>
  `;

  chatList.appendChild(userDiv);
}

  

// Search and Filter
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

// Logout (Profile Page)
function logout() {
    alert("Logged out successfully!");
    window.location.href = "index.html";
}

// Load Default Posts
function loadDefaultPosts() {
    sampleUsers.forEach(user => {
        addPost('find-job', user, { title: "Job Example", desc: "Job Description" });
        addPost('look-client', user, { title: "Client Example", desc: "Looking for a client" });
    });
}

window.onload = function() {
  loadChatDirectory();
  loadDefaultPosts();
  simulateIncomingMessage();
  loadAdminMockData(); // for admin

  // 🔽 Add this block for user sample cards
  const samplePosts = [
    {
      user: {
        name: "Alice Johnson",
        profilePic: "images/pro.png",
        college: "Computing Studies"
      },
      sampleData: {
        title: "Web Developer Needed",
        desc: "Looking for a skilled web developer to build a responsive student portal for course registration and announcements.",
        image: "images/job1.jpg"
      }
    },
    {
      user: {
        name: "Bob Smith",
        profilePic: "images/pro.png",
        college: "Liberal Arts"
      },
      sampleData: {
        title: "Content Writer Wanted",
        desc: "We need a writer to create engaging blog articles about campus life, events, and student tips.",
        image: "images/job2.jpg"
      }
    },
    {
      user: {
        name: "Charlie Brown",
        profilePic: "images/pro.png",
        college: "Engineering"
      },
      sampleData: {
        title: "CAD Design Assistance",
        desc: "Hiring someone proficient in AutoCAD to help design a model for an academic infrastructure project.",
        image: "images/job3.jpg"
      }
    }
  ];

  samplePosts.forEach(entry => {
    addPost('find-job', entry.user, entry.sampleData);
  });
};


// Simulate New Incoming Messages (Demo)
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

// Initialize Page
window.onload = function() {
    loadChatDirectory();
    loadDefaultPosts();
    simulateIncomingMessage();
    loadAdminMockData(); // Load admin data
};

// Profile Tabs: Posts, Saved, Tagged
const tabs = document.querySelectorAll(".tab");
const postGrid = document.querySelector(".post-grid");

// Simulated content for demo purposes
const savedPosts = [
  "photo6.jpg", "photo7.jpg"
];
const taggedPosts = [
  "photo8.jpg", "photo9.jpg"
];

// Tab Switch Handler
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // Remove active from all
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Clear current grid
    postGrid.innerHTML = "";

    // Load tab content
    if (tab.textContent === "Posts") {
      loadImages(["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"]);
    } else if (tab.textContent === "Saved") {
      loadImages(savedPosts);
    } else if (tab.textContent === "Tagged") {
      loadImages(taggedPosts);
    }
  });
});

// Helper: Load Images
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

  function openViewModal(title, desc, image) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalDesc").innerText = desc;
    document.getElementById("modalImage").src = image;
    document.getElementById("viewModal").style.display = "flex";
  }
  
  function closeViewModal() {
    document.getElementById("viewModal").style.display = "none";
  }
  
  function loadAdminMockData() {
    const reportList = document.getElementById("report-list");
    reportList.innerHTML = `
      <div class="post-card">
        <h3>Report #1</h3>
        <p><strong>Offense:</strong> Harassment</p>
        <p><strong>Reported User:</strong> Bob Smith</p>
        <button onclick="alert('Report marked as reviewed')">Mark as Reviewed</button>
      </div>
      <div class="post-card">
        <h3>Report #2</h3>
        <p><strong>Offense:</strong> Spam</p>
        <p><strong>Reported User:</strong> Charlie Brown</p>
        <button onclick="alert('Report marked as reviewed')">Mark as Reviewed</button>
      </div>
    `;
  
    const accountRequests = document.getElementById("account-requests");
    accountRequests.innerHTML = `
      <div class="post-card">
        <h3>Request from Jane Doe</h3>
        <p>Email: jane@example.com</p>
        <button onclick="alert('Account accepted')">Accept</button>
        <button onclick="alert('Account rejected')">Reject</button>
      </div>
    `;
  }
  // Removed duplicate window.onload function as it is already merged above.
  
  function showChatOptions(userName, el) {
    const menu = document.createElement('div');
    menu.className = 'chat-dropdown';
    menu.innerHTML = `
      <button onclick="openChatReport('${userName}')">Report</button>
      <button onclick="markChatAsDone('${userName}')">Set as Done</button>
      <button onclick="deleteChat('${userName}')">Delete</button>
    `;
    el.appendChild(menu);
    setTimeout(() => document.addEventListener('click', () => menu.remove(), { once: true }), 100);
  }
  
  function openChatReport(userName) {
    currentChatUser = userName;
    document.getElementById('chatReportModal').style.display = 'flex';
  }
  
  function closeChatReportModal() {
    document.getElementById('chatReportModal').style.display = 'none';
  }
  
  document.getElementById('chatReportForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (currentChatUser) {
      chatsData[currentChatUser] = [];
      chatBox.innerHTML = '<p style=\"text-align:center; color:red;\">Chat reported and terminated.</p>';
      chatInputArea.style.display = 'none';
      document.getElementById('chat-disabled-msg').style.display = 'block';
      closeChatReportModal();
    }
  });
  
  function markChatAsDone(userName) {
    chatDoneUsers.push(userName);
    if (currentChatUser === userName) {
      chatInputArea.style.display = 'none';
      document.getElementById('chat-disabled-msg').style.display = 'block';
    }
  }
  
  function deleteChat(userName) {
    delete chatsData[userName];
    if (currentChatUser === userName) {
      chatBox.innerHTML = '<p style=\"text-align:center; color:#999;\">Chat deleted.</p>';
    }
    updateChatList();
  }
  