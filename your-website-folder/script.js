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
    profilePic: "yourpfp.jpg",
    college: "computing studies"
};

const sampleUsers = [
    { name: "Alice Johnson", profilePic: "photo1.jpg", college: "computing studies" },
    { name: "Bob Smith", profilePic: "photo2.jpg", college: "liberal arts" },
    { name: "Charlie Brown", profilePic: "photo3.jpg", college: "engineering" }
];

// Toggle Sidebar
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('hide');
}

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
function addPost(section, user, sampleData = null) {
    const postsContainer = document.getElementById(`${section}-posts`);
    let newPost = document.createElement('div');
    newPost.className = 'post-card';
    newPost.setAttribute('data-college', user.college.toLowerCase());

    let postContent = `
        <div class="post-header">
            <img src="${user.profilePic}" alt="Profile Picture" class="profile-pic">
            <span class="username">${user.name}</span>
        </div>
        <p class="college">College: ${user.college}</p>
    `;

    if (section === 'find-job') {
        const title = sampleData?.title || document.getElementById('jobTitle')?.value || "Sample Job";
        const desc = sampleData?.desc || document.getElementById('jobDesc')?.value || "Sample Job Description";
        postContent += `<h3>${title}</h3><p>${desc}</p>`;
    } else if (section === 'look-client') {
        const title = sampleData?.title || document.getElementById('jobTitle')?.value || "Sample Service";
        const desc = sampleData?.desc || document.getElementById('jobDesc')?.value || "Sample Service Description";
        postContent += `<h3>${title}</h3><p>${desc}</p>`;
    }

    if (user.name !== currentUser.name) {
        postContent += `<button onclick="openChat('${user.name}')">Contact</button>`;
    }

    newPost.innerHTML = postContent;
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
  