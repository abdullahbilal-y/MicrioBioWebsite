// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = netlifyIdentity.currentUser();
    
    if (user) {
        console.log("User is logged in:", user);
        showLoggedInUI(user);
    } else {
        console.log("No user logged in");
        showLoggedOutUI();
    }

    // Initialize the Netlify Identity widget
    netlifyIdentity.on('login', user => {
        console.log('Login', user);
        showLoggedInUI(user);
        netlifyIdentity.close(); // Close the modal after login
    });

    netlifyIdentity.on('logout', () => {
        console.log('Logged out');
        showLoggedOutUI();
    });
});

// Functions to update UI
function showLoggedInUI(user) {
    // Update the login button to show user info and logout button
    document.querySelector('.login-item').innerHTML = `
        <div class="user-info">
            <p>Hi, ${user.user_metadata.full_name || user.email.split('@')[0]}</p>
            <button class="logout-button" onclick="netlifyIdentity.logout()">Logout</button>
        </div>
    `;
    
    // Show protected content (if any)
    const protectedContent = document.querySelectorAll('.protected-content');
    protectedContent.forEach(element => {
        element.style.display = 'block';
    });
}

function showLoggedOutUI() {
    // Reset to login button
    document.querySelector('.login-item').innerHTML = `
        <button class="netlify-identity-button">Login</button>
    `;
    
    // Initialize the login button
    document.querySelectorAll('.netlify-identity-button').forEach(button => {
        button.addEventListener('click', () => {
            netlifyIdentity.open();
        });
    });
    
    // Hide protected content
    const protectedContent = document.querySelectorAll('.protected-content');
    protectedContent.forEach(element => {
        element.style.display = 'none';
    });
}
// Customize the Netlify Identity widget
const customColors = {
    primaryColor: '#F3C693',
    textColor: '#222'
};

netlifyIdentity.setConfig({
    locale: 'en',
    theme: {
        ...customColors
    }
});