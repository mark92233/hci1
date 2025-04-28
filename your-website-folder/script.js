// Section and Modal References
const sections = document.querySelectorAll('.content-section');
const chatList = document.getElementById('chat-list');
const chatBox = document.getElementById('chat-box');
const postModal = document.getElementById('postModal');
const dynamicFields = document.getElementById('dynamicFields');
const postForm = document.getElementById('postForm');

// Current logged-in user
const currentUser = {
    name: "You",
    profilePic: "https://via.placeholder.com/50",
    college: "computing studies"
};

// Sample users (with different colleges)
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

// Sample chats
const chats = [
    { name: 'John Doe', messages: ['Hello!', 'How are you?'] },
    { name: 'Jane Smith', messages: ['Hi there!', 'Need help?'] },
];

// --- MAIN FUNCTIONS ---

// Show section
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

// Add Post
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
        const title = sampleData?.title || (document.getElementById('jobTitle') ? document.getElementById('jobTitle').value : "Sample Job Title");
        const desc = sampleData?.desc || (document.getElementById('jobDesc') ? document.getElementById('jobDesc').value : "Sample Job Description.");
        postContent += `<h3>${title}</h3><p>${desc}</p>`;
    } else if (section === 'look-client') {
        const title = sampleData?.title || (document.getElementById('jobTitle') ? document.getElementById('jobTitle').value : "Sample Service Title");
        const desc = sampleData?.desc || (document.getElementById('jobDesc') ? document.getElementById('jobDesc').value : "Sample Service Description.");
        postContent += `<h3>${title}</h3><p>${desc}</p>`;
    } else if (section === 'marketplace') {
        const productName = sampleData?.productName || (document.getElementById('productName') ? document.getElementById('productName').value : "Sample Product");
        const quantity = sampleData?.quantity || (document.getElementById('productQuantity') ? document.getElementById('productQuantity').value : "5");
        const color = sampleData?.color || (document.getElementById('productColor') ? document.getElementById('productColor').value : "Various");
        const desc = sampleData?.desc || (document.getElementById('productDesc') ? document.getElementById('productDesc').value : "Sample Product Description.");
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
    chats.forEach(chat => {
        const user = document.createElement('div');
        user.className = 'chat-user';
        user.textContent = chat.name;
        user.onclick = () => openChat(chat.name);
        chatList.appendChild(user);
    });
}

// --- NEW SEARCH & FILTER FUNCTIONS ---

// Search inside a section
function searchPosts(input) {
    const keyword = input.value.toLowerCase();
    const container = input.closest('.content-section').querySelector('.posts') || input.closest('.content-section').querySelector('.chat-list');
    const cards = container.querySelectorAll('.post-card, .chat-user');

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(keyword) ? "block" : "none";
    });
}

// Filter posts by college
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

// Load 10 sample posts on each section
function loadDefaultPosts() {
    sampleUsers.forEach(user => {
        addPost('find-job', user, { title: "Job Title Example", desc: "Description for job." });
        addPost('look-client', user, { title: "Service Needed", desc: "Looking for service." });
        addPost('marketplace', user, { productName: "Product Name", quantity: "10", color: "Red", desc: "Product details here." });
    });
}

// Initialize page
window.onload = function() {
    loadChatDirectory();
    loadDefaultPosts();
};
