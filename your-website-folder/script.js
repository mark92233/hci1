// Section and Modal References
const sections = document.querySelectorAll('.content-section');
const chatList = document.getElementById('chat-list');
const chatBox = document.getElementById('chat-box');
const postModal = document.getElementById('postModal');
const dynamicFields = document.getElementById('dynamicFields');
const postForm = document.getElementById('postForm');

// Sample Chat Data
const chats = [
    { name: 'John Doe', messages: ['Hello!', 'How are you?'] },
    { name: 'Jane Smith', messages: ['Hi there!', 'Need help?'] },
];

// Show specific section
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
        addPost(section);
        closeModal();
    };
}

// Close Modal
function closeModal() {
    postModal.style.display = 'none';
}

// Add New Post
function addPost(section) {
    const postsContainer = document.getElementById(`${section}-posts`);
    let newPost = document.createElement('div');
    newPost.className = 'post-card';

    if (section === 'find-job') {
        const title = document.getElementById('jobTitle').value;
        const desc = document.getElementById('jobDesc').value;
        newPost.innerHTML = `<h3>${title}</h3><p>${desc}</p><button onclick="openChat('${title}')">Contact</button>`;
    } else if (section === 'look-client') {
        const title = document.getElementById('jobTitle').value;
        const desc = document.getElementById('jobDesc').value;
        newPost.innerHTML = `<h3>${title}</h3><p>${desc}</p><button onclick="openChat('${title}')">Contact</button>`;
    } else if (section === 'marketplace') {
        const productName = document.getElementById('productName').value;
        const quantity = document.getElementById('productQuantity').value;
        const color = document.getElementById('productColor').value;
        const desc = document.getElementById('productDesc').value;
        newPost.innerHTML = `<h3>${productName}</h3><p>Qty: ${quantity}</p><p>Color: ${color}</p><p>${desc}</p><button onclick="openChat('${productName}')">Contact</button>`;
    }

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

// Initialize
window.onload = loadChatDirectory;
