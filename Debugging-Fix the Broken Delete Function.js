//L1 - Debugging: Fix the Broken Delete Function//
const deleteUser = (key) => {
    fetch(`https://your-project-id.firebaseio.com/users/${key}.json`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.json();
    })
    .then(() => {
      console.log("User deleted successfully");
  
      // Remove the deleted user from the UI dynamically
      const userRow = document.getElementById(`user-${key}`);
      if (userRow) {
        userRow.remove();
      }
    })
    .catch(error => console.error("Error deleting user:", error));
  };
  