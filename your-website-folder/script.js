// Section and Modal References
const sections = document.querySelectorAll('.content-section');
const chatList = document.getElementById('chat-list');
const chatBox = document.getElementById('chat-box');
const postModal = document.getElementById('postModal');
const dynamicFields = document.getElementById('dynamicFields');
const postForm = document.getElementById('postForm');

// Current logged-in user info
const currentUser = {
    name: "You",
    profilePic: "https://via.placeholder.com/50"
};

// Dummy sample users for default posts
const sampleUsers = [
    { name: "Alice Johnson", profilePic: "https://via.placeholder.com/50/FF5733" },
    { name: "Bob Smith", profilePic: "https://via.placeholder.com/50/33C1FF" },
    { name: "Charlie Brown", profilePic: "https://via.placeholder.com/50/75FF33" },
    { name: "Daisy Lee", profilePic: "https://via.placeholder.com/50/FF33A6" },
    { name: "Edward King", profilePic: "https://via.placeholder.com/50/FFC733" },
    { name: "Fiona Green", profilePic: "https://via.placeholder.com/50/7A33FF" },
    { name: "George Hill", profilePic: "https://via.placeholder.com/50/33FFF9" },
    { name: "Hannah White", profilePic: "https://via.placeholder.com/50/F933FF" },
    { name: "Ian Black", profilePic: "https://via.placeholder.com/50/FF5733" },
    { name: "Jenny Gold", profilePic: "https://via.placeholder.com/50/33FF57" }
];

// Dummy sample chats for chat section
const chats = [
    { name: 'John Doe', messages: ['Hello!', 'How are you?'] },
    { name: 'Jane Smith', messages: ['Hi there!', 'Need help?'] },
];

// Show a specific section
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

// Close Modal
function closeModal() {
    postModal.style.display = 'none';
}

// Add New Post
function addPost(section, user) {
    const postsContainer = document.getElementById(`${section}-posts`);
    let newPost = document.createElement('div');
    newPost.className = 'post-card';

    let postContent = `
        <div class="post-header">
            <img src="${user.profilePic}" alt="Profile Picture" class="profile-pic">
            <span class="username">${user.name}</span>
        </div>
    `;

    if (section === 'find-job') {
        const title = document.getElementById('jobTitle') ? document.getElementById('jobTitle').value : "Sample Job";
        const desc = document.getElementById('jobDesc') ? document.getElementById('jobDesc').value : "This is a sample job post.";
        postContent += `<h3>${title}</h3><p>${desc}</p>`;
    } else if (section === 'look-client') {
        const title = document.getElementById('jobTitle') ? document.getElementById('jobTitle').value : "Client Needed";
        const desc = document.getElementById('jobDesc') ? document.getElementById('jobDesc').value : "Looking for clients for services.";
        postContent += `<h3>${title}</h3><p>${desc}</p>`;
    } else if (section === 'marketplace') {
        const productName = document.getElementById('productName') ? document.getElementById('productName').value : "Sample Product";
        const quantity = document.getElementById('productQuantity') ? document.getElementById('productQuantity').value : "10";
        const color = document.getElementById('productColor') ? document.getElementById('productColor').value : "Various";
        const desc = document.getElementById('productDesc') ? document.getElementById('productDesc').value : "Product description.";
        postContent += `<h3>${productName}</h3><p>Qty: ${quantity}</p><p>Color: ${color}</p><p>${desc}</p>`;
    }

    if (user.name !== currentUser.name) {
        postContent += `<button onclick="openChat('${user.name}')">Contact</button>`;
    }

    newPost.innerHTML = postContent;
    postsContainer.appendChild(newPost);
}

// Open Chat
function openChat(userName) {
    showSection('chat');
    chatBox.innerHTML = `<h2>Chat with ${userName}</h2><div class="message received">Hi! How can I help you?</div>`;
}

// Load Chat Directory
function loadChatDirectory() {
    chatList.innerHTML = '';
    chats.forEach((chat) => {
        const user = document.createElement('div');
        user.className = 'chat-user';
        user.textContent = chat.name;
        user.onclick = () => openChat(chat.name);
        chatList.appendChild(user);
    });
}

// Load 10 Default Posts (Sample Users)
function loadDefaultPosts() {
    sampleUsers.forEach(user => {
        addPost('find-job', user);
    });
}

// Initialize
window.onload = function() {
    loadChatDirectory();
    loadDefaultPosts();
};
