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

// Section Navigation
function showSection(id) {
    sections.forEach(section => section.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Open Add Post Modal
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

// --- Chat System

function openChat(userName) {
    showSection('chat');
    currentChatUser = userName;
    renderChat();
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
        chatBox.innerHTML = "<p>Chat terminated due to report.</p>";
        loadChatDirectory();
        reportModal.style.display = 'none';
    }
};

function setAsDone(name) {
    chatDoneUsers.push(name);
    if (currentChatUser === name) {
        chatInputArea.style.display = 'none';
        chatBox.innerHTML += `<div style="text-align:center; color: gray; font-size:14px; margin-top:10px;">This chat has been marked as completed. No more messages allowed.</div>`;
    }
}

function deleteChat(name) {
    delete chatsData[name];
    delete newMessages[name];
    loadChatDirectory();
    chatBox.innerHTML = "<p>Select a conversation</p>";
}

// --- New Messages Simulation
function simulateIncomingMessage() {
    setTimeout(() => {
        const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)].name;
        if (!chatsData[randomUser]) chatsData[randomUser] = [];
        chatsData[randomUser].push({ from: randomUser, text: "Hey! Just checking in." });
        newMessages[randomUser] = true;
        updateChatList();
    }, 5000); // after 5 seconds
}

function updateChatList() {
    loadChatDirectory();
}

// --- Search and Filter
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

function logout() {
    alert("Logged out!");
    window.location.href = "index.html"; 
}

// Load Initial Posts
function loadDefaultPosts() {
    sampleUsers.forEach(user => {
        addPost('find-job', user, { title: "Job Example", desc: "Job Description" });
        addPost('look-client', user, { title: "Client Example", desc: "Looking for client" });
        addPost('marketplace', user, { productName: "Product Example", quantity: "10", color: "Red", desc: "Product Details" });
    });
}

// --- Initialize Page
window.onload = function() {
    loadChatDirectory();
    loadDefaultPosts();
    simulateIncomingMessage();
};
