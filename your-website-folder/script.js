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
let chatsData = {};  // Store all conversations
let newMessages = {}; // Track new message notifications
let chatDoneUsers = []; // Track users with "Set as Done"

// Dummy current user
const currentUser = {
    name: "You",
    profilePic: "https://via.placeholder.com/50",
    college: "computing studies"
};

// Dummy sample users
const sampleUsers = [
    { name: "Alice Johnson", profilePic: "https://via.placeholder.com/50/FF5733", college: "computing studies" },
    { name: "Bob Smith", profilePic: "https://via.placeholder.com/50/33C1FF", college: "liberal arts" },
    { name: "Charlie Brown", profilePic: "https://via.placeholder.com/50/75FF33", college: "engineering" },
    { name: "Daisy Lee", profilePic: "https://via.placeholder.com/50/FF33A6", college: "architecture" },
    { name: "Edward King", profilePic: "https://via.placeholder.com/50/FFC733", college: "public administration" },
    { name: "Fiona Green", profilePic: "https://via.placeholder.com/50/7A33FF", college: "nursing" },
    { name: "George Hill", profilePic: "https://via.placeholder.com/50/33FFF9", college: "medicine" },
    { name: "Hannah White", profilePic: "https://via.placeholder.com/50/F933FF", college: "law" },
    { name: "Ian Black", profilePic: "https://via.placeholder.com/50/FF5733", college: "engineering" },
    { name: "Jenny Gold", profilePic: "https://via.placeholder.com/50/33FF57", college: "science and mathematics" }
];

// --- Main Functions ---

// Section Navigation
function showSection(id) {
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Post Modal
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
    } else if (section === 'marketplace') {
        dynamicFields.innerHTML = `
            <input type="text" id="productName" placeholder="Product Name" required><br>
            <input type="file" id="productImage"><br>
            <input type="number" id="productQuantity" placeholder="Quantity" required><br>
            <input type="text" id="productColor" placeholder="Color" required><br>
            <textarea id="productDesc" placeholder="Product Details" required></textarea>
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

// Adding Posts
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
    } else if (section === 'marketplace') {
        const productName = sampleData?.productName || document.getElementById('productName')?.value || "Sample Product";
        const quantity = sampleData?.quantity || document.getElementById('productQuantity')?.value || "5";
        const color = sampleData?.color || document.getElementById('productColor')?.value || "Various";
        const desc = sampleData?.desc || document.getElementById('productDesc')?.value || "Sample Product Description";
        postContent += `<h3>${productName}</h3><p>Qty: ${quantity}</p><p>Color: ${color}</p><p>${desc}</p>`;
    }

    if (user.name !== currentUser.name) {
        postContent += `<button onclick="openChat('${user.name}')">Contact</button>`;
    }

    newPost.innerHTML = postContent;
    postsContainer.appendChild(newPost);
}

// Chat System
function openChat(userName) {
    showSection('chat');
    currentChatUser = userName;
    renderChat();
    chatInputArea.style.display = chatDoneUsers.includes(userName) ? 'none' : 'flex';
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
    if (text && currentChatUser) {
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
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-user';
    userDiv.innerHTML = `
        <span onclick="openChat('${name}')">${name} ${newMessages[name] ? '<span class="new-message">(new)</span>' : ''}</span>
        <div class="options-menu" onclick="toggleOptions('${name}', event)">&#8942;
            <div class="options-dropdown" id="options-${name}">
                <div onclick="reportChat('${name}')">Report</div>
                <div onclick="setAsDone('${name}')">Set as Done</div>
                <div onclick="deleteChat('${name}')">Delete</div>
            </div>
        </div>
    `;
    chatList.appendChild(userDiv);
}

function toggleOptions(name, e) {
    e.stopPropagation();
    const dropdown = document.getElementById(`options-${name}`);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function reportChat(name) {
    currentChatUser = name;
    reportModal.style.display = 'flex';
}

reportForm.onsubmit = function(e) {
    e.preventDefault();
    if (currentChatUser) {
        delete chatsData[currentChatUser];
        delete newMessages[currentChatUser];
        chatBox.innerHTML = "<p>Chat Terminated due to report.</p>";
        loadChatDirectory();
        reportModal.style.display = 'none';
    }
};

function setAsDone(name) {
    chatDoneUsers.push(name);
    if (currentChatUser === name) {
        chatInputArea.style.display = 'none';
    }
}

function deleteChat(name) {
    delete chatsData[name];
    delete newMessages[name];
    loadChatDirectory();
    chatBox.innerHTML = "<p>Select a conversation</p>";
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

// Load Default Posts
function loadDefaultPosts() {
    sampleUsers.forEach(user => {
        addPost('find-job', user, { title: "Job Example", desc: "Job Description" });
        addPost('look-client', user, { title: "Service Example", desc: "Service Description" });
        addPost('marketplace', user, { productName: "Product Name", quantity: "10", color: "Red", desc: "Product Description" });
    });
}

// Initialize
window.onload = function() {
    loadChatDirectory();
    loadDefaultPosts();
};
