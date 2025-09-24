const requestData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                // Add any additional headers here if needed
            },
            body: JSON.stringify(data), // Convert data to JSON string
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the response JSON
        const responseData = await response.json();

        // Handle the responseData as needed
        console.log('Response Data:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error:', error);
    }
}

export { requestData };