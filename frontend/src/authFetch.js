function authFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
  
    return fetch(url, {
      ...options,
      headers,
    }).then(async (response) => {
      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized access, e.g., redirect to login
          // or refresh the token
          // TODO
        }
        const errorData = await response.json();
        return Promise.reject(errorData);
      }
      return response.json();
    });
}